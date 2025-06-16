import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizzService } from './quizz.service';
import { QuizzController } from './quizz.controller';
import { Quizz } from './quizz.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quizz]),
    JwtModule.register({
          secret: process.env.JWT_SECRET || 'defaultSecret',
          signOptions: { expiresIn: '1d' },
        }),
  ],
  controllers: [QuizzController],
  providers: [QuizzService],
  exports: [QuizzService],
})
export class UserModule {}
