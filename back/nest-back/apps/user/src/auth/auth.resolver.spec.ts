import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// Mock RmqContext
const mockChannel = { ack: jest.fn() };
const mockMsg = {};
const mockContext = {
  getChannelRef: () => mockChannel,
  getMessage: () => mockMsg,
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    getGoogleAuthUrl: jest.fn().mockResolvedValue('https://auth.google.com/redirect'),
    handleGoogleCallBack: jest.fn().mockResolvedValue({ success: true }),
    login: jest.fn().mockResolvedValue({
      access_token: 'abc123',
      google_auth_url: 'https://auth.google.com/redirect',
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should return Google Auth URL', async () => {
    const payload = { redirectUri: 'http://localhost/callback' };
    const result = await controller.getGoogleAuthUrl(payload, mockContext as any);
    expect(result).toBe('https://auth.google.com/redirect');
    expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
    expect(service.getGoogleAuthUrl).toHaveBeenCalled();
  });

  it('should handle Google callback', async () => {
    const payload = { code: 'test-code', userId: 'user123' };
    const result = await controller.handleGoogleCallBack(payload, mockContext as any);
    expect(result).toEqual({ success: true });
    expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
    expect(service.handleGoogleCallBack).toHaveBeenCalledWith('test-code', 'user123');
  });

  it('should return access token and Google auth URL on login', async () => {
    const payload = { email: 'test@example.com', password: 'password123' };
    const result = await controller.login(payload, mockContext as any);
    expect(result).toEqual({
      access_token: 'abc123',
      google_auth_url: 'https://auth.google.com/redirect',
    });
    expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
    expect(service.login).toHaveBeenCalledWith('test@example.com', 'password123');
  });
});
