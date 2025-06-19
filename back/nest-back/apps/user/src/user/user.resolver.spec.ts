jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('mockSalt'),
  hash: jest.fn().mockResolvedValue('hashedpass'),
  compare: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from '../../../../libs/database/src/entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let service: UserService;
  let repo: Repository<User>;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password_hash: 'hashedpassword',
    googleTokens: 'null',  
    level: 3,
  };

  const mockRepo = {
    findOne: jest.fn().mockResolvedValue(mockUser),
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find user by email', async () => {
    const result = await service.findByEmail('test@example.com');
    expect(result).toEqual(mockUser);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
  });

  it('should find user by ID', async () => {
    const result = await service.findById('1');
    expect(result).toEqual(mockUser);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('should create a user and hash password', async () => {
    const input = {
      email: 'new@example.com',
      password_hash: 'plainpass',
    };

    const result = await service.create(input);

    expect(result).toEqual(mockUser);
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalledWith('plainpass', 'mockSalt');
  });

  it('should update a user and hash password if present', async () => {
    const password = 'newpass';
    const hashSpy = jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('newhashed');

    const result = await service.update({ id: '1', password_hash: password });
    expect(result).toEqual(mockUser);
    expect(repo.update).toHaveBeenCalledWith('1', {
      id: '1',
      password_hash: 'newhashed',
    });
    expect(hashSpy).toHaveBeenCalled();
  });

  it('should throw if no ID is provided for update', async () => {
    await expect(service.update({ email: 'abc' })).rejects.toThrow('User ID is required for update');
  });

  it('should update google tokens', async () => {
    const tokens = { access_token: 'abc123' };
    await service.updateGoogleTokens('1', tokens);
    expect(repo.update).toHaveBeenCalledWith('1', { googleTokens: tokens });
  });

  it('should delete a user', async () => {
    const result = await service.delete('1');
    expect(result).toEqual({ deleted: true });
    expect(repo.delete).toHaveBeenCalledWith('1');
  });
});
