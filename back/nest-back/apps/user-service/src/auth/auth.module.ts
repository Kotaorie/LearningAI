import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { GoogleCalendarModule } from '../../../../libs/google-calendar/src/google-calendar.module';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [
    UserModule,
    GoogleCalendarModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {}
