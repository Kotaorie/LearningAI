import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Course, CreateCourseInput } from '../models/course.model';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { Chapter } from '../models/chapter.model';

@Resolver(() => Course)
export class CourseResolver {
    constructor(@Inject('COURSE_SERVICE') private readonly courseClient: ClientProxy) {}

    @Mutation(() => Course)
    @UseGuards(AuthGuard)
    async createCourse(@Args('createCourseInput') createCourseInput: CreateCourseInput, @Context() context: any): Promise<Course> {
        const existingCourse = await firstValueFrom(this.courseClient.send('course.create', {createCourseInput, userId: context.req.user.sub}));
        return { 
            ...existingCourse,
            createdAt: new Date(existingCourse.createdAt),
        }; 
    }

    @Query(() => [Course], { name: 'courses' })
    async getAllCourses(): Promise<Course[]> {
        const existingCourses = await firstValueFrom(this.courseClient.send('course.findAll', {}));
        if (!existingCourses || existingCourses.length === 0) {
            return [];
        }
        const coursesWithDates = existingCourses.map(course => ({
            ...course,
            createdAt: new Date(course.createdAt),
        }));
        return coursesWithDates;
    }

    @Query(() => Course, { name: 'course' })
    async getCourse(@Args('id') id: string): Promise<Course> {
        const course = await firstValueFrom(this.courseClient.send('course.findById', { id }));
        if (!course) {
            throw new Error(`Course with id ${id} not found`);
        }
        return {...course, createdAt: new Date(course.createdAt),};
    }

    @Mutation(() => Chapter)
    async generateChapter(@Args('id') id: string, @Args('chapterId') chapterId: string): Promise<Chapter> {
        const chapter = await firstValueFrom(this.courseClient.send('course.generateChapter', { id, chapterId }));
        if (!chapter || Object.keys(chapter).length === 0) {
            throw new Error(`Chapter with id ${id} not found`);
        }
        return chapter;
    }

    @Mutation(() => Boolean)
    @UseGuards(AuthGuard)
    async deleteCourse(@Args('id') id: string,  @Context() context: any): Promise<boolean> {
        const result = await firstValueFrom(this.courseClient.send('course.delete', { id,userId: context.req.user.sub }));
        if (!result.deleted) {
            throw new Error(`Failed to delete course with id ${id}: ${result.response.message}`);
        }
        return result?.deleted;
    }
}