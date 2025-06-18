import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Chapter, CreateChapterInput } from '../models/chapter.model';
import { firstValueFrom } from 'rxjs';

@Resolver(() => Chapter)
export class ChapterResolver {
    constructor(@Inject('COURSE_SERVICE') private readonly courseClient: ClientProxy) {}

    @Mutation(() => Chapter)
    async createChapter(
        @Args('createChapterInput') createChapterInput: CreateChapterInput,
    ): Promise<Chapter> {
        return await firstValueFrom(this.courseClient.send('chapter.create', createChapterInput));
    }

    @Query(() => Chapter, { name: 'chapter' })
    async getChapter(
        @Args('id') id: string,
    ): Promise<Chapter> {
        const chapter = await firstValueFrom(this.courseClient.send('chapter.findById', { id }));
        if (!chapter) {
            throw new Error(`Chapter with id ${id} not found`);
        }
        return chapter;
    }

    @Query(() => [Chapter], { name: 'chaptersByCourseId' })
    async getChapters(@Args('courseId') courseId: string): Promise<Chapter[]> {
        return firstValueFrom(this.courseClient.send('chapter.findByCourseId', { courseId }));
    }

    @Mutation(() => Chapter)
    async updateChapter(
        @Args('id') id: string,
        @Args('updateChapterInput') updateChapterInput: CreateChapterInput,
    ): Promise<Chapter> {
        const updatedChapter = await firstValueFrom(this.courseClient.send('chapter.update', { id, updateChapterInput }));
        if (!updatedChapter) {
            throw new Error(`Chapter with id ${id} not found`);
        }
        return updatedChapter;
    }

    @Mutation(() => Boolean)
    async deleteChapter(@Args('id') id: string): Promise<boolean> {
        const result = await firstValueFrom(this.courseClient.send('chapter.delete', { id }));
        return result.deleted; 
    }
}