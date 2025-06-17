import { Module } from '@nestjs/common';
import { ScheduleResolver } from './resolvers/schedule.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';


@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SCHEDULE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'schedule_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  providers: [ScheduleResolver],
})
export class ScheduleModule {}