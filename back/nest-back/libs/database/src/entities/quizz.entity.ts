import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('quizzes')
export class Quizz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  courseId: string;

  @Column()
  chapterId: string;

  @Column()
  title: string;

  @Column({ type: 'jsonb' })
  questionsJson: any;

  @CreateDateColumn()
  createdAt: Date;
}
