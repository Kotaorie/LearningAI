import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseService } from './course.service';
import { Course } from '../../../../libs/database/src/entities/course.entity';
import { JwtModule } from '@nestjs/jwt';
import { CourseResolver } from './course.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course]),
    JwtModule.register({
          secret: process.env.JWT_SECRET || 'defaultSecret',
          signOptions: { expiresIn: '1d' },
        }),
  ],
  providers: [CourseService, CourseResolver],
  exports: [CourseService],
})
export class CourseModule {}
