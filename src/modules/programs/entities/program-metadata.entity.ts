import { Application } from '../../application/entities/application.entity';
import { CountryEnum } from '../../../utils/enums/country.enum';
import { UniversityDetails } from '../../university/entities/university-details.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('programs_metadata')
export class ProgramMetadata {
  @PrimaryColumn('varchar')
  program_id: string;

  @Column()
  program_title: string;

  @Column()
  generalized_name: string;

  @ManyToOne(() => UniversityDetails, (university) => university.programs)
  @JoinColumn([
    { name: 'university_id', referencedColumnName: 'university_id' },
    { name: 'city', referencedColumnName: 'city' }
  ])
  university: UniversityDetails;

  @OneToMany(() => Application, application => application.program)
  applications: Application[];

  @Column({ nullable: false })
  university_id: string;

  @Column({ nullable: false })
  city: string;

  @Column({ 
    type: 'enum',
    enum: CountryEnum,
    nullable: true 
  })
  country: CountryEnum;

  @Column()
  degree_type: string;

  @Column()
  language: string;

  @Column('text', { array: true })
  fields: string[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}