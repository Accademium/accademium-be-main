import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Application } from './application.entity';
import { DocumentApprovalStatus } from '../../../utils/enums/document-approval-status.enum';
import { UserDocument } from '../../user/entities/user-document.entity';
import { ApplicationDocumentType } from '../../../utils/enums/document-type.enum';

@Entity('applicationDocuments')
export class ApplicationDocument {
  @PrimaryGeneratedColumn('uuid')
  applicationDocumentId: string;

  @ManyToOne(
    () => Application, application => application.applicationDocuments,
    { nullable: false })
  @JoinColumn({ name: 'applicationId' })
  application: Application;

  @ManyToOne(
    () => UserDocument, userDocument => userDocument.applicationDocuments,
    { nullable: true })
  @JoinColumn({ name: 'userDocumentId' })
  userDocument: UserDocument;

  @Column()
  approvalStatus: DocumentApprovalStatus;

  @Column()
  documentType: ApplicationDocumentType;

  @Column({ nullable: true })
  approvedBy: string;

  @Column({ nullable: true })
  approvalDate: Date;

  @Column({ nullable: true })
  rejectionReason: string;

  @Column()
  isMandatory: boolean;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}