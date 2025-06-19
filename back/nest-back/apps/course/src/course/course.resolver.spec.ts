import { Test, TestingModule } from '@nestjs/testing';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';

const mockChannel = { ack: jest.fn() };
const mockMsg = {};
const mockContext = {
  getChannelRef: () => mockChannel,
  getMessage: () => mockMsg,
};

describe('CourseController', () => {
  let controller: CourseController;
  let service: CourseService;

  const mockCourse = { id: '1', title: 'Intro', userId: '4', position: 1 };
  const mockCourse2 = { id: '2', title: 'dev', userId: '4', position: 2 };
  const mockCourse3 = { id: '3', title: 'conclu', userId: '4', position: 3 };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockCourse),
    findById: jest.fn().mockResolvedValue(mockCourse),
    findAll: jest.fn().mockResolvedValue([mockCourse, mockCourse2, mockCourse3]),
    update: jest.fn().mockResolvedValue(mockCourse),
    delete: jest.fn().mockResolvedValue({ deleted: true }),
    generateChapter: jest.fn().mockResolvedValue({ generated: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseController],
      providers: [
        {
          provide: CourseService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<CourseController>(CourseController);
    service = module.get<CourseService>(CourseService);

    jest.clearAllMocks();
  });

  it('should create a course', async () => {
    const payload = {
      createCourseInput: {
        title: 'Intro',
        position: 1,
      },
      userId: '4',
    };

    const result = await controller.createCourse(payload, mockContext as any);
    expect(result).toEqual(mockCourse);
    expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
    expect(mockService.create).toHaveBeenCalledWith(expect.objectContaining({ title: 'Intro', userId: '4' }));
  });

  it('should return a course by ID', async () => {
    const payload = { id: '1' };
    const result = await controller.getCourse(payload, mockContext as any);
    expect(result).toEqual(mockCourse);
    expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
    expect(mockService.findById).toHaveBeenCalledWith('1');
  });

  it('should return all courses', async () => {
    const result = await controller.getAllCourses(mockContext as any);
    expect(result).toEqual([mockCourse, mockCourse2, mockCourse3]);
    expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
    expect(mockService.findAll).toHaveBeenCalled();
  });

  it('should update a course', async () => {
    const payload = {
      id: '1',
      updateCourseInput: {
        title: 'Introduction Test',
        position: 1,
      },
    };

    const result = await controller.updateCourse(payload, mockContext as any);
    expect(result).toEqual(mockCourse);
    expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
    expect(mockService.update).toHaveBeenCalledWith('1', payload.updateCourseInput);
  });

  it('should delete a course', async () => {

    mockService.findById.mockResolvedValueOnce({ ...mockCourse, userId: '4' });

    const payload = { id: '1', userId: '4' };
    const result = await controller.deleteCourse(payload, mockContext as any);
    expect(result).toEqual({ deleted: true });
    expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
    expect(mockService.delete).toHaveBeenCalledWith('1');
  });

  it('should throw NotFound if course not found on delete', async () => {
    mockService.findById.mockResolvedValueOnce(null);
    const payload = { id: '404', userId: '4' };
    const result = await controller.deleteCourse(payload, mockContext as any);
    expect(result).toBeInstanceOf(Error); 
    expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
  });

  it('should throw Unauthorized if not owner on delete', async () => {
    mockService.findById.mockResolvedValueOnce({ ...mockCourse, userId: 'autre' });
    const payload = { id: '1', userId: '4' };
    const result = await controller.deleteCourse(payload, mockContext as any);
    expect(result).toBeInstanceOf(Error); 
    expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
  });

  it('should call generateChapter', async () => {
    const payload = { id: '1', chapterId: '2' };
    const result = await controller.generateChapter(payload, mockContext as any);
    expect(result).toEqual({ generated: true });
    expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
    expect(mockService.generateChapter).toHaveBeenCalledWith('1', '2');
  });
});
