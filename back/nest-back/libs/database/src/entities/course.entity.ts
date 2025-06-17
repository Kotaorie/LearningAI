import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Chapter } from './chapter.entity';

@Entity('course')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId!: string;

  @Column()
  title: string;

  @Column()
  level: number;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Chapter, (chapter) => chapter.course, { nullable: true })
  chapters?: Chapter[];
}
