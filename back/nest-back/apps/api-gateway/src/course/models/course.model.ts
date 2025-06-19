import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { Chapter } from './chapter.model';
import { GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
export class Course {
  @Field()
  id: string;

  @Field()
  userId: string;
  
  @Field()
  title: string;

  @Field()
  type: string;

  @Field()
  sujet: string;

  @Field()
  level: number;

  @Field()
  status: string;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => [Chapter], { nullable: true })
  chapters?: Chapter[];
}

@InputType()
export class CreateCourseInput {
  
  @Field()
  title: string;

  @Field()
  type: string;

  @Field()
  sujet: string;

  @Field()
  level: number;

  @Field()
  status: string;
}