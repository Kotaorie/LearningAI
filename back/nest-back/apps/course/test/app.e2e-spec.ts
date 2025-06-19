import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppCourseModule } from '../src/app.module';

describe('GraphQL Integration (Course, Chapter, Lesson)', () => {
  let app: INestApplication;
  let courseId: string;
  let chapterId: string;
  let lessonId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppCourseModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // --- COURSE CRUD ---

  it('should create a course', async () => {
    const mutation = `
      mutation CreateCourse($input: CreateCourseInput!) {
        createCourse(createCourseInput: $input) {
          id
          title
          level
          status
          createdAt
        }
      }
    `;
    const variables = {
      input: {
        title: "Integration Test Course",
        level: "beginner",
        status: "draft",
      }
    };
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation, variables });
    expect(res.body.data.createCourse).toHaveProperty('id');
    courseId = res.body.data.createCourse.id;
  });

  it('should fetch course by id', async () => {
    const query = `
      query GetCourse($id: String!) {
        course(id: $id) { id title level status createdAt }
      }
    `;
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query, variables: { id: courseId }});
    expect(res.body.data.course).toHaveProperty('id', courseId);
  });

  it('should update a course', async () => {
    const mutation = `
      mutation UpdateCourse($id: String!, $input: UpdateCourseInput!) {
        updateCourse(id: $id, updateCourseInput: $input) { id title }
      }
    `;
    const variables = { id: courseId, input: { title: "Updated Course Title" }};
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation, variables });
    expect(res.body.data.updateCourse.title).toBe("Updated Course Title");
  });

  it('should list all courses', async () => {
    const query = `query { courses { id title } }`;
    const res = await request(app.getHttpServer()).post('/graphql').send({ query });
    expect(res.body.data.courses).toEqual(
      expect.arrayContaining([{ id: courseId, title: "Updated Course Title" }])
    );
  });

  // --- CHAPTER CRUD ---

  it('should create a chapter', async () => {
    const mutation = `
      mutation CreateChapter($input: CreateChapterInput!) {
        createChapter(createChapterInput: $input) { id title courseId position }
      }
    `;
    const variables = {
      input: {
        courseId,
        title: "Chapitre Intégration",
        position: 1,
      }
    };
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation, variables });
    expect(res.body.data.createChapter).toHaveProperty('id');
    chapterId = res.body.data.createChapter.id;
  });

  it('should fetch chapter by id', async () => {
    const query = `
      query GetChapter($id: String!) {
        chapter(id: $id) { id title courseId position }
      }
    `;
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query, variables: { id: chapterId }});
    expect(res.body.data.chapter).toHaveProperty('id', chapterId);
  });

  it('should list chapters by courseId', async () => {
    const query = `
      query GetChaptersByCourseId($courseId: String!) {
        chaptersByCourseId(courseId: $courseId) { id title }
      }
    `;
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query, variables: { courseId }});
    expect(res.body.data.chaptersByCourseId).toEqual(
      expect.arrayContaining([{ id: chapterId, title: "Chapitre Intégration" }])
    );
  });

  // --- LESSON CRUD ---

  it('should create a lesson', async () => {
    const mutation = `
      mutation CreateLesson($input: CreateLessonInput!) {
        createLesson(createLessonInput: $input) { id title chapterId position contentMarkdown }
      }
    `;
    const variables = {
      input: {
        chapterId,
        title: "Leçon Test",
        position: 1,
        contentMarkdown: "Ceci est le contenu de la leçon."
      }
    };
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation, variables });
    expect(res.body.data.createLesson).toHaveProperty('id');
    lessonId = res.body.data.createLesson.id;
  });

  it('should fetch lesson by id', async () => {
    const query = `
      query GetLesson($id: String!) {
        lesson(id: $id) { id title chapterId contentMarkdown }
      }
    `;
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query, variables: { id: lessonId }});
    expect(res.body.data.lesson).toHaveProperty('id', lessonId);
  });

  it('should list lessons by chapter', async () => {
    const query = `
      query LessonsByChapter($chapterId: String!) {
        lessonsByChapter(chapterId: $chapterId) { id title }
      }
    `;
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query, variables: { chapterId }});
    expect(res.body.data.lessonsByChapter).toEqual(
      expect.arrayContaining([{ id: lessonId, title: "Leçon Test" }])
    );
  });

  // --- ERRORS & EDGES ---

  it('should return error on non-existent course', async () => {
    const query = `query { course(id: "doesnotexist") { id } }`;
    const res = await request(app.getHttpServer()).post('/graphql').send({ query });
    expect(res.body.errors).toBeDefined();
  });

  it('should return error on non-existent chapter', async () => {
    const query = `query { chapter(id: "doesnotexist") { id } }`;
    const res = await request(app.getHttpServer()).post('/graphql').send({ query });
    expect(res.body.errors).toBeDefined();
  });

  it('should return error on non-existent lesson', async () => {
    const query = `query { lesson(id: "doesnotexist") { id } }`;
    const res = await request(app.getHttpServer()).post('/graphql').send({ query });
    expect(res.body.errors).toBeDefined();
  });

  
});
