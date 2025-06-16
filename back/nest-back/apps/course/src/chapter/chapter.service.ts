import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chapter } from './chapter.entity';

@Injectable()
export class ChapterService {
    constructor(
        @InjectRepository(Chapter)
    private chapterRepository: Repository<Chapter>,
    ){}

    async create(data: Partial<Chapter>): Promise<Chapter> {
    const user = this.chapterRepository.create(data);
    return this.chapterRepository.save(user);
  } 
  
    async findAll(): Promise<Chapter[]> {
      return this.chapterRepository.find();
    }

    async findById(id: number): Promise<Chapter | null> {
    return this.chapterRepository.findOne({ where: { id } }); 
  }
  async findByCourseId(courseId: number): Promise<Chapter[]> {
    return this.chapterRepository.find({
      where: { course_id: courseId },
      order: { position: 'ASC' },
    });
}
async update(id: number, data: Partial<Chapter>): Promise<Chapter> {
  await this.chapterRepository.update(id, data);
  const updated = await this.findById(id);

  if (!updated) {
    throw new Error(`Chapter with ID ${id} not found`);
  }

  return updated;
}

async delete(id: number): Promise<void> {
  await this.chapterRepository.delete(id);
}

}
