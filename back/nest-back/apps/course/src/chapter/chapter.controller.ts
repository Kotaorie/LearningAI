import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RmqContext, Ctx } from '@nestjs/microservices';
import { ChapterService } from './chapter.service';
import { Chapter } from '../../../../libs/database/src/entities/chapter.entity';

@Controller()
export class ChapterController {
    constructor(private readonly chapterService: ChapterService) {}
    
    @MessagePattern('chapter.create')
    async createChapter(@Payload() payload: Partial<Chapter>, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            const result = await this.chapterService.create(payload);
            channel.ack(originalMsg);
            return result;
        } catch (error) {
            // Handle error, possibly with a dead-letter queue
            throw error;
        }
    }

    @MessagePattern('chapter.findById')
    async getChapter(@Payload() payload: { id: string }, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            const result = await this.chapterService.findById(payload.id);
            channel.ack(originalMsg);
            return result;
        } catch (error) {
            throw error;
        }
    }

    @MessagePattern('chapter.findByCourseId')
    async getChaptersByCourseId(@Payload() payload: { courseId: string }, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            const result = await this.chapterService.findByCourseId(payload.courseId);
            channel.ack(originalMsg);
            return result;
        } catch (error) {
            throw error;
        }
    }

    @MessagePattern('chapter.update')
    async updateChapter(@Payload() payload: { id: string; updateChapterInput: Partial<Chapter> }, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            const result = await this.chapterService.update(payload.id, payload.updateChapterInput);
            channel.ack(originalMsg);
            return result;
        } catch (error) {
            throw error;
        }
    }

    @MessagePattern('chapter.delete')
    async deleteChapter(@Payload() payload: { id: string }, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            const result = await this.chapterService.delete(payload.id);
            channel.ack(originalMsg);
            return result;
        } catch (error) {
            throw error;
        }
    }
}