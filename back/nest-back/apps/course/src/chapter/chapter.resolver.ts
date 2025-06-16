import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ChapterService } from './chapter.service';
import { Chapter, CreateChapterInput } from './chapter.model';

@Resolver(() => Chapter)
export class ChapterResolver {
    constructor(private readonly chapterService: ChapterService) {}

    @Mutation(() => Chapter)
    async createChapter(
        @Args('createChapterInput') createChapterInput: CreateChapterInput,
    ): Promise<Chapter> {
        return this.chapterService.create(createChapterInput);
    }

    @Query(() => Chapter, { name: 'chapter' })
    async getChapter(
        @Args('id') id: string,
    ): Promise<Chapter> {
        const chapter = await this.chapterService.findById(id);
        if (!chapter) {
            throw new Error(`Chapter with id ${id} not found`);
        }
        return chapter;
    }

    @Query(() => [Chapter], { name: 'chaptersByCourseId' })
    async getChapters(
        @Args('courseId') courseId: string,
    ): Promise<Chapter[]> {
        return this.chapterService.findByCourseId(courseId);
    }

    @Mutation(() => Chapter)
    async updateChapter(
        @Args('id') id: string,
        @Args('updateChapterInput') updateChapterInput: CreateChapterInput,
    ): Promise<Chapter> {
        const updatedChapter = await this.chapterService.update(id, updateChapterInput);
        if (!updatedChapter) {
            throw new Error(`Chapter with id ${id} not found`);
        }
        return updatedChapter;
    }

    @Mutation(() => Boolean)
    async deleteChapter(
        @Args('id') id: string,
    ): Promise<boolean> {
        const result = await this.chapterService.delete(id);
        return result.deleted; 
    }
}