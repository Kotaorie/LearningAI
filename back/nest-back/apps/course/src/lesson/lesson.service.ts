import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './lesson.entity';

@Injectable()
export class LessonService {
    constructor(
        @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    ){}

    async create(data: Partial<Lesson>): Promise<Lesson> {
    const user = this.lessonRepository.create(data);
    return this.lessonRepository.save(user);
  } 

    async findById(id: number): Promise<Lesson | null> {
    return this.lessonRepository.findOne({ where: { id } }); 
  }

  async findByChapterId(chapterId: number): Promise<Lesson[]> {
      return this.lessonRepository.find({
        where: { chapter_id: chapterId },
        order: { position: 'ASC' },
      });
  }
  async update(id: number, data: Partial<Lesson>): Promise<Lesson> {
    await this.lessonRepository.update(id, data);
    const updated = await this.findById(id);
  
    if (!updated) {
      throw new Error(`Lesson with ID ${id} not found`);
    }
  
    return updated;
  }
  
  async delete(id: number): Promise<void> {
    await this.lessonRepository.delete(id);
  }
}
