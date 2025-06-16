import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { CreateChapterDto } from './dto/create-chapter.dto';

@Controller('chapter')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Post()
  async createChapter(@Body() dto: CreateChapterDto) {
    return this.chapterService.create(dto);
  }

  @Get()
  async getAllChapter() {
    return this.chapterService.findAll();
  }

  @Get(':id')
  async getChapter(@Param('id') id: number) {
    return this.chapterService.findById(id);
  }

  @Get('by-course/:courseId')
  async getChaptersByCourse(@Param('courseId') courseId: string) {
    return this.chapterService.findByCourseId(Number(courseId));
  }

  @Put(':id')
  async updateChapter(@Param('id') id: number, @Body() dto: Partial<CreateChapterDto>) {
    return this.chapterService.update(id, dto);
  }

  @Delete(':id')
  async deleteChapter(@Param('id') id: number) {
    return this.chapterService.delete(id);
  }
}
