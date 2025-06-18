import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ScheduleService } from './schedule.service';
import { Schedule, CreateScheduleInput } from './schedule.model';

@Resolver(() => Schedule)
export class ScheduleResolver {
    constructor(private readonly scheduleService: ScheduleService) {}

    @Mutation(() => Schedule)
    async createSchedule(
        @Args('createScheduleInput') createScheduleInput: CreateScheduleInput,
    ): Promise<Schedule> {
        return this.scheduleService.createSchedule(createScheduleInput);
    }

    @Query(() => Schedule, { name: 'schedule' })
    async getSchedule(@Args('id', { type: () => String }) id: string): Promise<Schedule> {
        const schedule = await this.scheduleService.getSchedule(id);
        if (!schedule) {
            throw new Error(`Schedule with id ${id} not found`);
        }
        return schedule;
    }

    @Query(() => [Schedule], { name: 'schedulesByUser' })
    async getSchedulesByUserId(@Args('userId', { type: () => String }) userId: string): Promise<Schedule[]> {
        return this.scheduleService.getSchedulesByUserId(userId);
    }

    @Mutation(() => Schedule)
    async updateSchedule(
        @Args('id', { type: () => String }) id: string,
        @Args('updateScheduleInput') updateScheduleInput: CreateScheduleInput,
    ): Promise<Schedule> {
        const updatedSchedule = await this.scheduleService.updateSchedule(id, updateScheduleInput);
        if (!updatedSchedule) {
            throw new Error(`Schedule with id ${id} not found`);
        }
        return updatedSchedule;
    }

    @Mutation(() => Boolean)
    async deleteSchedule(@Args('id', { type: () => String }) id: string): Promise<boolean> {
        const result = await this.scheduleService.deleteSchedule(id);
        return result.deleted;
    }
}