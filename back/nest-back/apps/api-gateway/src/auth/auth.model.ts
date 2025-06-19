import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class AuthResponse {
  @Field()
  access_token: string;

  @Field()
  google_auth_url: string;
}
