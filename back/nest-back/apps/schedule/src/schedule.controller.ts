import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RmqContext, Ctx } from '@nestjs/microservices';
import { ScheduleService } from './schedule.service';
import { Schedule } from '../../../libs/database/src/entities/schedule.entity';

@Controller()
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @MessagePattern('schedule.create')
  async createSchedule(@Payload() payload: Partial<Schedule>, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
        const result = await this.scheduleService.createSchedule(payload);
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
  async getSchedule(@Payload() payload: { id: string }, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
        const result = await this.scheduleService.getSchedule(payload.id);
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
  async deleteSchedule(@Payload() payload: { id: string }, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
        const result = await this.scheduleService.deleteSchedule(payload.id);
        channel.ack(originalMsg);
        return result;
    }
    catch (error) {
        throw error;
    }
  }
}
