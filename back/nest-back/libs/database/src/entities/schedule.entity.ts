import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Schedule {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column()
    courseId: string;

    @Column()
    courseName: string;

    @Column("simple-array")
    days: string[];

    @Column('int')
    hoursPerSession: number;

    @Column('int')
    durationWeeks: number;

    @Column()
    startDate: string;
}