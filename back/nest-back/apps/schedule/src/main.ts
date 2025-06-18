import { NestFactory } from '@nestjs/core';
import { ScheduleModule } from './schedule.module';

async function bootstrap() {
  const app = await NestFactory.create(ScheduleModule);
  await app.listen(process.env.SCHEDULE_SERVICE_PORT ?? 3004);
}
bootstrap();
