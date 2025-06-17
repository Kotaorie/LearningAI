import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { GoogleCalendarService } from '../../../../libs/google-calendar/src/google-calendar.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private googleCalendarService: GoogleCalendarService,
  ) {}

  async getGoogleAuthUrl(): Promise<string> {
    return this.googleCalendarService.generateAuthUrl();
  }

  async handleGoogleCallBack(code: string, userId: string) {
    const tokens = await this.googleCalendarService.getTokensFromCode(code);
    await this.userService.updateGoogleTokens(userId, tokens);
    return { success: true };
  }

  async login(email: string, password: string): Promise<{ access_token: string; google_auth_url: string }> {
    const user = await this.userService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      google_auth_url: await this.getGoogleAuthUrl()
    };
  }
}
