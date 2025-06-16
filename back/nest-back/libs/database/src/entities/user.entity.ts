import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
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