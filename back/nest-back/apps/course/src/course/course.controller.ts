import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RmqContext, Ctx } from '@nestjs/microservices';
import { CourseService } from './course.service';
import { Course } from '../../../../libs/database/src/entities/course.entity';

@Controller()
export class CourseController {
    constructor(private readonly courseService: CourseService) {}

    @MessagePattern('course.create')
    async createCourse(@Payload() payload: Partial<Course>, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            const result = await this.courseService.create(payload);
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
    async deleteCourse(@Payload() payload: { id: string }, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            const result = await this.courseService.delete(payload.id);
            channel.ack(originalMsg);
            return result;
        } catch (error) {
            throw error;
        }
    }
}