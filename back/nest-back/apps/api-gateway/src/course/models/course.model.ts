import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { Chapter } from './chapter.model';

@ObjectType()
export class Course {
  @Field()
  id: string;

  @Field()
  userId: string;
  
  @Field()
  title: string;

  @Field()
  level: number;

  @Field()
  status: string;

  @Field()
  createdAt: Date;

  @Field(() => [Chapter], { nullable: true })
  chapters?: Chapter[];
}

@InputType()
export class CreateCourseInput {
  @Field()
  userId: string;
  
  @Field()
  title: string;

  @Field()
  level: number;

  @Field()
  status: string;
}