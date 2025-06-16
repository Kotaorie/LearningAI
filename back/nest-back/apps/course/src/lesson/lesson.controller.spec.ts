import { Test, TestingModule } from '@nestjs/testing';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';

describe('lessonController', () => {
  let controller: LessonController;
  let service: LessonService;

  const mocklesson = { id: 1, title: 'Intro', course_id: 1, position: 1 };

  const mockService = {
    create: jest.fn().mockResolvedValue(mocklesson),
    findById: jest.fn().mockResolvedValue(mocklesson),
    findByCourseId: jest.fn().mockResolvedValue([mocklesson]),
    update: jest.fn().mockResolvedValue(mocklesson),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonController],
      providers: [
        {
          provide: LessonService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<LessonController>(LessonController);
    service = module.get<LessonService>(LessonService);
  });

 it('should create a lesson', async () => {
  const dto = {
    id: 1,
    title: 'Intro',
    chapter_id: 1,
    position: 1,
    content_markdown: 'texte test',
  };

  const result = await controller.CreateLesson(dto);
  expect(result).toEqual(mocklesson);
});


  it('should return a lesson by ID', async () => {
    const result = await controller.GetLesson(1);
    expect(result).toEqual(mocklesson);
  });

  it('should return lessons by course ID', async () => {
    const result = await controller.getLessonsByCourse('1');
    expect(result).toEqual([mocklesson]);
  });

  it('should update a lesson', async () => {
    const result = await controller.updateLesson(1, { title: 'New Title' });
    expect(result).toEqual(mocklesson);
  });

  it('should delete a lesson', async () => {
    await controller.deleteLesson(1);
    expect(mockService.delete).toHaveBeenCalledWith(1);
  });
});
