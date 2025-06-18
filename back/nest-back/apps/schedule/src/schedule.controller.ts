import { Controller, UnauthorizedException } from '@nestjs/common';
import { MessagePattern, Payload, RmqContext, Ctx } from '@nestjs/microservices';
import { ScheduleService } from './schedule.service';
import { Schedule } from '../../../libs/database/src/entities/schedule.entity';

@Controller()
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @MessagePattern('schedule.create')
  async createSchedule(@Payload() payload: { createScheduleInput: Partial<Schedule>, userId: string}, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    const { createScheduleInput, userId } = payload;
    const data = { ...createScheduleInput, userId };
    try {
        const result = await this.scheduleService.createSchedule(data);
        channel.ack(originalMsg);
        return result;
    }
    catch (error) {
        //mettre en place la DLQ si j'ai le time rip ma nuit
        //channel.nack(originalMsg, false, false);
        throw error;
    }
  }

  @MessagePattern('schedule.findById')
  async getSchedule(@Payload() payload: { id: string, userId: string }, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
        const result = await this.scheduleService.getSchedule(payload.id);
        if(result?.userId !== payload.userId) {
            channel.ack(originalMsg);
            throw new UnauthorizedException('You are not authorized to access this schedule');
        }
        channel.ack(originalMsg);
        return result;
    }
    catch (error) {
        throw error;
    }
  }

  @MessagePattern('schedule.findByUserId')
  async getSchedulesByUserId(@Payload() payload: { userId: string }, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
        const result = await this.scheduleService.getSchedulesByUserId(payload.userId);
        channel.ack(originalMsg);
        return result;
    }
    catch (error) {
        throw error;
    }
  }

  @MessagePattern('schedule.update')
  async updateSchedule(@Payload() payload: { id: string; updateScheduleInput: Partial<Schedule> }, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
        const result = await this.scheduleService.updateSchedule(payload.id, payload.updateScheduleInput);
        channel.ack(originalMsg);
        return result;
    }
    catch (error) {
        throw error;
    }
  }

  @MessagePattern('schedule.delete')
  async deleteSchedule(@Payload() payload: { id: string, userId: string }, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
        const schedule = await this.scheduleService.getSchedule(payload.id);
        if (schedule?.userId !== payload.userId) {
            channel.ack(originalMsg);
            throw new UnauthorizedException('Schedule not found');
        }
        const result = await this.scheduleService.deleteSchedule(payload.id);
        channel.ack(originalMsg);
        return result;
    }
    catch (error) {
        throw error;
    }
  }
}
