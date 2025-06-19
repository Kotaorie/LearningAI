import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '../../../libs/database/src/entities/course.entity';
import { Lesson } from '../../../libs/database/src/entities/lesson.entity';
import { Quizz } from '../../../libs/database/src/entities/quizz.entity';
import { DatabaseModule } from '../../../libs/database/src/database.module';
import { Chapter } from '../../../libs/database/src/entities/chapter.entity';


import { CourseModule } from './course/course.module';
import { ChapterModule } from './chapter/chapter.module';
import { LessonModule } from './lesson/lesson.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Course, Chapter, Lesson, Quizz]),
    CourseModule,
    ChapterModule,
    LessonModule,
  ],
})
export class AppCourseModule {}
