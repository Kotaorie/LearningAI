import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ScheduleModule } from './schedule.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ScheduleModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'schedule_queue',
      queueOptions: {
        durable: false
      },
    },
  });
  
  await app.listen();
}
bootstrap();