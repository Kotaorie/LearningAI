import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { CreateUserInput, UpdateUserInput } from './user.model';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let service: UserService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password_hash: 'hashed-password',
    level: 3,
    googleTokens: null,
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockUser),
    findById: jest.fn().mockResolvedValue(mockUser),
    findByEmail: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue(mockUser),
    delete: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: mockService,
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    service = module.get<UserService>(UserService);
  });

  it('should create a user', async () => {
    const input: CreateUserInput = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password_hash: 'password123',
      level:2,
    };
    const result = await resolver.createUser(input);
    expect(result).toEqual(mockUser);
    expect(service.create).toHaveBeenCalledWith(input);
  });

  it('should return a user by ID', async () => {
    const result = await resolver.getUser('1');
    expect(result).toEqual(mockUser);
    expect(service.findById).toHaveBeenCalledWith('1');
  });

  it('should throw if user by ID not found', async () => {
    mockService.findById.mockResolvedValueOnce(null);
    await expect(resolver.getUser('404')).rejects.toThrow('User with id 404 not found');
  });

  it('should return a user by email', async () => {
    const result = await resolver.getUserByEmail('test@example.com');
    expect(result).toEqual(mockUser);
    expect(service.findByEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('should throw if user by email not found', async () => {
    mockService.findByEmail.mockResolvedValueOnce(null);
    await expect(resolver.getUserByEmail('not@found.com')).rejects.toThrow('User with email not@found.com not found');
  });

  it('should update a user', async () => {
    const input: UpdateUserInput = {
      id: '1',
      firstName: 'Jane',
    };
    const result = await resolver.updateUser(input);
    expect(result).toEqual(mockUser);
    expect(service.update).toHaveBeenCalledWith(input);
  });

  it('should throw if update target not found', async () => {
    mockService.update.mockResolvedValueOnce(null);
    await expect(resolver.updateUser({ id: '999' })).rejects.toThrow('User with id 999 not found');
  });

  it('should delete a user', async () => {
    const result = await resolver.deleteUser('1');
    expect(result).toBe(true);
    expect(service.delete).toHaveBeenCalledWith('1');
  });
});
