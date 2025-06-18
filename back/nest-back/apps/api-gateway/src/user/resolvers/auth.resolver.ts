import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '../models/user.model';
import { firstValueFrom } from 'rxjs';

@Resolver(() => User)
export class AuthResolver {
    constructor(@Inject('USER_SERVICE') private readonly userClient: ClientProxy) {}

    @Query(() => String)
    async getGoogleAuthUrl(): Promise<string> {
        return await firstValueFrom(this.userClient.send('auth.getGoogleAuthUrl', {}));
    }

    @Mutation(() => Boolean)
    async handleGoogleCallback(
        @Args('code') code: string,
        @Args('userId') userId: string,
    ): Promise<boolean> {
        const result = await firstValueFrom(this.userClient.send('auth.handleGoogleCallBack',{code, userId}));
        return result.success;
    }

    @Mutation(() => String)
    async login(
        @Args('email') email: string,
        @Args('password') password: string,
    ): Promise<any> {
        const user = await firstValueFrom(this.userClient.send('auth.login', { email, password }));
        return {
            access_token: user.access_token,
            google_auth_url: user.google_auth_url,
        };
    }
}