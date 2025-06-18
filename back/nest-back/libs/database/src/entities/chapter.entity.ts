import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Course } from './course.entity';
import { Lesson } from './lesson.entity';

@Entity('chapters')
export class Chapter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  courseId!: string;

  @Column()
  title: string;

  @Column()
  position: number;

  @ManyToOne(() => Course, course => course.chapters)
  course: Course;

  @OneToMany(() => Lesson, (lesson) => lesson.chapter, { nullable: true })
  lessons?: Lesson[];
}
