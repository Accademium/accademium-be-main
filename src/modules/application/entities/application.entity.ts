import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ApplicationStatus } from '../../../utils/enums/application-status.enum';
import { ApplicationDocument } from './application-document.entity';
import { ProgramMetadata } from '../../programs/entities/program-metadata.entity';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  applicationId: string;

  @ManyToOne(() => User, (user) => user.applications, { 
    nullable: false
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => ProgramMetadata, (program) => program.applications, { 
    nullable: false
  })
  @JoinColumn({ name: 'programId' })
  program: ProgramMetadata;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.CREATED
  })
  status: ApplicationStatus;

  @Column({ nullable: false })
  universityName: string;

  @Column({ nullable: true, type: 'timestamp' })
  submissionDate: Date;

  @Column({ nullable: true })
  mentorId: string;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ApplicationDocument, (applicationDocuments) => applicationDocuments.application, {
    cascade: true,
  })
  applicationDocuments: ApplicationDocument[];
}