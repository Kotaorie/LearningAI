import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from '../../../../libs/database/src/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserResolver } from './user.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
          secret: process.env.JWT_SECRET || 'defaultSecret',
          signOptions: { expiresIn: '1d' },
        }),
  ],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
