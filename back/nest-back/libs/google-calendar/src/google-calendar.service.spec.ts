import { Test, TestingModule } from '@nestjs/testing';
import { GoogleCalendarService } from './google-calendar.service';
import { ConfigModule } from '@nestjs/config';

describe('GoogleCalendarService', () => {
  let service: GoogleCalendarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [GoogleCalendarService],
    }).compile();

    service = module.get<GoogleCalendarService>(GoogleCalendarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate an auth URL', () => {
    const url = service.generateAuthUrl();
    expect(url).toContain('https://accounts.google.com/o/oauth2/auth');
  });
});
