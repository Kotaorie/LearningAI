import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Chapter } from './chapter.entity';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  chapterId!: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  contentMarkdown: string;

  @Column()
  position: number;

  @ManyToOne(() => Chapter, chapter => chapter.lessons)
  chapter: Chapter;
}
