import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { Lesson } from '../lesson/lesson.model';

@ObjectType()
export class Chapter {
  @Field()
  id: string;

  @Field()
  courseId: string;

  @Field()
  title: string;

  @Field()
  position: number;

  @Field(() => [Lesson], { nullable: true })
  lessons?: Lesson[];
}

@InputType()
export class CreateChapterInput {
  @Field()
  courseId: string;

  @Field()
  title: string;

  @Field()
  position: number;
}