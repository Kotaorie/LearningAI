import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../../../../libs/database/src/entities/course.entity';
import { Groq } from 'groq-sdk';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async create(data: Partial<Course>): Promise<Course> {
    console.log('Creating course with data:', data);
    data.createdAt = new Date();
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY  });
    var content = ''
    const chatCompletion = await groq.chat.completions.create({
      "messages": [
        {
          "role": "user",
          "content": "Tu est un ensegnant passioné par le/l' "+data.type+" avec énormement de connaisance sur "+data.type+". rédige moi une structure de cours pour une duré de 2mois avec 4h de cours par semaine. Mon but est d'acquerir des connaissances sur"+data.sujet+". Les cours sont composé de chapitre et de lesson.\n\nJe veux un resultat utilisant la structure suivante : \n\ntitre du cours \n\ndescription gloabl\n\nChapitre 1 \n\n - leçon 1.1\n - leçon 1.2\n\nChaptire 2 \n\n... \n\n Le tout en français"
        }
      ],
      "model": "llama3-8b-8192",
      "temperature": 0.4,
      "max_completion_tokens": 1024,
      "top_p": 1,
      "stream": true,
      "stop": null
    });
    for await (const chunk of chatCompletion) {
      content += chunk.choices[0]?.delta?.content || '';
    }
    const course = this.courseRepository.create(data);
    return this.courseRepository.save(course);
  }

  async findAll(): Promise<Course[]> {
    return this.courseRepository.find();
  }

  async findById(id: string): Promise<Course | null> {
    return this.courseRepository.findOne({ where: { id: id as any }, relations: ['chapters', 'chapters.lessons'] });
  }

 async update(id: string, data: Partial<Course>): Promise<Course> {
  await this.courseRepository.update(id, data);
  const updated = await this.findById(id);

  if (!updated) {
    throw new Error(`Course with ID ${id} not found`);
  }

  return updated;
}


  async delete(id: string): Promise<{deleted: boolean}> {
    const result = await this.courseRepository.delete(id);
    if (result.affected === undefined || result.affected === null || result.affected === 0) {
      throw new Error(`Course with ID ${id} not found`);
    }
    return { deleted: result.affected > 0 };
  }

  //
}
