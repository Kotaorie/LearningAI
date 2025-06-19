import { Test, TestingModule } from '@nestjs/testing';
import { ChapterResolver } from './chapter.resolver';
import { ChapterService } from './chapter.service';

describe('ChapterResolver', () => {
  let Resolver: ChapterResolver;
  let service: ChapterService;

  const mockChapter = { id: 1, title: 'Intro', course_id: '1', position: 1 };
  const mockChapter2 = { id: 1, title: 'Dev', course_id: '1', position: 2 };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockChapter),
    findById: jest.fn().mockResolvedValue(mockChapter),
    findByCourseId: jest.fn().mockResolvedValue([mockChapter,mockChapter2]),
    update: jest.fn().mockResolvedValue(mockChapter),
    delete: jest.fn().mockResolvedValue(mockChapter),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChapterResolver],
      providers: [
        {
          provide: ChapterService,
          useValue: mockService,
        },
      ],
    }).compile();

    Resolver = module.get<ChapterResolver>(ChapterResolver);
    service = module.get<ChapterService>(ChapterService);
  });

 it('should create a chapter', async () => {
  const input = {
    title: 'Intro',
    courseId: '1',
    position: 1,
  };

  const result = await Resolver.createChapter(input);
  expect(result).toEqual(mockChapter);
});


  it('should return a chapter by ID', async () => {
    const result = await Resolver.getChapter('1');
    expect(result).toEqual(mockChapter);
  });

  it('should return chapters by course ID', async () => {
    const result = await Resolver.getChapters('1');
    expect(result).toEqual([mockChapter,mockChapter2]);
  });

  it('should update a chapter', async () => {
    const updateInput = {
    title: 'Intro Modif',
    courseId: '1',
    position: 1,
  };

    const result = await Resolver.updateChapter('1', updateInput);
    expect(result).toEqual(mockChapter);
    expect(mockService.update).toHaveBeenCalledWith('1', updateInput);
  });

  it('should delete a chapter', async () => {
    await Resolver.deleteChapter('1');
    expect(mockService.delete).toHaveBeenCalledWith('1');
  });
});
