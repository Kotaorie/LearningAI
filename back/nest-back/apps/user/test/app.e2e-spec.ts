import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userId: number;

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

  it('/ (GET)', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
  });

  it('POST /user/create - create user', async () => {
    const res = await request(app.getHttpServer())
      .post('/user')
      .send({
      email: 'test@example.com',
      password_hash: 'password123',
      firstName: 'Test',
      lastName: 'User',
      level: 1,
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe('test@example.com');
    userId = res.body.id;
  });

  it('GET /user/:id - get user', async () => {
    const res = await request(app.getHttpServer()).get(`/user/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', userId);
    expect(res.body.email).toBe('test@example.com');
  });

  it('PATCH /user/:id - update user', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/user/${userId}`)
      .send({ firstName: 'Updated User' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', userId);
    expect(res.body.firstName).toBe('Updated User');
  });

  it('DELETE /user/:id - delete user', async () => {
    const res = await request(app.getHttpServer()).delete(`/user/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ deleted: true });
  });
});
