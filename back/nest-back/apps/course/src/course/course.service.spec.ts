import { Test, TestingModule } from '@nestjs/testing';
import { CourseService } from './course.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Course } from '../../../../libs/database/src/entities/course.entity';
import { Repository } from 'typeorm';

describe('CourseService', () => {
  let service: CourseService;
  let repo: Repository<Course>;

  const mockcourse: Course = {
    id: '1',
    title: 'Intro',
    userId: '4',
    level: 2,
    status: 'down',
    createdAt: new Date('2024-11-12'),
    chapters: [],
  };

  const mockRepo = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockResolvedValue(mockcourse),
    findOne: jest.fn().mockResolvedValue(mockcourse),
    find: jest.fn().mockResolvedValue([mockcourse]),
    update: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        {
          provide: getRepositoryToken(Course),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<CourseService>(CourseService);
    repo = module.get<Repository<Course>>(getRepositoryToken(Course));
  });

  it('should create a course', async () => {
    const result = await service.create({ title: 'Intro' });
    expect(result).toEqual(mockcourse);
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });

  it('should return all courses', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockcourse]);
    expect(repo.find).toHaveBeenCalled();
  });

  it('should return a course by ID', async () => {
    const result = await service.findById('1');
    expect(result).toEqual(mockcourse);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: '1' }, relations: ['chapters', 'chapters.lessons'] });
  });

  it('should update a course', async () => {
    jest.spyOn(service, 'findById').mockResolvedValue(mockcourse);
    const result = await service.update('1', { title: 'Updated' });
    expect(result).toEqual(mockcourse);
    expect(repo.update).toHaveBeenCalledWith('1', { title: 'Updated' });
  });

  it('should throw if not found on update', async () => {
    jest.spyOn(service, 'findById').mockResolvedValue(null);
    await expect(service.update('1', { title: 'Nope' })).rejects.toThrow('Course with ID 1 not found');
  });

  it('should delete a course', async () => {
    const result = await service.delete('1');
    expect(result).toEqual({ deleted: true });
    expect(repo.delete).toHaveBeenCalledWith('1');
  });

  it('should throw if not found on delete', async () => {
    mockRepo.delete.mockResolvedValueOnce({ affected: 0 });
    await expect(service.delete('404')).rejects.toThrow('Course with ID 404 not found');
  });
});
