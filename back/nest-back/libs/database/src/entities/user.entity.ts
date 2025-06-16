import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password_hash: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  level: number;

  @Column({ nullable: true })
  googleTokens: string;
  
}