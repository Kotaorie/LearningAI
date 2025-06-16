import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleServiceController } from './schedule-service.controller';
import { ScheduleServiceService } from './schedule-service.service';

describe('ScheduleServiceController', () => {
  let scheduleServiceController: ScheduleServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleServiceController],
      providers: [ScheduleServiceService],
    }).compile();

    scheduleServiceController = app.get<ScheduleServiceController>(ScheduleServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(scheduleServiceController.getHello()).toBe('Hello World!');
    });
  });
});
