import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async create(data: Partial<Course>): Promise<Course> {
    const course = this.courseRepository.create(data);
    return this.courseRepository.save(course);
  }

  async findAll(): Promise<Course[]> {
    return this.courseRepository.find();
  }

  async findById(id: number): Promise<Course | null> {
    return this.courseRepository.findOne({ where: { id } });
  }

 async update(id: number, data: Partial<Course>): Promise<Course> {
  await this.courseRepository.update(id, data);
  const updated = await this.findById(id);

  if (!updated) {
    throw new Error(`Course with ID ${id} not found`);
  }

  return updated;
}


  async delete(id: number): Promise<void> {
    await this.courseRepository.delete(id);
  }
}
