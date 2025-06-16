import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from '../../../libs/database/src/entities/schedule.entity';
import { GoogleCalendarModule } from '../../../libs/google-calendar/src/google-calendar.module';
import { UserModule } from '../../user-service/src/user/user.module';
import { GraphqlModule } from '../../../libs/graphql/src/graphql.module';
import { DatabaseModule } from '../../../libs/database/src/database.module';
import { ScheduleResolver } from './schedule.resolver';

@Module({
  imports: [
    GraphqlModule,
    DatabaseModule,
    TypeOrmModule.forFeature([Schedule]),
    GoogleCalendarModule,
    UserModule,
  ],
  providers: [ScheduleService, ScheduleResolver],
  exports: [ScheduleService],
})
export class ScheduleModule {}
