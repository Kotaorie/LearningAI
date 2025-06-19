import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class GoogleCalendarService {
  private oauth2Client;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CALENDAR_CLIENT_ID,
      process.env.GOOGLE_CALENDAR_SECRET,
      process.env.GOOGLE_CALENDAR_REDIRECT_URI,
    );
  }

  generateAuthUrl(): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar'],
    });
  }

  async getTokensFromCode(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    return tokens;
  }

  setCredentials(tokens: any) {
    this.oauth2Client.setCredentials(tokens);
  }

  async addEvent(tokens: any, task: { summary: string; start: string; end: string }) {
    this.setCredentials(tokens);

    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

    const event = {
      summary: task.summary,
      start: { dateTime: new Date(task.start).toISOString() },
      end: { dateTime: new Date(task.end).toISOString() },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    return response.data;
  }
}
