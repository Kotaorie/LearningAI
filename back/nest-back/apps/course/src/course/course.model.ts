import { ObjectType, Field, InputType } from '@nestjs/graphql';

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