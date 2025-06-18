import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Lesson, CreateLessonInput } from '../models/lesson.model';
import { firstValueFrom } from 'rxjs';

@Resolver(() => Lesson)
export class LessonResolver {
    constructor(@Inject('COURSE_SERVICE') private readonly courseClient: ClientProxy) {}

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
}