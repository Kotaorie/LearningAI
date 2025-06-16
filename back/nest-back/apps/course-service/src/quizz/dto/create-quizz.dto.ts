import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateQuizzDto {
  @IsInt()
  course_id: number;

  @IsString()
  title: string;

  @IsOptional()
  @IsInt()
  position?: number;
}
