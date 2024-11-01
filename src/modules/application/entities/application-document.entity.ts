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
import { DocumentApprovalStatus } from '../../../utils/enums/document-approval-status.enum';
import { ApplicationDocumentType } from '../../../utils/enums/document-type.enum';

@Entity('documents')
export class ApplicationDocument {
  @PrimaryGeneratedColumn('uuid')
  documentId: string;

  @ManyToOne(() => Application)
  @JoinColumn({ name: 'applicationId' })
  application: Application;

  @Column({
    type: 'enum',
    enum: ApplicationDocumentType
  })
  documentType: ApplicationDocumentType;

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

  @Column({ default: true })
  isMandatory: boolean

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}