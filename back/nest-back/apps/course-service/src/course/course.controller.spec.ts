import { Test, TestingModule } from '@nestjs/testing';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';

describe('courseController', () => {
  let controller: CourseController;
  let service: CourseService;

  const mockCourse = { id: 1, title: 'Intro', course_id: 1, position: 1 };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockCourse),
    findById: jest.fn().mockResolvedValue(mockCourse),
    findByCourseId: jest.fn().mockResolvedValue([mockCourse]),
    update: jest.fn().mockResolvedValue(mockCourse),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseController],
      providers: [
        {
          provide: CourseService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<CourseController>(CourseController);
    service = module.get<CourseService>(CourseService);
  });

 it('should create a course', async () => {
  const dto = {
    title: 'Intro',
    course_id: 1,
    user_id: 4,
  };

  const result = await controller.createCourse(dto);
  expect(result).toEqual(mockCourse);
});


  it('should return a course by ID', async () => {
    const result = await controller.getCourse('1');
    expect(result).toEqual(mockCourse);
  });

  it('should update a course', async () => {
    const result = await controller.updateCourse('1', { title: 'New Title' });
    expect(result).toEqual(mockCourse);
  });

  it('should delete a course', async () => {
    await controller.deleteCourse('1');
    expect(mockService.delete).toHaveBeenCalledWith(1);
  });
});
