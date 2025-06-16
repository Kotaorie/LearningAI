import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('CourseController (e2e)', () => {
  let app: INestApplication;
  let courseId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /course - create course', async () => {
    const res = await request(app.getHttpServer())
      .post('/course')
      .send({
        user_id: 1,
        title: 'Test Course',
        level: 'beginner',
        status: 'draft',
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    courseId = res.body.id;
  });

  it('GET /course/:id - get course', async () => {
    const res = await request(app.getHttpServer()).get(`/course/${courseId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', courseId);
  });

  it('PATCH /course/:id - update course', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/course/${courseId}`)
      .send({ title: 'Updated Course' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Course');
  });

  it('DELETE /course/:id - delete course', async () => {
    const res = await request(app.getHttpServer()).delete(`/course/${courseId}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ deleted: true });
  });
});

describe('ChapterController (e2e)', () => {
  let app: INestApplication;
  let chapterId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /chapter - create chapter', async () => {
  const res = await request(app.getHttpServer())
    .post('/chapter')
    .send({
      course_id: 1,
      title: 'Test chapter',
      position: 1
    });
  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty('id');
  chapterId = res.body.id;
});


  it('GET /chapter/:id - get chapter', async () => {
    const res = await request(app.getHttpServer()).get(`/chapter/${chapterId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', chapterId);
  });

  it('PATCH /chapter/:id - update chapter', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/chapter/${chapterId}`)
      .send({ title: 'Updated chapter' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated chapter');
  });

  it('DELETE /chapter/:id - delete chapter', async () => {
    const res = await request(app.getHttpServer()).delete(`/chapter/${chapterId}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ deleted: true });
  });
});

describe('LessonController (e2e)', () => {
  let app: INestApplication;
  let lessonId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /lesson - create lesson', async () => {
  const res = await request(app.getHttpServer())
    .post('/lesson')
    .send({
      chapter_id: 1,
      title: 'Test lesson',
      content_markdown: 'Some content',
      position: 1
    });
  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty('id');
  lessonId = res.body.id;
});


  it('GET /lesson/:id - get lesson', async () => {
    const res = await request(app.getHttpServer()).get(`/lesson/${lessonId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', lessonId);
  });

  it('PATCH /lesson/:id - update lesson', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/lesson/${lessonId}`)
      .send({ title: 'Updated lesson' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated lesson');
  });

  it('DELETE /lesson/:id - delete lesson', async () => {
    const res = await request(app.getHttpServer()).delete(`/lesson/${lessonId}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ deleted: true });
  });
});

describe('QuizzController (e2e)', () => {
  let app: INestApplication;
  let quizzId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /quizz - create quizz', async () => {
  const res = await request(app.getHttpServer())
    .post('/quizz')
    .send({
      title: 'Test quizz',
      questions_json: [
        { question: 'What is 2 + 2?', choices: [2, 4, 5], answer: 4 }
      ],
      course_id: 1
    });
  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty('id');
  quizzId = res.body.id;
});


  it('GET /quizz/:id - get quizz', async () => {
    const res = await request(app.getHttpServer()).get(`/quizz/${quizzId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', quizzId);
  });

  it('PATCH /quizz/:id - update quizz', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/quizz/${quizzId}`)
      .send({ title: 'Updated quizz' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated quizz');
  });

  it('DELETE /quizz/:id - delete quizz', async () => {
    const res = await request(app.getHttpServer()).delete(`/quizz/${quizzId}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ deleted: true });
  });
});

