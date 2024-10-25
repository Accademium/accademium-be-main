import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { ApplicationStatus } from 'src/utils/enums/application-status.enum';
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

  @Column({ nullable: false })
  applicationName: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.CREATED
  })
  status: ApplicationStatus;

  @Column({ nullable: false })
  universityId: string;

  @Column({ nullable: false })
  universityName: string;

  @Column({ nullable: true, type: 'timestamp' })
  submissionDate: Date;

  @Column({ nullable: true })
  mentorId: string;

  @Column({ nullable: true })
  adminId: string;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @OneToMany(() => ApplicationDocument, (document) => document.application, {
    cascade: true,
  })
  documents: Document[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}