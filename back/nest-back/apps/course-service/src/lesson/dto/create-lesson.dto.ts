import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateLessonDto {
  @IsInt()
  chapter_id: number;

  @IsString()
  title: string;

  @IsOptional()
  @IsInt()
  position?: number;
}
