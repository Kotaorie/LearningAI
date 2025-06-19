import { ObjectType, Field, InputType } from "@nestjs/graphql";

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  password_hash?: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  level: number;

  @Field({ nullable: true })
  googleTokens?: string;
}

@InputType()
export class CreateUserInput {

    @Field()
    email: string;
    
    @Field()
    password_hash: string;
    
    @Field()
    firstName: string;
    
    @Field()
    lastName: string;
    
    @Field()
    level: number;
    
    @Field({ nullable: true })
    googleTokens?: string;
    }

@InputType()
export class UpdateUserInput {
    @Field({ nullable: true })
    email?: string;

    @Field({ nullable: true })
    password_hash?: string;

    @Field({ nullable: true })
    firstName?: string;

    @Field({ nullable: true })
    lastName?: string;

    @Field({ nullable: true })
    level?: number;

    @Field({ nullable: true })
    googleTokens?: string;
}