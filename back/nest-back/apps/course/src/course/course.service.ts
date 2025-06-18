import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../../../../libs/database/src/entities/course.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async create(data: Partial<Course>): Promise<Course> {
    data.createdAt = new Date();
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
}
