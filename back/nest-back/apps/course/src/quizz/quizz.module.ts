import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizzService } from './quizz.service';
import { Quizz } from '../../../../libs/database/src/entities/quizz.entity';
import { JwtModule } from '@nestjs/jwt';
import { QuizzResolver } from './quizz.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quizz]),
    JwtModule.register({
          secret: process.env.JWT_SECRET || 'defaultSecret',
          signOptions: { expiresIn: '1d' },
        }),
  ],
  providers: [QuizzService, QuizzResolver],
  exports: [QuizzService],
})
export class QuizzModule {}
