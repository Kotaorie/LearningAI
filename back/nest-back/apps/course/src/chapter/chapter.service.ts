import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chapter } from '../../../../libs/database/src/entities/chapter.entity';
import { LessonService } from '../lesson/lesson.service';

@Injectable()
export class ChapterService {
  constructor(
    @InjectRepository(Chapter) private chapterRepository: Repository<Chapter>,
    private readonly lessonService: LessonService,
  ){}

  async create(data: Partial<Chapter>): Promise<Chapter> {
    const chapter = this.chapterRepository.create(data);
    return this.chapterRepository.save(chapter);
  } 

  async findAll(): Promise<Chapter[]> {
    return this.chapterRepository.find();
  }

  async findById(id: string): Promise<Chapter | null> {
    return this.chapterRepository.findOne({ where: { id: id as any }, relations: ['lessons'] }); 
  }

  async findByCourseId(courseId: string): Promise<Chapter[]> {
    return this.chapterRepository.find({
      where: { courseId: courseId },
      order: { position: 'ASC' },
      relations: ['lessons'],
    });
  }

  async generate(id:string, courseTitle: string): Promise<Chapter> {
    const chapter = await this.findById(id);
    if (!chapter) {
      throw new Error(`Chapter with ID ${id} not found`);
    }
    const lessons = chapter.lessons;
    if (!lessons) {
      throw new Error(`Chapter with ID ${id} has no lessons to generate`);
    }
    for (const lesson of lessons) {
      await this.lessonService.generate(lesson.id, courseTitle);
    }
    const chapterUpdated = await this.findById(id);
    return chapterUpdated ? chapterUpdated : chapter;
  }
 
  async update(id: string, data: Partial<Chapter>): Promise<Chapter> {
    await this.chapterRepository.update(id, data);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`Chapter with ID ${id} not found`);
    }

    return updated;
  }

  async delete(id: string): Promise<{ deleted: boolean }> {
    const result = await this.chapterRepository.delete(id);
    if (result.affected === undefined || result.affected === null || result.affected === 0) {
      throw new Error(`Chapter with ID ${id} not found`);
    }
    return { deleted: result.affected > 0  };
  }

}
