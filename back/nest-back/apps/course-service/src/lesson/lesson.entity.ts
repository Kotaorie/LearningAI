import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chapter_id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content_markdown: string;

  @Column()
  position: number;
}
