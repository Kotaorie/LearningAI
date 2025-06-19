import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { GoogleCalendarService } from '../../../../libs/google-calendar/src/google-calendar.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let googleCalendarService: GoogleCalendarService;

  const mockUser = {
    id: '1',
    email: 'user@example.com',
    password_hash: 'hashedpass',
  };

  const mockUserService = {
    findByEmail: jest.fn(),
    updateGoogleTokens: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked.jwt.token'),
  };

  const mockGoogleService = {
    generateAuthUrl: jest.fn().mockReturnValue('https://google.com/auth'),
    getTokensFromCode: jest.fn().mockResolvedValue({ access_token: 'test' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: GoogleCalendarService, useValue: mockGoogleService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    googleCalendarService = module.get<GoogleCalendarService>(GoogleCalendarService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return Google Auth URL', async () => {
    const result = await service.getGoogleAuthUrl();
    expect(result).toBe('https://google.com/auth');
    expect(googleCalendarService.generateAuthUrl).toHaveBeenCalled();
  });

  it('should handle Google callback and update user tokens', async () => {
    const result = await service.handleGoogleCallBack('code123', 'user-id'); // Corrigé : nom réel de la méthode
    expect(result).toEqual({ success: true });
    expect(googleCalendarService.getTokensFromCode).toHaveBeenCalledWith('code123');
    expect(userService.updateGoogleTokens).toHaveBeenCalledWith('user-id', { access_token: 'test' });
  });

  it('should login user and return access token and auth url', async () => {
    mockUserService.findByEmail.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await service.login('user@example.com', 'plaintext'); // Corrigé : arguments séparés

    expect(result).toEqual({
      access_token: 'mocked.jwt.token',
      google_auth_url: 'https://google.com/auth',
    });
    expect(mockUserService.findByEmail).toHaveBeenCalledWith('user@example.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('plaintext', 'hashedpass');
    expect(jwtService.sign).toHaveBeenCalledWith({ sub: '1', email: 'user@example.com' }, { secret: undefined }); // JWT_SECRET non défini
  });

  it('should throw error on invalid credentials', async () => {
    mockUserService.findByEmail.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      service.login('user@example.com', 'wrongpass')
    ).rejects.toThrow('Identifiants invalides');
  });

  it('should throw error when user is not found', async () => {
    mockUserService.findByEmail.mockResolvedValue(null);

    await expect(
      service.login('noone@example.com', '1234')
    ).rejects.toThrow('Identifiants invalides');
  });
});
