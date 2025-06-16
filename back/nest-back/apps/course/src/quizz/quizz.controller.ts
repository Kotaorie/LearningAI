import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { QuizzService } from './quizz.service';
import { CreateQuizzDto } from './dto/create-quizz.dto';

@Controller('quizz')
export class QuizzController {
  constructor(private readonly quizzService: QuizzService) {}

  @Post()
  async createQuizz(@Body() dto: CreateQuizzDto) {
    return this.quizzService.create(dto);
  }

  @Get()
  async getAllQuizz() {
    return this.quizzService.findAll();
  }

  @Get(':id')
  async getQuizz(@Param('id') id: number) {
    return this.quizzService.findById(id);
  }

  @Get(':id/questions')
  async getQuestions(@Param('id') id: number) {
    return this.quizzService.getQuestionsByQuizId(id);
  }

  @Put(':id')
  async updateQuizz(@Param('id') id: number, @Body() dto: Partial<CreateQuizzDto>) {
    return this.quizzService.update(id, dto);
  }

  @Delete(':id')
  async deleteQuizz(@Param('id') id: number) {
    return this.quizzService.delete(id);
  }
}
