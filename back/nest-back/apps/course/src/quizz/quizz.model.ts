import { ObjectType, Field, InputType } from '@nestjs/graphql';

@ObjectType()
export class Quizz {
  @Field()
  id: string;

  @Field()
  courseId: string;

  @Field()
  chapterId: string;

  @Field()
  title: string;

  @Field(() => String)
  questionsJson: string;

  @Field()
  createdAt: Date;
}

@InputType()
export class CreateQuizzInput {
  @Field()
  courseId: string;

  @Field()
  chapterId: string;

  @Field()
  title: string;

  @Field(() => String)
  questionsJson: string;

  @Field()
  createdAt: Date;
}