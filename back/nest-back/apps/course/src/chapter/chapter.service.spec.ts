import { Test, TestingModule } from '@nestjs/testing';
import { ChapterService } from './chapter.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Chapter } from '../../../../libs/database/src/entities/chapter.entity';
import { Repository } from 'typeorm';

describe('ChapterService', () => {
  let service: ChapterService;
  let repo: Repository<Chapter>;

  const mockChapter: Chapter = {
    id: 1,
    title: 'Intro',
    course_id: 1,
    position: 1,
  };

  const mockRepo = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockResolvedValue(mockChapter),
    findOne: jest.fn().mockResolvedValue(mockChapter),
    find: jest.fn().mockResolvedValue([mockChapter]),
    update: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChapterService,
        {
          provide: getRepositoryToken(Chapter),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<ChapterService>(ChapterService);
    repo = module.get<Repository<Chapter>>(getRepositoryToken(Chapter));
  });

  it('should create a chapter', async () => {
    const result = await service.create({ title: 'Intro' });
    expect(result).toEqual(mockChapter);
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });

  it('should return a chapter by ID', async () => {
    const result = await service.findById(1);
    expect(result).toEqual(mockChapter);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should return chapters by course ID', async () => {
    const result = await service.findByCourseId(1);
    expect(result).toEqual([mockChapter]);
    expect(repo.find).toHaveBeenCalled();
  });

  it('should update a chapter', async () => {
    const result = await service.update(1, { title: 'Updated' });
    expect(result).toEqual(mockChapter);
    expect(repo.update).toHaveBeenCalledWith(1, { title: 'Updated' });
  });

  it('should delete a chapter', async () => {
    await service.delete(1);
    expect(repo.delete).toHaveBeenCalledWith(1);
  });
});
