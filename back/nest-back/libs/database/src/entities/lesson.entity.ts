import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  chapterId: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  contentMarkdown: string;

  @Column()
  position: number;
}
