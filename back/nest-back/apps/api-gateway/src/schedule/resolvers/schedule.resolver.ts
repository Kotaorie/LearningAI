import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Schedule, CreateScheduleInput } from '../models/schedule.model';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Schedule)
export class ScheduleResolver {
    constructor(@Inject('SCHEDULE_SERVICE') private readonly scheduleClient: ClientProxy) {}

    @Query(() => Schedule, { name: 'schedule' })
    @UseGuards(AuthGuard)
    async getSchedule(@Args('id', { type: () => String }) id: string, @Context() context: any): Promise<Schedule> {
        const schedule = await firstValueFrom(this.scheduleClient.send('schedule.findById', { id, userId: context.req.user.sub }));
        if (!schedule) {
            throw new Error(`Schedule with id ${id} not found`);
        }
        return schedule;
    }

    @Query(() => [Schedule], { name: 'schedulesByUser' })
    @UseGuards(AuthGuard)
    async getSchedulesByUserId(@Context() context: any): Promise<Schedule[]> {
        return await firstValueFrom(this.scheduleClient.send('schedule.findByUserId', { userId: context.req.user.sub }));
    }

    @Mutation(() => Boolean)
    @UseGuards(AuthGuard)
    async deleteSchedule(@Args('id', { type: () => String }) id: string, @Context() context: any): Promise<boolean> {
        const result = await firstValueFrom(this.scheduleClient.send('schedule.delete', { id, userId: context.req.user.sub }));
        return result.deleted;
    }
}