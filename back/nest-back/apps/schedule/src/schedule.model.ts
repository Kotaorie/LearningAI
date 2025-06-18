import { ObjectType, Field, InputType } from '@nestjs/graphql';

@ObjectType()
export class Schedule {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  courseId: string;

  @Field()
  courseName: string;

  @Field(() => [String])
  days: string[];

  @Field()
  hoursPerSession: number;

  @Field()
  durationWeeks: number;

  @Field()
  startDate: string;
}

@InputType()
export class CreateScheduleInput {
    @Field()
    userId: string;

    @Field()
    courseId: string;

    @Field()
    courseName: string;

    @Field(() => [String])
    days: string[];

    @Field()
    hoursPerSession: number;

    @Field()
    durationWeeks: number;

    @Field()
    startDate: string;
}