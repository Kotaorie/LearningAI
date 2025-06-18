import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseService } from './course.service';
import { Course } from '../../../../libs/database/src/entities/course.entity';
import { CourseController } from './course.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course]),
  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}
