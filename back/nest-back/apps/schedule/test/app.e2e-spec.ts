import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ScheduleModule } from './../src/schedule.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

describe('ScheduleResolver (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        GraphQLModule.forRoot({
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        }),
        ScheduleModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should create a schedule', async () => {
    const mutation = `
      mutation {
        createSchedule(createScheduleInput: {
          userId: "1",
          courseName: "GraphQL Bootcamp",
          courseId: "C123",
          startDate: "2024-06-01T00:00:00.000Z",
          durationWeeks: 4,
          days: ["Monday", "Wednesday"],
          hoursPerSession: 2
        }) {
          id
          courseName
          userId
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation });

    expect(response.body.data.createSchedule).toBeDefined();
    expect(response.body.data.createSchedule.courseName).toBe('GraphQL Bootcamp');
  });

  afterAll(async () => {
    await app.close();
  });
});
