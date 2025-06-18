import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { GoogleCalendarModule } from '../../../../libs/google-calendar/src/google-calendar.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UserModule,
    GoogleCalendarModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'jpp_secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
