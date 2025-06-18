import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User, CreateUserInput, UpdateUserInput } from '../models/user.model';
import { firstValueFrom } from 'rxjs';

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
    async getUser(@Args('id', { type: () => String }) id: string): Promise<User> {
        const user = await firstValueFrom(this.userClient.send('user.findById', {id}));
        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }
        return user;
    }

    @Query(() => User, { name: 'userByEmail' })
    async getUserByEmail(@Args('email', { type: () => String }) email: string): Promise<User> {
        const user = await firstValueFrom(this.userClient.send('user.findByEmail', { email }));
        if (!user) {
            throw new Error(`User with email ${email} not found`);
        }
        return user;
    }

    @Mutation(() => User)
    async updateUser(
        @Args('updateUserInput') updateUserInput: UpdateUserInput,
    ): Promise<User> {
        const updatedUser = await firstValueFrom(this.userClient.send('user.update', updateUserInput));
        if (!updatedUser) {
            throw new Error(`User with id ${updateUserInput.id} not found`);
        }
        return updatedUser;
    }

    @Mutation(() => Boolean)
    async deleteUser(@Args('id', { type: () => String }) id: string): Promise<boolean> {
        const result = await firstValueFrom(this.userClient.send('user.delete', { id }));
        return result.deleted;
    }
}