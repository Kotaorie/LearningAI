import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

jest.setTimeout(30000);

describe('E2E All controllers', () => {
  let app: INestApplication;
  let courseId: number;
  let chapterId: number;
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

  // COURSES
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

  // CHAPTERS
  it('POST /chapter - create chapter', async () => {
    const res = await request(app.getHttpServer())
      .post('/chapter')
      .send({
        course_id: courseId, 
        title: 'Test chapter',
        position: 1,
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

  // LESSONS
  it('POST /lesson - create lesson', async () => {
    const res = await request(app.getHttpServer())
      .post('/lesson')
      .send({
        chapter_id: chapterId, 
        title: 'Test lesson',
        content_markdown: 'Some content',
        position: 1,
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

  // CLEANUP
  it('DELETE /lesson/:id - delete lesson', async () => {
    const res = await request(app.getHttpServer()).delete(`/lesson/${lessonId}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ deleted: true });
  });

  it('DELETE /chapter/:id - delete chapter', async () => {
    const res = await request(app.getHttpServer()).delete(`/chapter/${chapterId}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ deleted: true });
  });

  it('DELETE /course/:id - delete course', async () => {
    const res = await request(app.getHttpServer()).delete(`/course/${courseId}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ deleted: true });
  });
});
