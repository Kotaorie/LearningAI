import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Schedule, CreateScheduleInput } from '../models/schedule.model';
import { firstValueFrom } from 'rxjs';

@Resolver(() => Schedule)
export class ScheduleResolver {
    constructor(@Inject('SCHEDULE_SERVICE') private readonly scheduleClient: ClientProxy) {}

    @Mutation(() => Schedule)
    async createSchedule(
        @Args('createScheduleInput') createScheduleInput: CreateScheduleInput,
    ): Promise<Schedule> {
        return await firstValueFrom(this.scheduleClient.send('schedule.create', createScheduleInput));
    }

    @Query(() => Schedule, { name: 'schedule' })
    async getSchedule(@Args('id', { type: () => String }) id: string): Promise<Schedule> {
        const schedule = await firstValueFrom(this.scheduleClient.send('schedule.findById', { id }));
        if (!schedule) {
            throw new Error(`Schedule with id ${id} not found`);
        }
        return schedule;
    }

    @Query(() => [Schedule], { name: 'schedulesByUser' })
    async getSchedulesByUserId(@Args('userId', { type: () => String }) userId: string): Promise<Schedule[]> {
        return await firstValueFrom(this.scheduleClient.send('schedule.findByUserId', { userId }));
    }

    @Mutation(() => Schedule)
    async updateSchedule(
        @Args('id', { type: () => String }) id: string,
        @Args('updateScheduleInput') updateScheduleInput: CreateScheduleInput,
    ): Promise<Schedule> {
        const updatedSchedule = await firstValueFrom(this.scheduleClient.send('schedule.update', {id, updateScheduleInput}));
        if (!updatedSchedule) {
            throw new Error(`Schedule with id ${id} not found`);
        }
        return updatedSchedule;
    }

    @Mutation(() => Boolean)
    async deleteSchedule(@Args('id', { type: () => String }) id: string): Promise<boolean> {
        const result = await firstValueFrom(this.scheduleClient.send('schedule.delete', { id }));
        return result.deleted;
    }
}