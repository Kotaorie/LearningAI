import { Module } from '@nestjs/common';
import { AuthResolver } from './resolvers/auth.resolver';
import { UserResolver } from './resolvers/user.resolver';

@Module({
  providers: [AuthResolver, UserResolver],
})
export class UserModule {}