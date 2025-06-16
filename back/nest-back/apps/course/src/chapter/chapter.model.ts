import { ObjectType, Field, InputType } from '@nestjs/graphql';

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