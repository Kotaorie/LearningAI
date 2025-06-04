import { Controller, Post, Body, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Put('update')
  @UseGuards(JwtAuthGuard)
  async update(@Req() req, @Body() dto: Partial<RegisterDto>) {
    return this.authService.update(req.user.userId, dto);
  }

  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  async delete(@Req() req) {
    return this.authService.delete(req.user.userId);
  }
}
