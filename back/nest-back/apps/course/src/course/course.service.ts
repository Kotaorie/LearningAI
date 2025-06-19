import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../../../../libs/database/src/entities/course.entity';
import { Groq } from 'groq-sdk';
import { ChapterService } from '../chapter/chapter.service';
import { LessonService } from '../lesson/lesson.service';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private readonly chapterService: ChapterService,
    private readonly lessonService: LessonService,
  ) {}

  async create(data: Partial<Course>): Promise<Course> {
    data.createdAt = new Date();
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY  });
    var content = ''
    const chatCompletion = await groq.chat.completions.create({
      "messages": [
        {
          "role": "user",
          "content": "Tu est un ensegnant expert en "+data.type+" avec énormement de connaisance sur "+data.title+". rédige moi une structure de cours pour une duré de 2mois avec 4h de cours par semaine. Mon but est d'acquerir des connaissances sur"+data.sujet+". Les cours sont composé de chapitre et de lesson.\n\nJe veux un resultat utilisant la structure suivante : \n\ntitre du cours \n\ndescription gloabl\n\nChapitre 1 \n\n - leçon 1.1\n - leçon 1.2\n\nChaptire 2 \n\n... \n\n Le tout en français"
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
    if(!data.sujet || !data.title) {
      throw new Error('Sujet is required to create a course');
    }
    const course = this.courseRepository.create(data);
    const coursSave = await this.courseRepository.save(course);
    const chapitreRegex = /\*\*Chapitre\s(\d)\s:\s(.*?)\*\*/g;
    const leconRegex = /\*\*Leçon\s(\d\.\d)\s:\s(.*?)\*\*/g;
    let chapitreMatch: any;
    let leconMatch: any;
    let chapitres: { number: string; title: string }[] = [];
    let lessons: { code: string; title: string; chapitreNumber: string }[] = [];
    while ((chapitreMatch = chapitreRegex.exec(content)) !== null) {
      chapitres.push({ number: chapitreMatch[1], title: chapitreMatch[2].trim() });
    }

    while ((leconMatch = leconRegex.exec(content)) !== null) {
      const code = leconMatch[1];
      const title = leconMatch[2].trim();
      const chapitreNumber = code.split('.')[0];
      lessons.push({ code, title, chapitreNumber });
    }

    for (const chapitre of chapitres) {
      const chapterData = {
        courseId: coursSave.id,
        title: chapitre.title,
        position: parseInt(chapitre.number, 10),
      };
      const createdChapter = await this.chapterService.create(chapterData);
      const chapterLessons = lessons.filter(lesson => lesson.chapitreNumber === chapitre.number);
      for (const lesson of chapterLessons) {
        const lessonData = {
          chapterId: createdChapter.id,
          title: lesson.title,
          position: parseInt(lesson.code.split('.')[1], 10),
        };
        await this.lessonService.create(lessonData);
      }
      if (createdChapter.position === 1) {
        await this.chapterService.generate(createdChapter.id, data.title);
      }
    }
    return coursSave
  }

  async generateChapter(id: string, chapterId: string): Promise<any> {
    const course = await this.findById(id);
    if (!course) {
      throw new Error(`Course with ID ${id} not found`);
    }
    const chapters = await this.chapterService.findByCourseId(id);
    if (!chapters || chapters.length === 0) {
      throw new Error(`Course with ID ${id} has no chapters to generate`);
    }
    const chapter = await this.chapterService.generate(chapterId, course.title);
    return chapter
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
