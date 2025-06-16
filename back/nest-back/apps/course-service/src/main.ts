import { NestFactory } from '@nestjs/core';
import { CourseServiceModule } from './course-service.module';

async function bootstrap() {
  const app = await NestFactory.create(CourseServiceModule);
  await app.listen(process.env.API_GATEWAY_PORT ?? 3001);
}
bootstrap();
