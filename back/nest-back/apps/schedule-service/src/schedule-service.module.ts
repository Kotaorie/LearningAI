import { Module } from '@nestjs/common';
import { ScheduleServiceController } from './schedule-service.controller';
import { ScheduleServiceService } from './schedule-service.service';

@Module({
  imports: [],
  controllers: [ScheduleServiceController],
  providers: [ScheduleServiceService],
})
export class ScheduleServiceModule {}
