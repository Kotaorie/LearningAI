import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RmqContext, Ctx } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @MessagePattern('auth.getGoogleAuthUrl')
    async getGoogleAuthUrl(@Payload() payload: { redirectUri: string }, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            const result = await this.authService.getGoogleAuthUrl();
            channel.ack(originalMsg);
            return result;
        } catch (error) {
            // Optionally handle DLQ here
            throw error;
        }
    }

    @MessagePattern('auth.handleGoogleCallBack')
    async handleGoogleCallBack(
        @Payload() payload: { code: string; userId: string },
        @Ctx() context: RmqContext,
    ) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            const result = await this.authService.handleGoogleCallBack(payload.code, payload.userId);
            channel.ack(originalMsg);
            return result;
        } catch (error) {
            throw error;
        }
    }

    @MessagePattern('auth.login')
    async login(@Payload() payload: { email: string; password: string }, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            const result = await this.authService.login(payload.email, payload.password);
            channel.ack(originalMsg);
            return result;
        } catch (error) {
            throw error;
        }
    }
}