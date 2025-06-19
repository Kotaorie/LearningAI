import { Test, TestingModule } from '@nestjs/testing';
import { LessonService } from './lesson.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Lesson } from '../../../../libs/database/src/entities/lesson.entity';
import { Repository } from 'typeorm';

describe('LessonService', () => {
  let service: LessonService;
  let repo: Repository<Lesson>;

  const mockCourse = {
    id: '1',
    title: 'title test',
    userId: '3',
    level: 2,
    status: 'finish',
    createdAt: new Date('2024-11-12'),
  };

  const mockChapter = {
    id: '1',
    title: 'Intro',
    courseId: 'C1',
    position: 1,
    course: mockCourse,
    lessons: [],
  };

  const mockLesson: Lesson = {
    id: '1',
    title: 'Intro',
    chapterId: '1',
    position: 1,
    contentMarkdown: 'texte test',
    chapter: mockChapter,
  };

  const mockRepo = {
    create: jest.fn().mockImplementation(dto => ({ ...dto })),
    save: jest.fn().mockResolvedValue(mockLesson),
    findOne: jest.fn().mockResolvedValue(mockLesson),
    find: jest.fn().mockResolvedValue([mockLesson]),
    update: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonService,
        {
          provide: getRepositoryToken(Lesson),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<LessonService>(LessonService);
    repo = module.get<Repository<Lesson>>(getRepositoryToken(Lesson));
  });

  it('should create a lesson', async () => {
    const result = await service.create({ title: 'Intro' });
    expect(result).toEqual(mockLesson);
    expect(repo.create).toHaveBeenCalledWith({ title: 'Intro' });
    expect(repo.save).toHaveBeenCalled();
  });

  it('should return a lesson by ID', async () => {
    const result = await service.findById('1');
    expect(result).toEqual(mockLesson);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('should return lessons by chapter ID', async () => {
    const result = await service.findByChapterId('1');
    expect(result).toEqual([mockLesson]);
    expect(repo.find).toHaveBeenCalledWith({
      where: { chapterId: '1' },
      order: { position: 'ASC' },
    });
  });

  it('should update a lesson', async () => {
    jest.spyOn(service, 'findById').mockResolvedValue(mockLesson);
    const result = await service.update('1', { title: 'Updated' });
    expect(result).toEqual(mockLesson);
    expect(repo.update).toHaveBeenCalledWith('1', { title: 'Updated' });
  });

  it('should throw if not found on update', async () => {
    jest.spyOn(service, 'findById').mockResolvedValue(null);
    await expect(service.update('1', { title: 'Nope' })).rejects.toThrow('Lesson with ID 1 not found');
  });

  it('should delete a lesson', async () => {
    const result = await service.delete('1');
    expect(result).toEqual({ deleted: true });
    expect(repo.delete).toHaveBeenCalledWith('1');
  });

  it('should throw if delete operation is invalid', async () => {
    mockRepo.delete.mockResolvedValueOnce({ affected: undefined });
    await expect(service.delete('999')).rejects.toThrow(
      'Delete operation did not return an affected count; no schedule deleted for id: 999'
    );
  });
});
