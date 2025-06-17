import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Course, CreateCourseInput } from '../models/course.model';
import { firstValueFrom } from 'rxjs';

@Resolver(() => Course)
export class CourseResolver {
    constructor(@Inject('COURSE_SERVICE') private readonly courseClient: ClientProxy) {}

    @Mutation(() => Course)
    async createCourse(@Args('createCourseInput') createCourseInput: CreateCourseInput): Promise<Course> {
        const existingCourse = await firstValueFrom(this.courseClient.send('course.create', createCourseInput));
        return { ...existingCourse, createdAt: new Date(existingCourse.createdAt),};
    }

    @Query(() => [Course], { name: 'courses' })
    async getAllCourses(): Promise<Course[]> {
        const existingCourses = await firstValueFrom(this.courseClient.send('course.findAll', {}));
        return {...existingCourses, createdAt: new Date(existingCourses.createdAt),};
    }

    @Query(() => Course, { name: 'course' })
    async getCourse(@Args('id') id: string): Promise<Course> {
        const course = await firstValueFrom(this.courseClient.send('course.findById', { id }));
        if (!course) {
            throw new Error(`Course with id ${id} not found`);
        }
        return {...course, createdAt: new Date(course.createdAt),};
    }

    @Mutation(() => Course)
    async updateCourse(
        @Args('id') id: string,
        @Args('updateCourseInput') updateCourseInput: CreateCourseInput,
    ): Promise<Course> {
        const updatedCourse = await firstValueFrom(
            this.courseClient.send('course.update', { id, updateCourseInput }),
        );
        if (!updatedCourse) {
            throw new Error(`Course with id ${id} not found`);
        }
        return updatedCourse;
    }

    @Mutation(() => Boolean)
    async deleteCourse(@Args('id') id: string): Promise<boolean> {
        const result = await firstValueFrom(this.courseClient.send('course.delete', { id }));
        return result?.deleted ?? false;
    }
}