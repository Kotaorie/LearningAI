import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChapterService } from './chapter.service';
import { Chapter } from '../../../../libs/database/src/entities/chapter.entity';
import { ChapterController } from './chapter.controller';
import { LessonModule } from '../lesson/lesson.module';

@Module({
  imports: [
    LessonModule,
    TypeOrmModule.forFeature([Chapter]),
  ],
  controllers: [ChapterController],
  providers: [ChapterService],
  exports: [ChapterService],
})
export class ChapterModule {}
