import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { Course } from './course.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course]),
    JwtModule.register({
          secret: process.env.JWT_SECRET || 'defaultSecret',
          signOptions: { expiresIn: '1d' },
        }),
  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class UserModule {}
