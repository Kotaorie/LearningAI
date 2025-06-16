import { Controller, Post, Body, Get, Param, Delete, Patch } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  async createCourse(@Body() dto: CreateCourseDto) {
    return this.courseService.create(dto);
  }

  @Get()
  async getAllCourses() {
    return this.courseService.findAll();
  }

  @Get(':id')
  async getCourse(@Param('id') id: string) {
    return this.courseService.findById(+id);
  }

  @Patch(':id')
  async updateCourse(@Param('id') id: string, @Body() dto: Partial<CreateCourseDto>) {
    return this.courseService.update(+id, dto);
  }

  @Delete(':id')
  async deleteCourse(@Param('id') id: string) {
    return this.courseService.delete(+id);
  }
}
