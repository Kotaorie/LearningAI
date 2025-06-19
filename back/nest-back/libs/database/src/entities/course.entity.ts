import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Chapter } from './chapter.entity';

export enum CourseType {
  histoire = 'histoire',
  code = 'code',
  science = 'science',
  art = 'art',
  business = 'business',
  langue = 'langue',
  sport = 'sport',
}

@Entity('course')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId!: string;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: CourseType,
  })
  type: CourseType;

  @Column()
  sujet: string;

  @Column()
  level: number;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Chapter, (chapter) => chapter.course, { nullable: true })
  chapters?: Chapter[];
}
