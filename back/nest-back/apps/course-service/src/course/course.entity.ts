import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('course')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  title: string;

  @Column()
  level: string;

  @Column()
  status: string;

  @CreateDateColumn()
  created_at: Date;
}
