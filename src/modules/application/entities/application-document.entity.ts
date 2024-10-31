import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne, 
  JoinColumn
} from 'typeorm';
import { Application } from './application.entity';
import { User } from '../../user/entities/user.entity';
import { DocumentApprovalStatus } from '../../../utils/enums/document-approval-status.enum';

@Entity('documents')
export class ApplicationDocument {
  @PrimaryGeneratedColumn('uuid')
  documentId: string;

  @ManyToOne(() => Application) //, (application) => application.documents, { nullable: false }
  @JoinColumn({ name: 'applicationId' })
  application: Application;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  documentType: string;

  @Column()
  s3Key: string;

  @Column()
  fileName: string;

  @Column('integer')
  fileSize: number;

  @Column()
  mimeType: string;

  @Column({
    type: 'enum',
    enum: DocumentApprovalStatus,
    default: DocumentApprovalStatus.PENDING
  })
  approvalStatus: DocumentApprovalStatus;

  @Column({ nullable: true })
  approvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  approvalDate: Date;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @Column('integer', { default: 1 })
  version: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}