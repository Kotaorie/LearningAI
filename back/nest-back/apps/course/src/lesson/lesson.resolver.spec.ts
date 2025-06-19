import { Test, TestingModule } from '@nestjs/testing';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';

const mockChannel = { ack: jest.fn() };
const mockMsg = {};
const mockContext = {
  getChannelRef: () => mockChannel,
  getMessage: () => mockMsg,
};

describe('LessonController', () => {
  let controller: LessonController;
  let service: LessonService;

  const mockLesson = { id: '1', title: 'Intro', chapterId: '1', position: 1, contentMarkdown: 'texte test' };

  const mockService = {
    findById: jest.fn().mockResolvedValue(mockLesson),
    findByChapterId: jest.fn().mockResolvedValue([mockLesson]),
    update: jest.fn().mockResolvedValue(mockLesson),
    delete: jest.fn().mockResolvedValue({ deleted: true }),
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

    jest.clearAllMocks();
  });

  it('should return a lesson by ID', async () => {
    const payload = { id: '1' };
    const result = await controller.getLesson(payload, mockContext as any);
    expect(result).toEqual(mockLesson);
    expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
    expect(mockService.findById).toHaveBeenCalledWith('1');
  });

  it('should return lessons by chapter ID', async () => {
    const payload = { chapterId: '1' };
    const result = await controller.getLessonsByChapterId(payload, mockContext as any);
    expect(result).toEqual([mockLesson]);
    expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
    expect(mockService.findByChapterId).toHaveBeenCalledWith('1');
  });

  it('should update a lesson', async () => {
    const payload = {
      id: '1',
      updateLessonInput: {
        title: 'New Title',
        chapterId: '2',
        position: 1,
        contentMarkdown: 'texte test',
      },
    };
    const result = await controller.updateLesson(payload, mockContext as any);
    expect(result).toEqual(mockLesson);
    expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
    expect(mockService.update).toHaveBeenCalledWith('1', payload.updateLessonInput);
  });

  it('should delete a lesson', async () => {
    const payload = { id: '1' };
    const result = await controller.deleteLesson(payload, mockContext as any);
    expect(result).toEqual({ deleted: true });
    expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
    expect(mockService.delete).toHaveBeenCalledWith('1');
  });
});
