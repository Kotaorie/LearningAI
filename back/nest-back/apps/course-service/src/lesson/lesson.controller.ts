import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Controller('lesson')
export class LessonController {
    constructor(private readonly lessonService: LessonService){}

    @Post()
        async CreateLesson(@Body() dto: CreateLessonDto){
            return this.lessonService.create(dto);
        }

        @Get()
        async GetLesson(@Param('id') id: number){
            return this.lessonService.findById(id);
        }

        @Get('by-chapter/:chapterId')
          async getLessonsByCourse(@Param('chapterId') chapterId: string) {
            return this.lessonService.findByChapterId(Number(chapterId));
          }
        
          @Put(':id')
          async updateLesson(@Param('id') id: number, @Body() dto: Partial<CreateLessonDto>) {
            return this.lessonService.update(id, dto);
          }
        
          @Delete(':id')
          async deleteLesson(@Param('id') id: number) {
            return this.lessonService.delete(id);
          }



}
