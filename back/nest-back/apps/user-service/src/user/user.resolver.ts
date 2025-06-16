import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User, CreateUserInput, UpdateUserInput } from './user.model';

@Resolver(() => User)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Mutation(() => User)
    async createUser(
        @Args('createUserInput') createUserInput: CreateUserInput,
    ): Promise<User> {
        return this.userService.create(createUserInput);
    }

    @Query(() => User, { name: 'user' })
    async getUser(@Args('id', { type: () => String }) id: string): Promise<User> {
        const user = await this.userService.findById(id);
        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }
        return user;
    }

    @Query(() => User, { name: 'userByEmail' })
    async getUserByEmail(@Args('email', { type: () => String }) email: string): Promise<User> {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new Error(`User with email ${email} not found`);
        }
        return user;
    }

    @Mutation(() => User)
    async updateUser(
        @Args('updateUserInput') updateUserInput: UpdateUserInput,
    ): Promise<User> {
        const updatedUser = await this.userService.update(updateUserInput);
        if (!updatedUser) {
            throw new Error(`User with id ${updateUserInput.id} not found`);
        }
        return updatedUser;
    }

    @Mutation(() => Boolean)
    async deleteUser(@Args('id', { type: () => String }) id: string): Promise<boolean> {
        const result = await this.userService.delete(id);
        return result.deleted;
    }
}