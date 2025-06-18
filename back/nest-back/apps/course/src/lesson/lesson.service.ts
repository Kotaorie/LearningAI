import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from '../../../../libs/database/src/entities/lesson.entity';

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

    async findById(id: string): Promise<Lesson | null> {
    return this.lessonRepository.findOne({ where: { id } }); 
  }

  async findByChapterId(chapterId: string): Promise<Lesson[]> {
      return this.lessonRepository.find({
        where: { chapterId: chapterId },
        order: { position: 'ASC' },
      });
  }
  async update(id: string, data: Partial<Lesson>): Promise<Lesson> {
    await this.lessonRepository.update(id, data);
    const updated = await this.findById(id);
  
    if (!updated) {
      throw new Error(`Lesson with ID ${id} not found`);
    }
  
    return updated;
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
