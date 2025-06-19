import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from '../../../../libs/database/src/entities/lesson.entity';
import { Groq } from 'groq-sdk';

@Injectable()
export class LessonService {
  constructor(
      @InjectRepository(Lesson)
  private lessonRepository: Repository<Lesson>,
  ){}

  async create(data: Partial<Lesson>): Promise<Lesson> {
    const lesson = this.lessonRepository.create({ ...data, contentMarkdown: '' });
    return this.lessonRepository.save(lesson);
  } 

    async findById(id: string): Promise<Lesson | null> {
    return this.lessonRepository.findOne({ where: { id } }); 
  }

  async findByChapterId(chapterId: string): Promise<Lesson[]> {
      return this.lessonRepository.find({
        where: { chapterId: chapterId },
        order: { position: 'ASC' },
      });
  }

  async generate(id: string, coursTitle: string): Promise<Lesson> {
    const lesson = await this.findById(id);
    if (!lesson) {
      throw new Error(`Lesson with ID ${id} not found`);
    }
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY  });
    var content = ''
    const chatCompletion = await groq.chat.completions.create({
      "messages": [
        {
          "role": "user",
          "content": "Génére moi un cours de maximum 3 page en markdown portant sur le sujet suivant: "+lesson.title+" pour le cours "+coursTitle+". Je ne souhaite pas le nom du chapitre ni de la leçon, juste le contenu du cours. Le cours doit être structuré en sections et sous-sections avec des titres et sous-titres. Le tout en français.",
        }
      ],
      "model": "llama3-8b-8192",
      "temperature": 0.4,
      "max_completion_tokens": 4024,
      "top_p": 1,
      "stream": true,
      "stop": null
    });
    for await (const chunk of chatCompletion) {
      content += chunk.choices[0]?.delta?.content || '';
    }
    this.lessonRepository.update(id, { contentMarkdown: content });
    const updatedLesson = await this.findById(id);
    if (!updatedLesson) {
      throw new Error(`Lesson with ID ${id} not found after update`);
    }
    return updatedLesson;
  }

  async update(id: string, data: Partial<Lesson>): Promise<Lesson> {
    await this.lessonRepository.update(id, data);
    const updated = await this.findById(id);
  
    if (!updated) {
      throw new Error(`Lesson with ID ${id} not found`);
    }
  
    return updated;
  }

  async deleteByChapterId(chapterId: string): Promise<{ deleted: boolean }> {
    const result = await this.lessonRepository.delete({ chapterId: chapterId });
    if (result.affected === undefined || result.affected === null) {
      const errorMsg = `Delete operation did not return an affected count; no lessons deleted for chapterId: ${chapterId}`;
      throw new Error(errorMsg);
    }
    return { deleted: result.affected > 0  };
  }
  
  async delete(id: string): Promise<{ deleted: boolean }> {
    const result = await this.lessonRepository.delete(id);
    if (result.affected === undefined || result.affected === null) {
      const errorMsg = `Delete operation did not return an affected count; no schedule deleted for id: ${id}`;
      throw new Error(errorMsg);
    }
    return { deleted: result.affected > 0  };
  }
}
