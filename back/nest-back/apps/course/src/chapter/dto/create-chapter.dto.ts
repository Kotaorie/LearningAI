import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateChapterDto {
  @IsInt()
  course_id: number;

  @IsString()
  title: string;

  @IsOptional()
  @IsInt()
  position?: number;
}
