import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CourseModule } from './course/course.module';
import { GraphqlModule } from '../../../libs/graphql/src/graphql.module';
import { ScheduleModule } from './schedule/schedule.module';


@Module({
  imports: [
    GraphqlModule,
    UserModule,
    CourseModule,
    ScheduleModule,
  ],
})
export class ApiGatewayModule {}