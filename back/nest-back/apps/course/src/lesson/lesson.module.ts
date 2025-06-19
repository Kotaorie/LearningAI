import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonService } from './lesson.service';
import { Lesson } from '../../../../libs/database/src/entities/lesson.entity';
import { LessonController } from './lesson.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson]),
  ],
  controllers: [LessonController],
  providers: [LessonService],
  exports: [LessonService],
})
export class LessonModule {}
