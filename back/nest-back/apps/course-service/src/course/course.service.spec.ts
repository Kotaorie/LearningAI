import { Test, TestingModule } from '@nestjs/testing';
import { CourseService } from './course.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { Repository } from 'typeorm';

describe('courseService', () => {
  let service: CourseService;
  let repo: Repository<Course>;

  const mockcourse: Course = {
    id: 1,
    title: 'Intro',
    user_id: 4,
    level: 'medium',
    status:'down',
    created_at: new Date('12/11/2024') ,

  };

  const mockRepo = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockResolvedValue(mockcourse),
    findOne: jest.fn().mockResolvedValue(mockcourse),
    find: jest.fn().mockResolvedValue([mockcourse]),
    update: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
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

  it('should return a course by ID', async () => {
    const result = await service.findById(1);
    expect(result).toEqual(mockcourse);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should update a course', async () => {
    const result = await service.update(1, { title: 'Updated' });
    expect(result).toEqual(mockcourse);
    expect(repo.update).toHaveBeenCalledWith(1, { title: 'Updated' });
  });

  it('should delete a course', async () => {
    await service.delete(1);
    expect(repo.delete).toHaveBeenCalledWith(1);
  });
});
