import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quizz } from './quizz.entity';

@Injectable()
export class QuizzService {
  constructor(
    @InjectRepository(Quizz)
    private quizzRepository: Repository<Quizz>,
  ) {}

  async create(data: Partial<Quizz>): Promise<Quizz> {
    const quizz = this.quizzRepository.create(data);
    return this.quizzRepository.save(quizz);
  }

  async findById(id: number): Promise<Quizz | null> {
    return this.quizzRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<Quizz[]> {
      return this.quizzRepository.find();
    }

  async getQuestionsByQuizId(id: number): Promise<any[]> {
    const quizz = await this.quizzRepository.findOne({
      where: { id },
      select: ['questions_json'],
    });

    if (!quizz) {
      throw new NotFoundException(`Quiz with id ${id} not found`);
    }

    return quizz.questions_json;
  }

  async update(id: number, data: Partial<Quizz>): Promise<Quizz> {
      await this.quizzRepository.update(id, data);
      const updated = await this.findById(id);
    
      if (!updated) {
        throw new Error(`Quizz with ID ${id} not found`);
      }
    
      return updated;
    }

  async delete(id: number): Promise<void> {
    await this.quizzRepository.delete(id);
  }
}
