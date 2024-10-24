import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('programs_metadata')
export class ProgramMetadata {
  @PrimaryGeneratedColumn('uuid')
  program_id: string;

  @Column()
  program_title: string;

  @Column()
  generalized_name: string;

  @Column()
  university_id: string;

  @Column()
  degree_type: string;

  @Column()
  language: string;

  @Column()
  city: string;

  @Column('text', { array: true })
  fields: string[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}
