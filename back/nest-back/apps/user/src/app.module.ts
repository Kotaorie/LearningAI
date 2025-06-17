import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from '../../../libs/database/src/entities/user.entity';
import { DatabaseModule } from '../../../libs/database/src/database.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([User]),
    UserModule,
    AuthModule,
  ]
})
export class AppUserModule {}
