import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';

config();
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  logging: false,
  entities: [
    path.join(__dirname, '/entities/**/*.entity{.ts,.js}'),
  ],
  
  migrations: [
    path.join(__dirname, '/migrations/*{.ts,.js}')
  ],
  
  // subscribers: [
  //   path.join(__dirname, '**/*.subscriber{.ts,.js}')
  // ],
});