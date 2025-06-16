import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from '../user/user.service';
import {User, CreateUserInput, UpdateUserInput} from '../user/user.model';
import { AuthService } from './auth.service';

@Resolver(() => User)
export class AuthResolver {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    @Query(() => String)
    async getGoogleAuthUrl(): Promise<string> {
        return this.authService.getGoogleAuthUrl();
    }

    @Mutation(() => Boolean)
    async handleGoogleCallback(
        @Args('code') code: string,
        @Args('userId') userId: string,
    ): Promise<boolean> {
        const result = await this.authService.handleGoogleCallback(code, userId);
        return result.success;
    }

    @Mutation(() => String)
    async login(
        @Args('email') email: string,
        @Args('password') password: string,
    ): Promise<any> {
        const user = await this.authService.login({ email, password });
        return {
            access_token: user.access_token,
            google_auth_url: user.google_auth_url,
        };
    }
}