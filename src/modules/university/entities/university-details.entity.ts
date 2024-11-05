import { ProgramMetadata } from '../../programs/entities/program-metadata.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';

@Entity('university_details')
export class UniversityDetails {
  @PrimaryColumn('varchar')
  university_id: string;

  @PrimaryColumn('varchar')
  city: string;

  @Column()
  university: string;

  @Column()
  university_logo_link: string;

  @Column()
  university_type: string;

  @Column()
  address: string;

  @OneToMany(() => ProgramMetadata, (program) => program.university)
  programs: ProgramMetadata[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}