import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleResolver } from './schedule.resolver';
import { ScheduleService } from './schedule.service';

describe('ScheduleResolver', () => {
  let resolver: ScheduleResolver;
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
      providers: [
        ScheduleResolver,
        {
          provide: ScheduleService,
          useValue: mockService,
        },
      ],
    }).compile();

    resolver = module.get<ScheduleResolver>(ScheduleResolver);
    service = module.get<ScheduleService>(ScheduleService);
  });

  it('should create a schedule', async () => {
    const input = { title: 'test', user_id: '4' };
    const result = await resolver.createSchedule(input as any);
    expect(result).toEqual(mockSchedule);
    expect(service.createSchedule).toHaveBeenCalledWith(input);
  });

  it('should return a schedule by ID', async () => {
    const result = await resolver.getSchedule('1');
    expect(result).toEqual(mockSchedule);
    expect(service.getSchedule).toHaveBeenCalledWith('1');
  });

  it('should throw an error if schedule not found', async () => {
    mockService.getSchedule.mockResolvedValueOnce(null);
    await expect(resolver.getSchedule('data_service')).rejects.toThrow('Schedule with id data_service not found');
  });

  it('should return schedules by user ID', async () => {
    const result = await resolver.getSchedulesByUserId('4');
    expect(result).toEqual([mockSchedule]);
    expect(service.getSchedulesByUserId).toHaveBeenCalledWith('4');
  });

  it('should update a schedule', async () => {
    const input = { title: 'Updated Title' };
    const result = await resolver.updateSchedule('1', input as any);
    expect(result).toEqual(mockSchedule);
    expect(service.updateSchedule).toHaveBeenCalledWith('1', input);
  });

  it('should throw an error if update target not found', async () => {
    mockService.updateSchedule.mockResolvedValueOnce(null);
    await expect(resolver.updateSchedule('999', { title: 'New' } as any))
      .rejects.toThrow('Schedule with id 999 not found');
  });

  it('should delete a schedule and return true', async () => {
    const result = await resolver.deleteSchedule('1');
    expect(result).toBe(true);
    expect(service.deleteSchedule).toHaveBeenCalledWith('1');
  });
});
