import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User, CreateUserInput, UpdateUserInput } from '../models/user.model';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from '../../auth/guards/auth.guard';

@Resolver(() => User)
export class UserResolver {
    constructor(@Inject('USER_SERVICE') private readonly userClient: ClientProxy) {}

    @Mutation(() => User)
    async createUser(
        @Args('createUserInput') createUserInput: CreateUserInput,
    ): Promise<User> {
        return await firstValueFrom(this.userClient.send('user.create', createUserInput));
    }

    @Query(() => User, { name: 'user' })
    @UseGuards(AuthGuard)
    async getUser(@Context() context: any): Promise<User> {
        const user = await firstValueFrom(this.userClient.send('user.findById', {userId: context.req.user.sub}));
        if (!user) {
            throw new Error(`User with id ${context.req.user.sub} not found`);
        }
        return user;
    }

    @Mutation(() => User)
    @UseGuards(AuthGuard)
    async updateUser(
        @Args('updateUserInput') updateUserInput: UpdateUserInput,
        @Context() context: any
    ): Promise<User> {
        if(!context.req.user || !context.req.user.sub) {
            throw new Error('User not authenticated');
        }
        const updatedUser = await firstValueFrom(this.userClient.send('user.update',{ updateUserInput, id: context.req.user.sub}));
        if (!updatedUser ) {
            throw new Error(`User with id ${context.req.user.sub } not found`);
        }
        return updatedUser;
    }

    @Mutation(() => Boolean)
    @UseGuards(AuthGuard)
    async deleteUser(@Context() context: any): Promise<boolean> {
        const result = await firstValueFrom(this.userClient.send('user.delete', { userId: context.req.user.sub }));
        return result.deleted;
    }
}