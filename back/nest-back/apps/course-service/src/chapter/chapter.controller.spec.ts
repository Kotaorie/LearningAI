import { Test, TestingModule } from '@nestjs/testing';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';

describe('ChapterController', () => {
  let controller: ChapterController;
  let service: ChapterService;

  const mockChapter = { id: 1, title: 'Intro', course_id: 1, position: 1 };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockChapter),
    findById: jest.fn().mockResolvedValue(mockChapter),
    findByCourseId: jest.fn().mockResolvedValue([mockChapter]),
    update: jest.fn().mockResolvedValue(mockChapter),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChapterController],
      providers: [
        {
          provide: ChapterService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ChapterController>(ChapterController);
    service = module.get<ChapterService>(ChapterService);
  });

 it('should create a chapter', async () => {
  const dto = {
    title: 'Intro',
    course_id: 1,
    position: 1,
  };

  const result = await controller.createChapter(dto);
  expect(result).toEqual(mockChapter);
});


  it('should return a chapter by ID', async () => {
    const result = await controller.getChapter(1);
    expect(result).toEqual(mockChapter);
  });

  it('should return chapters by course ID', async () => {
    const result = await controller.getChaptersByCourse('1');
    expect(result).toEqual([mockChapter]);
  });

  it('should update a chapter', async () => {
    const result = await controller.updateChapter(1, { title: 'New Title' });
    expect(result).toEqual(mockChapter);
  });

  it('should delete a chapter', async () => {
    await controller.deleteChapter(1);
    expect(mockService.delete).toHaveBeenCalledWith(1);
  });
});
