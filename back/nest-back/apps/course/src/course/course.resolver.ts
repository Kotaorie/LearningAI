import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CourseService } from './course.service';
import { Course, CreateCourseInput } from './course.model';

@Resolver(() => Course)
export class CourseResolver {
    constructor(private readonly courseService: CourseService) {}

    @Mutation(() => Course)
    async createCourse(
        @Args('createCourseInput') createCourseInput: CreateCourseInput,
    ): Promise<Course> {
        return this.courseService.create(createCourseInput);
    }

    @Query(() => [Course], { name: 'courses' })
    async getAllCourses(): Promise<Course[]> {
        return this.courseService.findAll();
    }

    @Query(() => Course, { name: 'course' })
    async getCourse(@Args('id') id: string): Promise<Course> {
        const course = await this.courseService.findById(id);
        if (!course) {
            throw new Error(`Course with id ${id} not found`);
        }
        return course;
    }

    @Mutation(() => Course)
    async updateCourse(
        @Args('id') id: string,
        @Args('updateCourseInput') updateCourseInput: CreateCourseInput,
    ): Promise<Course> {
        const updatedCourse = await this.courseService.update(id, updateCourseInput);
        if (!updatedCourse) {
            throw new Error(`Course with id ${id} not found`);
        }
        return updatedCourse;
    }


    @Mutation(() => Boolean)
    async deleteCourse(@Args('id') id: string): Promise<boolean> {
        const result = await this.courseService.delete(id);
        return result.deleted;
    }
}