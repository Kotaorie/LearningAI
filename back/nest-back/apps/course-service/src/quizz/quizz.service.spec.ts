import { Test, TestingModule } from '@nestjs/testing';
import { QuizzService } from './quizz.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Quizz } from './quizz.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('QuizzService', () => {
  let service: QuizzService;
  let repo: Repository<Quizz>;

  const mockQuizz: Quizz = {
  id: 1,
  course_id: 10,
  chapter_id: 1,
  title: 'Test Quiz',
  questions_json: [
        { question: 'What is 2 + 2?', choices: [2, 4, 5], answer: 4 }
      ],
  created_at: new Date('2024-11-12'),
};

  const mockRepo = {
    create: jest.fn().mockImplementation(dto => ({ ...dto })),
    save: jest.fn().mockResolvedValue(mockQuizz),
    findOne: jest.fn().mockResolvedValue(mockQuizz),
    update: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuizzService,
        {
          provide: getRepositoryToken(Quizz),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<QuizzService>(QuizzService);
    repo = module.get<Repository<Quizz>>(getRepositoryToken(Quizz));
  });

  it('should create a quizz', async () => {
    const dto = { title: 'Intro', chapter_id: 1 };
    const result = await service.create(dto);
    expect(result).toEqual(mockQuizz);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalled();
  });

  it('should return a quizz by ID', async () => {
    const result = await service.findById(1);
    expect(result).toEqual(mockQuizz);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should return questions from a quizz by ID', async () => {
    const result = await service.getQuestionsByQuizId(1);
    expect(result).toEqual(mockQuizz.questions_json);
    expect(repo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      select: ['questions_json'],
    });
  });

  it('should throw NotFoundException if quizz not found in getQuestionsByQuizId', async () => {
    mockRepo.findOne.mockResolvedValueOnce(null);

    await expect(service.getQuestionsByQuizId(999)).rejects.toThrow(NotFoundException);
  });

  it('should update a quizz', async () => {
    const result = await service.update(1, { title: 'Updated' });
    expect(result).toEqual(mockQuizz);
    expect(repo.update).toHaveBeenCalledWith(1, { title: 'Updated' });
  });

  it('should throw error if quizz not found during update', async () => {
    mockRepo.findOne.mockResolvedValueOnce(null); // simulate quizz not found

    await expect(service.update(999, { title: 'Fail' })).rejects.toThrow(
      'Quizz with ID 999 not found',
    );
  });

  it('should delete a quizz', async () => {
    await service.delete(1);
    expect(repo.delete).toHaveBeenCalledWith(1);
  });
});
