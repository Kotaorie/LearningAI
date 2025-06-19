import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CourseModule } from './course/course.module';
import { GraphqlModule } from '../../../libs/graphql/src/graphql.module';
import { ScheduleModule } from './schedule/schedule.module';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    GraphqlModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'jpp_secret',
      signOptions: { expiresIn: '1d' },
    }),
    UserModule,
    CourseModule,
    ScheduleModule,
  ],
})
export class ApiGatewayModule {}