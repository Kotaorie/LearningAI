import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonService } from './lesson.service';
import { Lesson } from '../../../../libs/database/src/entities/lesson.entity';
import { JwtModule } from '@nestjs/jwt';
import { LessonResolver } from './lesson.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson]),
    JwtModule.register({
          secret: process.env.JWT_SECRET || 'defaultSecret',
          signOptions: { expiresIn: '1d' },
        }),
  ],
  providers: [LessonService, LessonResolver],
  exports: [LessonService],
})
export class LessonModule {}
