import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChapterService } from './chapter.service';
import { Chapter } from '../../../../libs/database/src/entities/chapter.entity';
import { JwtModule } from '@nestjs/jwt';
import { ChapterResolver } from './chapter.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chapter]),
    JwtModule.register({
          secret: process.env.JWT_SECRET || 'defaultSecret',
          signOptions: { expiresIn: '1d' },
        }),
  ],
  providers: [ChapterService, ChapterResolver],
  exports: [ChapterService],
})
export class ChapterModule {}
