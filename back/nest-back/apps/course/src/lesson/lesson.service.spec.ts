import { Test, TestingModule } from '@nestjs/testing';
import { LessonService } from './lesson.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { Repository } from 'typeorm';

describe('lessonService', () => {
  let service: LessonService;
  let repo: Repository<Lesson>;

  const mocklesson: Lesson = {
    id: 1,
    title: 'Intro',
    chapter_id: 1,
    position: 1,
    content_markdown: 'texte test',

  };

  const mockRepo = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockResolvedValue(mocklesson),
    findOne: jest.fn().mockResolvedValue(mocklesson),
    find: jest.fn().mockResolvedValue([mocklesson]),
    update: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
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
    expect(result).toEqual(mocklesson);
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });

  it('should return a lesson by ID', async () => {
    const result = await service.findById(1);
    expect(result).toEqual(mocklesson);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should return lessons by course ID', async () => {
    const result = await service.findByChapterId(1);
    expect(result).toEqual([mocklesson]);
    expect(repo.find).toHaveBeenCalled();
  });

  it('should update a lesson', async () => {
    const result = await service.update(1, { title: 'Updated' });
    expect(result).toEqual(mocklesson);
    expect(repo.update).toHaveBeenCalledWith(1, { title: 'Updated' });
  });

  it('should delete a lesson', async () => {
    await service.delete(1);
    expect(repo.delete).toHaveBeenCalledWith(1);
  });
});
