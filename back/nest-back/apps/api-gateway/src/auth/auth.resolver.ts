import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '../user/models/user.model';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from './guards/auth.guard';
import { AuthResponse } from './auth.model';

@Resolver(() => User)
export class AuthResolver {
    constructor(@Inject('USER_SERVICE') private readonly userClient: ClientProxy) {}

    @Mutation(() => Boolean)
    @UseGuards(AuthGuard)
    async handleGoogleCallback(
        @Args('code') code: string,
        @Context() context: any,
    ): Promise<boolean> {
        const result = await firstValueFrom(this.userClient.send('auth.handleGoogleCallBack',{code, userId: context.req.user.sub}));
        if (!result || !result.success) {
            throw new Error('Échec de la connexion avec Google');
        }
        return result.success;
    }

    @Mutation(() => AuthResponse)
    async login(
        @Args('email') email: string,
        @Args('password') password: string,
    ): Promise<any> {
        const user = await firstValueFrom(this.userClient.send('auth.login', { email, password }));
        if (!user || !user.access_token) {
            throw new Error('Identifiants invalides');
        }
        return {
            access_token: user.access_token,
            google_auth_url: user.google_auth_url,
        };
    }
}