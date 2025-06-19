import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Chapter, CreateChapterInput } from '../models/chapter.model';
import { firstValueFrom } from 'rxjs';

@Resolver(() => Chapter)
export class ChapterResolver {
    constructor(@Inject('COURSE_SERVICE') private readonly courseClient: ClientProxy) {}

    @Query(() => Chapter, { name: 'chapter' })
    async getChapter(
        @Args('id') id: string,
    ): Promise<Chapter> {
        const chapter = await firstValueFrom(this.courseClient.send('chapter.findById', { id }));
        if (!chapter || Object.keys(chapter).length === 0) {
            throw new Error(`Chapter with id ${id} not found`);
        }
        return chapter;
    }

    @Query(() => [Chapter], { name: 'chaptersByCourseId' })
    async getChapters(@Args('courseId') courseId: string): Promise<Chapter[]> {
        return firstValueFrom(this.courseClient.send('chapter.findByCourseId', { courseId }));
    }
}