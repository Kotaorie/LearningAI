import { Test, TestingModule } from '@nestjs/testing';
import { ChapterService } from './chapter.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Chapter } from '../../../../libs/database/src/entities/chapter.entity';
import { Repository } from 'typeorm';
import { LessonService } from '../lesson/lesson.service';

describe('ChapterService', () => {
  let service: ChapterService;
  let repo: Repository<Chapter>;
  let lessonService: LessonService;

  const mockCourse = {
    id: '1',
    title: 'title test',
    userId: '3',
    level: 2,
    status: 'finish',
    createdAt: new Date('12/11/2024'),
    type: 'online',
    sujet: 'informatique'
  };

  const mockChapter: Chapter = {
    id: '1',
    title: 'Intro',
    courseId: 'C1',
    position: 1,
    course: mockCourse,
    lessons: [],
  };

  const mockRepo = {
    create: jest.fn().mockImplementation(dto => ({ ...dto })),
    save: jest.fn().mockResolvedValue(mockChapter),
    findOne: jest.fn().mockResolvedValue(mockChapter),
    find: jest.fn().mockResolvedValue([mockChapter]),
    update: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  const mockLessonService = {
    generate: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChapterService,
        {
          provide: getRepositoryToken(Chapter),
          useValue: mockRepo,
        },
        {
          provide: LessonService,
          useValue: mockLessonService,
        },
      ],
    }).compile();

    service = module.get<ChapterService>(ChapterService);
    repo = module.get<Repository<Chapter>>(getRepositoryToken(Chapter));
    lessonService = module.get<LessonService>(LessonService);

    jest.clearAllMocks();
  });

  it('should create a chapter', async () => {
    const result = await service.create({ title: 'Intro' });
    expect(result).toEqual(mockChapter);
    expect(repo.create).toHaveBeenCalledWith({ title: 'Intro' });
    expect(repo.save).toHaveBeenCalled();
  });

  it('should return all chapters', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockChapter]);
    expect(repo.find).toHaveBeenCalled();
  });

  it('should return a chapter by ID', async () => {
    const result = await service.findById('1');
    expect(result).toEqual(mockChapter);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: '1' }, relations: ['lessons'] });
  });

  it('should return chapters by course ID', async () => {
    const result = await service.findByCourseId('C1');
    expect(result).toEqual([mockChapter]);
    expect(repo.find).toHaveBeenCalledWith({
      where: { courseId: 'C1' },
      order: { position: 'ASC' },
      relations: ['lessons'],
    });
  });

  it('should update a chapter', async () => {
    jest.spyOn(service, 'findById').mockResolvedValue(mockChapter);
    const result = await service.update('1', { title: 'Updated' });
    expect(result).toEqual(mockChapter);
    expect(repo.update).toHaveBeenCalledWith('1', { title: 'Updated' });
  });

  it('should throw on update if not found', async () => {
    jest.spyOn(service, 'findById').mockResolvedValue(null);
    await expect(service.update('1', { title: 'Nope' })).rejects.toThrow('Chapter with ID 1 not found');
  });

  it('should delete a chapter', async () => {
    const result = await service.delete('1');
    expect(result).toEqual({ deleted: true });
    expect(repo.delete).toHaveBeenCalledWith('1');
  });

  it('should throw on delete if not found', async () => {
    mockRepo.delete.mockResolvedValueOnce({ affected: 0 });
    await expect(service.delete('404')).rejects.toThrow('Chapter with ID 404 not found');
  });

  it('should generate lessons for a chapter', async () => {
    // le chapitre avec une lesson fictive
    const chapterWithLessons = {
      ...mockChapter,
      lessons: [{ id: 'lesson1' }],
    };
    jest.spyOn(service, 'findById')
      .mockResolvedValueOnce(chapterWithLessons as any)
      .mockResolvedValueOnce(chapterWithLessons as any);

    const result = await service.generate('1', 'CoursTest');
    expect(mockLessonService.generate).toHaveBeenCalledWith('lesson1', 'CoursTest');
    expect(result).toEqual(chapterWithLessons);
  });

  it('should throw if chapter to generate not found', async () => {
    jest.spyOn(service, 'findById').mockResolvedValue(null);
    await expect(service.generate('999', 'cours')).rejects.toThrow('Chapter with ID 999 not found');
  });

  it('should throw if chapter has no lessons to generate', async () => {
    const chapterSansLecons = { ...mockChapter, lessons: undefined };
    jest.spyOn(service, 'findById').mockResolvedValue(chapterSansLecons as any);
    await expect(service.generate('2', 'cours')).rejects.toThrow('Chapter with ID 2 has no lessons to generate');
  });
});
