import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Lesson, CreateLessonInput } from '../models/lesson.model';
import { firstValueFrom } from 'rxjs';

@Resolver(() => Lesson)
export class LessonResolver {
    constructor(@Inject('COURSE_SERVICE') private readonly courseClient: ClientProxy) {}

    @Mutation(() => Lesson)
    async createLesson(@Args('createLessonInput') createLessonInput: CreateLessonInput): Promise<Lesson> {
        return await firstValueFrom(this.courseClient.send('lesson.create', createLessonInput));
    }

    @Query(() => Lesson, { name: 'lesson' })
    async getLesson(@Args('id', { type: () => String }) id: string): Promise<Lesson> {
        const lesson = await firstValueFrom(this.courseClient.send('lesson.findById', { id }));
        if (!lesson) {
            throw new Error(`Lesson with id ${id} not found`);
        }
        return lesson;
    }

    @Query(() => [Lesson], { name: 'lessonsByChapter' })
    async getLessonsByChapterId(@Args('chapterId', { type: () => String }) chapterId: string): Promise<Lesson[]> {
        return await firstValueFrom(this.courseClient.send('lesson.findByChapterId', { chapterId }));
    }

    @Mutation(() => Lesson)
    async updateLesson(
        @Args('id', { type: () => String }) id: string,
        @Args('updateLessonInput') updateLessonInput: CreateLessonInput,
    ): Promise<Lesson> {
        const updatedLesson = await firstValueFrom(this.courseClient.send('lesson.update', {id, updateLessonInput}));
        if (!updatedLesson) {
            throw new Error(`Lesson with id ${id} not found`);
        }
        return updatedLesson;
    }

    @Mutation(() => Boolean)
    async deleteLesson(@Args('id', { type: () => String }) id: string): Promise<boolean> {
        const result = await firstValueFrom(this.courseClient.send('lesson.delete', { id }));
        return result.deleted; 
    }
}