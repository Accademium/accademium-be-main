import { Application } from "../../application/entities/application.entity";
import { Entity, Column, CreateDateColumn, UpdateDateColumn, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn('varchar', { length: 36 })
  userId: string;

  @OneToMany(() => Application, (application) => application.user)
  applications: Application[];

  @Column({ unique: true })
  email: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ type: 'date', nullable: true })
  date_of_birth: Date;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  nationality: string;

  @Column({ type: 'jsonb', nullable: true })
  language_skills: Record<string, string>;

  @Column({ nullable: true })
  current_education_level: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'timestamp', nullable: true })
  last_login: Date;
}