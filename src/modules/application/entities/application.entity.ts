import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ApplicationStatus } from '../../../utils/enums/application-status.enum';
import { ApplicationDocument } from './application-document.entity';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  applicationId: string;

  @ManyToOne(() => User, (user) => user.applications, { 
    nullable: false
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.CREATED
  })
  status: ApplicationStatus;

  @Column({ nullable: false })
  programId: string;

  @Column({ nullable: false })
  programName: string;

  @Column({ nullable: false })
  universityName: string;
  
  @Column({ nullable: false })
  city: string;

  @Column({ nullable: false })
  country: string;

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

  @OneToMany(() => ApplicationDocument, (document) => document.application, {
    cascade: true,
  })
  applicationDocuments: ApplicationDocument[];
}