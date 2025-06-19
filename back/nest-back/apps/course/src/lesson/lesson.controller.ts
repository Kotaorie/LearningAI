import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RmqContext, Ctx } from '@nestjs/microservices';
import { LessonService } from './lesson.service';
import { Lesson } from '../../../../libs/database/src/entities/lesson.entity';

@Controller()
export class LessonController {
    constructor(private readonly lessonService: LessonService) {}

    @MessagePattern('lesson.findById')
    async getLesson(@Payload() payload: { id: string }, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            const result = await this.lessonService.findById(payload.id);
            channel.ack(originalMsg);
            return result;
        } catch (error) {
            return error;
        }
    }

    @MessagePattern('lesson.findByChapterId')
    async getLessonsByChapterId(@Payload() payload: { chapterId: string }, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            const result = await this.lessonService.findByChapterId(payload.chapterId);
            channel.ack(originalMsg);
            return result;
        } catch (error) {
            return error;
        }
    }

    @MessagePattern('lesson.update')
    async updateLesson(@Payload() payload: { id: string; updateLessonInput: Partial<Lesson> }, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            const result = await this.lessonService.update(payload.id, payload.updateLessonInput);
            channel.ack(originalMsg);
            return result;
        } catch (error) {
            return error;
        }
    }

    @MessagePattern('lesson.delete')
    async deleteLesson(@Payload() payload: { id: string }, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            const result = await this.lessonService.delete(payload.id);
            channel.ack(originalMsg);
            return result;
        } catch (error) {
            return error;
        }
    }
}