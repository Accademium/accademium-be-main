import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity('programs_metadata')
export class ProgramMetadata {
  @PrimaryColumn('varchar')
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
