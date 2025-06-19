import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RmqContext, Ctx } from '@nestjs/microservices';
import { CourseService } from './course.service';
import { Course } from '../../../../libs/database/src/entities/course.entity';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

@Controller()
export class CourseController {
    constructor(private readonly courseService: CourseService) {}

    @MessagePattern('course.create')
    async createCourse(
        @Payload() payload: { createCourseInput: Partial<Course>; userId: string },
        @Ctx() context: RmqContext
    ) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        const { createCourseInput, userId } = payload;
        const data = { ...createCourseInput, userId };
        try {
            const result = await this.courseService.create(data);
            channel.ack(originalMsg);
            return result;
        } catch (error) {
            // Handle error, possibly with a dead-letter queue
            throw error;
        }
    }

    @MessagePattern('course.findAll')
    async getAllCourses(@Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            const result = await this.courseService.findAll();
            channel.ack(originalMsg);
            return result;
        } catch (error) {
            throw error;
        }
    }

    @MessagePattern('course.findById')
    async getCourse(@Payload() payload: { id: string }, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            const result = await this.courseService.findById(payload.id);
            channel.ack(originalMsg);
            return result;
        } catch (error) {
            throw error;
        }
    }

    @MessagePattern('course.generateChapter')
    async generateChapter(@Payload() payload: { id: string; chapterId: string }, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            const result = await this.courseService.generateChapter(payload.id, payload.chapterId);
            channel.ack(originalMsg);
            return result;
        } catch (error) {
            throw error;
        }
    }

    @MessagePattern('course.update')
    async updateCourse(@Payload() payload: { id: string; updateCourseInput: Partial<Course> }, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            const result = await this.courseService.update(payload.id, payload.updateCourseInput);
            channel.ack(originalMsg);
            return result;
        } catch (error) {
            throw error;
        }
    }


    @MessagePattern('course.delete')
    async deleteCourse(@Payload() payload: { id: string, userId: string }, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            const course = await this.courseService.findById(payload.id);
            if (!course) {
                channel.ack(originalMsg);
                throw new NotFoundException('Course not found');
            }
            if (course.userId !== payload.userId) {
                channel.ack(originalMsg);
                throw new UnauthorizedException('Unauthorized: You are not the creator of this course');
            }
            const result = await this.courseService.delete(payload.id);
            channel.ack(originalMsg);
            return result;
        } catch (error) {
            return error;
        }
    }
}