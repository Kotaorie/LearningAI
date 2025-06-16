import { Test, TestingModule } from '@nestjs/testing';
import { QuizzController } from './quizz.controller';
import { QuizzService } from './quizz.service';

describe('quizzController', () => {
  let controller: QuizzController;
  let service: QuizzService;

  const mockquizz = { id: 1, title: 'Intro', course_id: 1, position: 1 };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockquizz),
    findById: jest.fn().mockResolvedValue(mockquizz),
    findByCourseId: jest.fn().mockResolvedValue([mockquizz]),
    update: jest.fn().mockResolvedValue(mockquizz),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizzController],
      providers: [
        {
          provide: QuizzService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<QuizzController>(QuizzController);
    service = module.get<QuizzService>(QuizzService);
  });

 it('should create a quizz', async () => {
  const dto = {
  id: 1,
  course_id: 10,
  chapter_id: 1,
  title: 'Test Quiz',
  questions_json: [
        { question: 'What is 2 + 2?', choices: [2, 4, 5], answer: 4 }
      ],
  created_at: new Date('2024-11-12'),
};


  const result = await controller.createQuizz(dto);
  expect(result).toEqual(mockquizz);
});


  it('should return a quizz by ID', async () => {
    const result = await controller.getQuizz(1);
    expect(result).toEqual(mockquizz);
  });

  /*it('should return questions of a quizz by ID', async () => {
    const result = await controller.getQuestions(1);
    expect(result).toEqual(mockquizz.questions_json);
    expect(mockService.getQuestionsByQuizId).toHaveBeenCalledWith(1);
  });*/

  it('should update a quizz', async () => {
    const result = await controller.updateQuizz(1, { title: 'New Title' });
    expect(result).toEqual(mockquizz);
  });

  it('should delete a quizz', async () => {
    await controller.deleteQuizz(1);
    expect(mockService.delete).toHaveBeenCalledWith(1);
  });
});
