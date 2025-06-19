import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: AuthService;

  const mockAuthService = {
    getGoogleAuthUrl: jest.fn().mockResolvedValue('https://auth.google.com/redirect'),
    handleGoogleCallback: jest.fn().mockResolvedValue({ success: true }),
    login: jest.fn().mockResolvedValue({
      access_token: 'abc123',
      google_auth_url: 'https://auth.google.com/redirect',
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: {} }, // pas utilisé ici
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
  });

  it('should return Google Auth URL', async () => {
    const url = await resolver.getGoogleAuthUrl();
    expect(url).toBe('https://auth.google.com/redirect');
    expect(authService.getGoogleAuthUrl).toHaveBeenCalled();
  });

  it('should handle Google callback', async () => {
    const result = await resolver.handleGoogleCallback('test-code', 'user123');
    expect(result).toBe(true);
    expect(authService.handleGoogleCallback).toHaveBeenCalledWith('test-code', 'user123');
  });

  it('should return access token and Google auth URL on login', async () => {
    const result = await resolver.login('test@example.com', 'password123');
    expect(result).toEqual({
      access_token: 'abc123',
      google_auth_url: 'https://auth.google.com/redirect',
    });
    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
});
