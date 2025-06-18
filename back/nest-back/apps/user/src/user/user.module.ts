import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from '../../../../libs/database/src/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
