import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quizz } from '../../../../libs/database/src/entities/quizz.entity';

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

  async findById(id: string): Promise<Quizz | null> {
    return this.quizzRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<Quizz[]> {
      return this.quizzRepository.find();
    }

  async getQuestionsByQuizId(id: string): Promise<any[]> {
    const quizz = await this.quizzRepository.findOne({
      where: { id },
      select: ['questionsJson'],
    });

    if (!quizz) {
      throw new NotFoundException(`Quiz with id ${id} not found`);
    }

    return quizz.questionsJson;
  }

  async update(id: string, data: Partial<Quizz>): Promise<Quizz> {
      await this.quizzRepository.update(id, data);
      const updated = await this.findById(id);
    
      if (!updated) {
        throw new Error(`Quizz with ID ${id} not found`);
      }
    
      return updated;
    }

  async delete(id: string): Promise<{ deleted: boolean }> {
    const result = await this.quizzRepository.delete(id);
    if (result.affected === undefined || result.affected === null) {
      const errorMsg = `Delete operation did not return an affected count; no schedule deleted for id: ${id}`;
      throw new Error(errorMsg);
    }
    return { deleted: result.affected > 0  };
  }
}
