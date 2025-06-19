import { Test, TestingModule } from '@nestjs/testing';
import { CourseResolver } from './course.resolver';
import { CourseService } from './course.service';

describe('courseResolver', () => {
  let Resolver: CourseResolver;
  let service: CourseService;

  const mockCourse = { id: 1, title: 'Intro', courseId: 1, position: 1 };
  const mockCourse2 = { id: 2, title: 'dev', courseId: 1, position: 2 };
  const mockCourse3 = { id: 3, title: 'conclu', courseId: 1, position: 3 };
  const mockService = {
    create: jest.fn().mockResolvedValue(mockCourse),
    findById: jest.fn().mockResolvedValue(mockCourse),
    findAll: jest.fn().mockResolvedValue([mockCourse,mockCourse2,mockCourse3]),
    update: jest.fn().mockResolvedValue(mockCourse),
    delete: jest.fn().mockResolvedValue(mockCourse),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseResolver],
      providers: [
        {
          provide: CourseService,
          useValue: mockService,
        },
      ],
    }).compile();

    Resolver = module.get<CourseResolver>(CourseResolver);
    service = module.get<CourseService>(CourseService);
  });

 it('should create a course', async () => {
  const input = {
    title: 'Intro',
    courseId: '1',
    userId: '4',
    level:2,
    status: 'down',
  };

  const result = await Resolver.createCourse(input);
  expect(result).toEqual(mockCourse);
});


  it('should return a course by ID', async () => {
    const result = await Resolver.getCourse('1');
    expect(result).toEqual(mockCourse);
  });

  it('shoul return all courses', async () => {
    const result =await Resolver.getAllCourses();
    expect(result).toEqual([mockCourse,mockCourse2,mockCourse3])
  } )

  it('should update a course', async () => {
    const updateInput = {
      title: 'Introduction Test',
      courseId: '1',
      userId: '4',
      level:2,
      status: 'down',

    }
    const result = await Resolver.updateCourse('1', updateInput);
    expect(result).toEqual(mockCourse);
    expect(mockService.update).toHaveBeenCalledWith('1', updateInput);

  });

  it('should delete a course', async () => {
    await Resolver.deleteCourse('1');
    expect(mockService.delete).toHaveBeenCalledWith('1');
  });
});
