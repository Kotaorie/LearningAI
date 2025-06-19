import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from './schedule.service';
import { Schedule } from '../../../libs/database/src/entities/schedule.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GoogleCalendarService } from '../../../libs/google-calendar/src/google-calendar.service';

describe('ScheduleService', () => {
  let service: ScheduleService;
  let repo: Repository<Schedule>;
  let googleCalendarService: GoogleCalendarService;

  const mockSchedule: Schedule = {
  id: '1',
  userId: '4',
  courseName: 'Test Course',
  courseId: 'C1', 
  startDate: '2025-04-01',
  durationWeeks: 4,
  days: ['Monday', 'Wednesday'], 
  hoursPerSession: 2,            
};


  const mockUser = {
    id: '4',
    googleTokens: { access_token: 'test' },
  };

  const mockRepo = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockResolvedValue(mockSchedule),
    findOne: jest.fn().mockResolvedValue(mockSchedule),
    find: jest.fn().mockResolvedValue([mockSchedule]),
    update: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  const mockUserService = {
    findById: jest.fn().mockResolvedValue(mockUser),
  };

  const mockGoogleCalendarService = {
    addEvent: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleService,
        { provide: getRepositoryToken(Schedule), useValue: mockRepo },
        { provide: GoogleCalendarService, useValue: mockGoogleCalendarService },
      ],
    }).compile();

    service = module.get<ScheduleService>(ScheduleService);
    repo = module.get<Repository<Schedule>>(getRepositoryToken(Schedule));
    googleCalendarService = module.get<GoogleCalendarService>(GoogleCalendarService);
  });

  it('should create a schedule and add to Google Calendar', async () => {
    const input = {
      userId: '4',
      courseName: 'Test Course',
      startDate: '2025-04-01',
      durationWeeks: 4,
      days: ['Monday', 'Wednesday'], 
      hoursPerSession: 2, 
    };
    

    const result = await service.createSchedule(input);
    expect(result).toEqual(mockSchedule);
    expect(repo.create).toHaveBeenCalledWith(input);
    expect(repo.save).toHaveBeenCalled();
    expect(googleCalendarService.addEvent).toHaveBeenCalled();
  });

  it('should log error and continue if Google Calendar event creation fails', async () => {
  mockGoogleCalendarService.addEvent.mockRejectedValueOnce(new Error('Calendar error'));

  const result = await service.createSchedule({
    userId: '4',
    courseName: 'Test Course',
    startDate: '2025-04-01',
    durationWeeks: 4,
    days: ['Monday'],
    hoursPerSession: 2,
  });

  expect(result).toEqual(mockSchedule);
  expect(googleCalendarService.addEvent).toHaveBeenCalled();
});


  it('should throw if userId is missing', async () => {
    await expect(service.createSchedule({})).rejects.toThrow('userId is required to create a schedule');
  });

  it('should return a schedule by ID', async () => {
    const result = await service.getSchedule('1');
    expect(result).toEqual(mockSchedule);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('should return schedules by user ID', async () => {
    const result = await service.getSchedulesByUserId('4');
    expect(result).toEqual([mockSchedule]);
    expect(repo.find).toHaveBeenCalledWith({ where: { userId: '4' } });
  });

  it('should update a schedule', async () => {
    const result = await service.updateSchedule('1', { courseName: 'Updated' });
    expect(result).toEqual(mockSchedule);
    expect(repo.update).toHaveBeenCalledWith('1', { courseName: 'Updated' });
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('should delete a schedule successfully', async () => {
    const result = await service.deleteSchedule('1');
    expect(result).toEqual({ deleted: true });
    expect(repo.delete).toHaveBeenCalledWith('1');
  });

  it('should throw error if delete operation is invalid', async () => {
    mockRepo.delete.mockResolvedValueOnce({ affected: undefined });
    await expect(service.deleteSchedule('999')).rejects.toThrow(
      'Delete operation did not return an affected count; no schedule deleted for id: 999'
    );
  });
});
