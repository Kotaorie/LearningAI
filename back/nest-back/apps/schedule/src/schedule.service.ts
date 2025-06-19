import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoogleCalendarService } from '../../../libs/google-calendar/src/google-calendar.service';
import { Schedule } from '../../../libs/database/src/entities/schedule.entity';
import { User } from '../../../libs/database/src/entities/user.entity';



@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private googleCalendarService: GoogleCalendarService,
  ) {}

  async getUserById(userId: string): Promise<any> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async createSchedule(schedule: Partial<Schedule>): Promise<Schedule> {
    if (!schedule.userId) {
      throw new Error('userId is required to create a schedule');
    }
    const newSchedule = this.scheduleRepository.create(schedule);
    const saved = await this.scheduleRepository.save(newSchedule);

    const user = await this.getUserById(saved.userId);
    const endDate = new Date(saved.startDate + saved.durationWeeks * 7 * 24 * 60 * 60 * 1000);
    if (user?.googleTokens) {
      try {
        await this.googleCalendarService.addEvent(
          user.googleTokens,
          {
            summary: saved.courseName ?? 'Tâche',
            start: saved.startDate.toString(),
            end: endDate.toISOString(),
          }
        );
      } catch (e) {
        console.error('Erreur lors de la création Google Calendar :', e.message);
      }
    }

    return saved;
  }

  
  async getSchedule(id: string): Promise<Schedule | null> {
    return this.scheduleRepository.findOne({ where: { id } });
  }

  async getSchedulesByUserId(userId: string): Promise<Schedule[]> {
    return this.scheduleRepository.find({ where: { userId } });
  }

  async updateSchedule(id: string, schedule: Partial<Schedule>): Promise<Schedule | null> {
    await this.scheduleRepository.update(id, schedule);
    return this.scheduleRepository.findOne({ where: { id } });
  }

  async deleteSchedule(id: string): Promise<{ deleted: boolean }> {
    const result = await this.scheduleRepository.delete(id);
    if (result.affected === undefined || result.affected === null) {
      const errorMsg = `Delete operation did not return an affected count; no schedule deleted for id: ${id}`;
      throw new Error(errorMsg);
    }
    return { deleted: result.affected > 0  };
  }
  
}
