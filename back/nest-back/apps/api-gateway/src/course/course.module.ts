import { Module } from '@nestjs/common';
import { CourseResolver } from './resolvers/course.resolver';
import { ChapterResolver } from './resolvers/chapter.resolver';
import { LessonResolver } from './resolvers/lesson.resolver';

@Module({
  providers: [CourseResolver, ChapterResolver, LessonResolver],
})
export class CourseModule {}