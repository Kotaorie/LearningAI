import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from '../../../libs/database/src/entities/schedule.entity';
import { GoogleCalendarModule } from '../../../libs/google-calendar/src/google-calendar.module';
import { DatabaseModule } from '../../../libs/database/src/database.module';
import { ScheduleController } from './schedule.controller';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Schedule]),
    GoogleCalendarModule,
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class ScheduleModule {}
