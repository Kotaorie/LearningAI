import { ObjectType, Field, InputType } from '@nestjs/graphql';

@ObjectType()
export class Lesson {
  @Field()
  id: string;

  @Field()
  chapterId: string;

  @Field()
  title: string;

  @Field()
  contentMarkdown: string;

  @Field()
  position: number;
}

@InputType()
export class CreateLessonInput {
   @Field()
  chapterId: string;

  @Field()
  title: string;

  @Field()
  contentMarkdown: string;

  @Field()
  position: number;
}