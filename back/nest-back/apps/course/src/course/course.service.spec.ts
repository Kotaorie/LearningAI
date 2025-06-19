import { Test, TestingModule } from '@nestjs/testing';
import { CourseService } from './course.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Course, CourseType } from '../../../../libs/database/src/entities/course.entity';
import { Repository } from 'typeorm';
import { ChapterService } from '../chapter/chapter.service';
import { LessonService } from '../lesson/lesson.service';

jest.mock('groq-sdk', () => {
  return {
    Groq: jest.fn().mockImplementation(() => ({
      chat: {
        completions: { 
          create: jest.fn().mockImplementation(() => {
            return (async function* () {
              yield { choices: [{ delta: { content: '**Chapitre 1 : Intro**\n**Leçon 1.1 : Découverte**' } }] };
            })();
          }),
        },
      },
    })),
  };
});

describe('CourseService', () => {
  let service: CourseService;
  let repo: Repository<Course>;

  const mockCourse: Course = {
    id: '1',
    title: 'Intro',
    userId: '4',
    level: 2,
    status: 'down',
    createdAt: new Date('2024-11-12'),
    chapters: [],
    type: CourseType.code,
    sujet: 'informatique', 
  };

  const mockRepo = {
    create: jest.fn().mockImplementation(dto => ({ ...dto })),
    save: jest.fn().mockResolvedValue(mockCourse),
    findOne: jest.fn().mockResolvedValue(mockCourse),
    find: jest.fn().mockResolvedValue([mockCourse]),
    update: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  const mockChapterService = {
    create: jest.fn().mockResolvedValue({ id: 'ch1', position: 1 }),
    findByCourseId: jest.fn().mockResolvedValue([{ id: 'ch1', position: 1 }]),
    delete: jest.fn().mockResolvedValue({ deleted: true }),
    generate: jest.fn().mockResolvedValue({}),
  };

  const mockLessonService = {
    create: jest.fn().mockResolvedValue({}),
    deleteByChapterId: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        { provide: getRepositoryToken(Course), useValue: mockRepo },
        { provide: ChapterService, useValue: mockChapterService },
        { provide: LessonService, useValue: mockLessonService },
      ],
    }).compile();

    service = module.get<CourseService>(CourseService);
    repo = module.get<Repository<Course>>(getRepositoryToken(Course));

    jest.clearAllMocks();
  });

  it('should create a course (mock Groq)', async () => {
    jest.mock('groq-sdk', () => {
      return {
        Groq: jest.fn().mockImplementation(() => ({
          chat: {
            completions: {
              create: jest.fn().mockReturnValue([
                { choices: [{ delta: { content: '**Chapitre 1 : Intro**' } }] },
                { choices: [{ delta: { content: '**Leçon 1.1 : Présentation**' } }] },
              ]),
            },
          },
        })),
      };
    });
    
    const courseInput = {
      title: 'Intro',
      sujet: 'Maths',
      type: CourseType.science,
      userId: '4',
      status: 'down',
      level: 2,
    };

    const result = await service.create(courseInput);
    expect(result).toEqual(mockCourse);
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
    expect(mockChapterService.create).toHaveBeenCalled();
    expect(mockLessonService.create).toHaveBeenCalled();
  });

  it('should return all courses', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockCourse]);
    expect(repo.find).toHaveBeenCalledWith({ relations: ['chapters', 'chapters.lessons'] });
  });

  it('should return a course by ID', async () => {
    const result = await service.findById('1');
    expect(result).toEqual(mockCourse);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: '1' }, relations: ['chapters', 'chapters.lessons'] });
  });

  it('should update a course', async () => {
    jest.spyOn(service, 'findById').mockResolvedValue(mockCourse);
    const result = await service.update('1', { title: 'Updated' });
    expect(result).toEqual(mockCourse);
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
    expect(mockChapterService.findByCourseId).toHaveBeenCalledWith('1');
    expect(mockChapterService.delete).toHaveBeenCalled();
    expect(mockLessonService.deleteByChapterId).toHaveBeenCalled();
  });

  it('should throw if not found on delete', async () => {
    mockRepo.delete.mockResolvedValueOnce({ affected: 0 });
    await expect(service.delete('404')).rejects.toThrow('Course with ID 404 not found');
  });
});
