import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { QuizzService } from './quizz.service';
import { Quizz, CreateQuizzInput } from './quizz.model';

@Resolver(() => Quizz)
export class QuizzResolver {
    constructor(private readonly quizzService: QuizzService) {}

    @Mutation(() => Quizz)
    async createQuizz(
        @Args('CreateQuizzInput') CreateQuizzInput: CreateQuizzInput,
    ): Promise<Quizz> {
        return this.quizzService.create(CreateQuizzInput);
    }

    @Query(() => Quizz, { name: 'quizz' })
    async getQuizz(@Args('id', { type: () => String }) id: string): Promise<Quizz> {
        const quizz = await this.quizzService.findById(id);
        if (!quizz) {
            throw new Error(`Quizz with id ${id} not found`);
        }
        return quizz;
    }

    @Query(() => [Quizz], { name: 'quizzesByChapter' })
    async getQuizzesByChapterId(@Args('chapterId', { type: () => String }) chapterId: string): Promise<Quizz[]> {
        return this.quizzService.getQuestionsByQuizId(chapterId);
    }

    @Mutation(() => Quizz)
    async updateQuizz(
        @Args('id', { type: () => String }) id: string,
        @Args('updateLessonInput') updateLessonInput: CreateQuizzInput,
    ): Promise<Quizz> {
        const updatedQuizz = await this.quizzService.update(id, updateLessonInput);
        if (!updatedQuizz) {
            throw new Error(`Quizz with id ${id} not found`);
        }
        return updatedQuizz;
    }

    @Mutation(() => Boolean)
    async deleteQuizz(@Args('id', { type: () => String }) id: string): Promise<boolean> {
        const result = await this.quizzService.delete(id);
        return result.deleted;
    }
}