import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateCourseDto {
  @IsInt()
  user_id: number;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsString()
  status?: string;
}