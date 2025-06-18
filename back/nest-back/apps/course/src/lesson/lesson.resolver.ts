import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { LessonService } from './lesson.service';
import { Lesson, CreateLessonInput } from './lesson.model';

@Resolver(() => Lesson)
export class LessonResolver {
    constructor(private readonly lessonService: LessonService) {}

    @Mutation(() => Lesson)
    async createLesson(
        @Args('createLessonInput') createLessonInput: CreateLessonInput,
    ): Promise<Lesson> {
        return this.lessonService.create(createLessonInput);
    }

    @Query(() => Lesson, { name: 'lesson' })
    async getLesson(@Args('id', { type: () => String }) id: string): Promise<Lesson> {
        const lesson = await this.lessonService.findById(id);
        if (!lesson) {
            throw new Error(`Lesson with id ${id} not found`);
        }
        return lesson;
    }

    @Query(() => [Lesson], { name: 'lessonsByChapter' })
    async getLessonsByChapterId(@Args('chapterId', { type: () => String }) chapterId: string): Promise<Lesson[]> {
        return this.lessonService.findByChapterId(chapterId);
    }

    @Mutation(() => Lesson)
    async updateLesson(
        @Args('id', { type: () => String }) id: string,
        @Args('updateLessonInput') updateLessonInput: CreateLessonInput,
    ): Promise<Lesson> {
        const updatedLesson = await this.lessonService.update(id, updateLessonInput);
        if (!updatedLesson) {
            throw new Error(`Lesson with id ${id} not found`);
        }
        return updatedLesson;
    }

    @Mutation(() => Boolean)
    async deleteLesson(@Args('id', { type: () => String }) id: string): Promise<boolean> {
        const result = await this.lessonService.delete(id);
        return result.deleted; 
    }
}