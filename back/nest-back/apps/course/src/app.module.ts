import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course/course.entity';
import { Chapter } from './chapter/chapter.entity';
import { Lesson } from './lesson/lesson.entity';
import { Quizz } from './quizz/quizz.entity';

import { CourseService } from './course/course.service';
import { CourseController } from './course/course.controller';
import { ChapterService } from './chapter/chapter.service';
import { ChapterController } from './chapter/chapter.controller';
import { LessonService } from './lesson/lesson.service';
import { LessonController } from './lesson/lesson.controller';
import { QuizzService } from './quizz/quizz.service';
import { QuizzController } from './quizz/quizz.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.POSTGRES_USER || 'user',
      password: process.env.POSTGRES_PASSWORD || 'password',
      database: process.env.POSTGRES_DB || 'learning-ai-db',
      entities: [Course, Chapter, Lesson, Quizz],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Course, Chapter, Lesson, Quizz]),
  ],
  controllers: [CourseController, ChapterController, LessonController, QuizzController],
  providers: [CourseService, ChapterService, LessonService, QuizzService],
})
export class AppModule {}
