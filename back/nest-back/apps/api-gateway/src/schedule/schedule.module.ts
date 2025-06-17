import { Module } from '@nestjs/common';
import { ScheduleResolver } from './resolvers/schedule.resolver';


@Module({
  providers: [ScheduleResolver],
})
export class ScheduleModule {}