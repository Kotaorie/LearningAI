import { Module } from '@nestjs/common';
import { CourseResolver } from './resolvers/course.resolver';
import { ChapterResolver } from './resolvers/chapter.resolver';
import { LessonResolver } from './resolvers/lesson.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';


@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'COURSE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'course_queue',
          queueOptions: { durable: false },
        },
      },
    ])
  ],
  providers: [CourseResolver, ChapterResolver, LessonResolver],
})
export class CourseModule {}