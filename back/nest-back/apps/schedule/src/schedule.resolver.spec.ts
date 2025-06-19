import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { UnauthorizedException } from '@nestjs/common';

const mockChannel = { ack: jest.fn() };
const mockMsg = {};
const mockContext = {
  getChannelRef: () => mockChannel,
  getMessage: () => mockMsg,
};
describe('ScheduleController', () => {
  let controller: ScheduleController;
  let service: ScheduleService;

  const mockSchedule = {
    id: '1',
    userId: '4',
    courseId: '2',
    courseName: 'GraphQL course',
    days: ['Monday', 'Wednesday'],
    hoursPerSession: 2,
    durationWeeks: 4,
    startDate: '2025-06-01',
  };

  const mockService = {
    createSchedule: jest.fn().mockResolvedValue(mockSchedule),
    getSchedule: jest.fn().mockResolvedValue(mockSchedule),
    getSchedulesByUserId: jest.fn().mockResolvedValue([mockSchedule]),
    updateSchedule: jest.fn().mockResolvedValue(mockSchedule),
    deleteSchedule: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleController],
      providers: [
        {
          provide: ScheduleService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ScheduleController>(ScheduleController);
    service = module.get<ScheduleService>(ScheduleService);

    jest.clearAllMocks();
  });

  it('should create a schedule', async () => {
    const payload = { createScheduleInput: { courseName: 'test' }, userId: '4' };
    const result = await controller.createSchedule(payload, mockContext as any);
    expect(result).toEqual(mockSchedule);
    expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
    expect(mockService.createSchedule).toHaveBeenCalledWith({ ...payload.createScheduleInput, userId: '4' });
  });

  it('should return a schedule by ID (authorized)', async () => {
    const payload = { id: '1', userId: '4' };
    const result = await controller.getSchedule(payload, mockContext as any);
    expect(result).toEqual(mockSchedule);
    expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
    expect(mockService.getSchedule).toHaveBeenCalledWith('1');
  });

  it('should throw Unauthorized if not the owner on getSchedule', async () => {
    mockService.getSchedule.mockResolvedValueOnce({ ...mockSchedule, userId: 'other' });
    const payload = { id: '1', userId: '4' };
    await expect(controller.getSchedule(payload, mockContext as any)).rejects.toThrow(UnauthorizedException);
    expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
  });

  it('should return schedules by user ID', async () => {
    const payload = { userId: '4' };
    const result = await controller.getSchedulesByUserId(payload, mockContext as any);
    expect(result).toEqual([mockSchedule]);
    expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
    expect(mockService.getSchedulesByUserId).toHaveBeenCalledWith('4');
  });

  it('should update a schedule', async () => {
    const payload = { id: '1', updateScheduleInput: { courseName: 'Updated Title' } };
    const result = await controller.updateSchedule(payload, mockContext as any);
    expect(result).toEqual(mockSchedule);
    expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
    expect(mockService.updateSchedule).toHaveBeenCalledWith('1', { courseName: 'Updated Title' });
  });

  it('should delete a schedule and return result if user is owner', async () => {
    mockService.getSchedule.mockResolvedValueOnce({ ...mockSchedule, userId: '4' });
    const payload = { id: '1', userId: '4' };
    const result = await controller.deleteSchedule(payload, mockContext as any);
    expect(result).toEqual({ deleted: true });
    expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
    expect(mockService.deleteSchedule).toHaveBeenCalledWith('1');
  });

  it('should throw Unauthorized if user is not owner on delete', async () => {

    mockService.getSchedule.mockResolvedValueOnce({ ...mockSchedule, userId: 'other' });
    const payload = { id: '1', userId: '4' };
    await expect(controller.deleteSchedule(payload, mockContext as any)).rejects.toThrow(UnauthorizedException);
    expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
  });
});
