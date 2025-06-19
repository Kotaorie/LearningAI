import { Test, TestingModule } from '@nestjs/testing';
import { LessonResolver } from './lesson.resolver';
import { LessonService } from './lesson.service';

describe('lessonController', () => {
  let resolver: LessonResolver;
  let service: LessonService;

  const mockLesson = { id: 1, title: 'Intro', course_id: 1, position: 1 };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockLesson),
    findById: jest.fn().mockResolvedValue(mockLesson),
    findByChapterId: jest.fn().mockResolvedValue([mockLesson]),
    update: jest.fn().mockResolvedValue(mockLesson),
    delete: jest.fn().mockResolvedValue(mockLesson),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonResolver],
      providers: [
        {
          provide: LessonService,
          useValue: mockService,
        },
      ],
    }).compile();

    resolver = module.get<LessonResolver>(LessonResolver);
    service = module.get<LessonService>(LessonService);
  });

 it('should create a lesson', async () => {
    const input = {
      id: '1',
      title: 'Intro',
      chapterId: '1',
      position: 1,
      contentMarkdown: 'texte test',
    };
    const result = await resolver.createLesson(input);
    expect(result).toEqual(mockLesson);
    expect(mockService.create).toHaveBeenCalledWith(input);
  });


  it('should return a lesson by ID', async () => {
    const result = await resolver.getLesson('1');
    expect(result).toEqual(mockLesson);
  });

  it('should return lessons by course ID', async () => {
    const result = await resolver.getLessonsByChapterId('1');
    expect(result).toEqual([mockLesson]);
  });
  
  it('should update a lesson', async () => {
    const updateInput = {
  id: '1',
  title: 'New Title',
  chapterId: '2',         
  position: 1,           
  contentMarkdown: 'texte test', 
};

  const result = await resolver.updateLesson('1', updateInput);
  expect(result).toEqual(mockLesson);
  expect(mockService.update).toHaveBeenCalledWith('1', updateInput);

  });

  it('should delete a lesson', async () => {
    await resolver.deleteLesson('1');
    expect(mockService.delete).toHaveBeenCalledWith('1');
  });
});
