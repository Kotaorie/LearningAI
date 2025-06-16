import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('chapters')
export class Chapter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  course_id: number;

  @Column()
  title: string;

  @Column()
  position: number;
}
