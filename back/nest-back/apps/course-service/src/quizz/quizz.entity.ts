import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('quizzes')
export class Quizz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  course_id: number;

  @Column()
  chapter_id: number;

  @Column()
  title: string;

  @Column({ type: 'jsonb' })
  questions_json: any;

  @CreateDateColumn()
  created_at: Date;
}
