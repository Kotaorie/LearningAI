import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../../libs/database/src/entities/user.entity';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(data: Partial<User>): Promise<User> {
    if (data.password_hash) {
      const salt = await bcrypt.genSalt(10);
      data.password_hash = await bcrypt.hash(data.password_hash, salt);
    }
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async update(data: Partial<User>): Promise<User | null> {
    if(data.password_hash) {
      const salt = await bcrypt.genSalt(10);
      data.password_hash = await bcrypt.hash(data.password_hash, salt);
    }
    const id = data.id;
    if (!id) {
      throw new Error('User ID is required for update');
    }
    await this.userRepository.update(id, data);
    return this.userRepository.findOne({ where: { id } });
  }

  async updateGoogleTokens(userId: string, tokens: any): Promise<void> {
    await this.userRepository.update(userId, {
      googleTokens: tokens,
    });
  }

  async delete(id: string): Promise<{ deleted: boolean }> {
    await this.userRepository.delete(id);
    return { deleted: true };
  }
}
