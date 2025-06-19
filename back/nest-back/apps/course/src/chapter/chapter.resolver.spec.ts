import { Test, TestingModule } from '@nestjs/testing';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';

const mockChannel = { ack: jest.fn() };
const mockMsg = {};
const mockContext = {
  getChannelRef: () => mockChannel,
  getMessage: () => mockMsg,
};

describe('ChapterController', () => {
  let controller: ChapterController;
  let service: ChapterService;

  const mockChapter = { id: 1, title: 'Intro', course_id: '1', position: 1 };
  const mockChapter2 = { id: 2, title: 'Dev', course_id: '1', position: 2 };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockChapter),
    findById: jest.fn().mockResolvedValue(mockChapter),
    findByCourseId: jest.fn().mockResolvedValue([mockChapter, mockChapter2]),
    update: jest.fn().mockResolvedValue(mockChapter),
    delete: jest.fn().mockResolvedValue({ deleted: true }),
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

    // Remet les mocks à zéro avant chaque test
    jest.clearAllMocks();
  });

  it('should create a chapter', async () => {
    const input = {
      title: 'Intro',
      course_id: '1',
      position: 1,
    };
    const result = await controller.createChapter(input, mockContext as any);
    expect(result).toEqual(mockChapter);
    expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
  });

  it('should return a chapter by ID', async () => {
    const payload = { id: '1' };
    const result = await controller.getChapter(payload, mockContext as any);
    expect(result).toEqual(mockChapter);
    expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
  });

  it('should return chapters by course ID', async () => {
    const payload = { courseId: '1' };
    const result = await controller.getChaptersByCourseId(payload, mockContext as any);
    expect(result).toEqual([mockChapter, mockChapter2]);
    expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
  });

  it('should update a chapter', async () => {
    const payload = { id: '1', updateChapterInput: { title: 'Intro Modif', position: 1 } };
    const result = await controller.updateChapter(payload, mockContext as any);
    expect(result).toEqual(mockChapter);
    expect(mockService.update).toHaveBeenCalledWith('1', { title: 'Intro Modif', position: 1 });
    expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
  });

  it('should delete a chapter', async () => {
    const payload = { id: '1' };
    const result = await controller.deleteChapter(payload, mockContext as any);
    expect(result).toEqual({ deleted: true });
    expect(mockService.delete).toHaveBeenCalledWith('1');
    expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
  });
});
