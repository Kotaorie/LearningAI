import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RmqContext, Ctx } from '@nestjs/microservices';
import { UserService } from './user.service';
import { User } from '../../../../libs/database/src/entities/user.entity';

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @MessagePattern('user.create')
    async createUser(@Payload() payload: Partial<User>, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            const result = await this.userService.create(payload);
            channel.ack(originalMsg);
            return result;
        } catch (error) {
            // Optionally handle DLQ here
            return error;
        }
    }

    @MessagePattern('user.findById')
    async findById(@Payload() payload: { id: string }, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            const result = await this.userService.findById(payload.id);
            channel.ack(originalMsg);
            return result;
        } catch (error) {
            return error;
        }
    }

    @MessagePattern('user.findByEmail')
    async findByEmail(@Payload() payload: { email: string }, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            const result = await this.userService.findByEmail(payload.email);
            channel.ack(originalMsg);
            return result;
        } catch (error) {
            return error;
        }
    }

    @MessagePattern('user.update')
    async updateUser(@Payload() payload: {updateUserInput: Partial<User>, id: string}, @Ctx() context: RmqContext) {
        const {updateUserInput, id} = payload;
        const data = { ...updateUserInput, id };
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            const result = await this.userService.update(data);
            channel.ack(originalMsg);
            return result;
        } catch (error) {
            return error;
        }
    }

    @MessagePattern('user.delete')
    async deleteUser(@Payload() payload: { id: string }, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            const result = await this.userService.delete(payload.id);
            channel.ack(originalMsg);
            return { deleted: result };
        } catch (error) {
            return error;
        }
    }
}