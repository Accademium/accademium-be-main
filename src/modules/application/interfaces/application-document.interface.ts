import { ApplicationKey, DocumentKey } from 'src/utils/interfaces/keys';

export interface ApplicationDocument extends DocumentKey {
  applicationId: ApplicationKey;
  userId: string;
  documentType: string;
  s3Key: string;
  fileName: string;
  uploadDate: Date;
  fileSize: number;
  mimeType: string;
  approvalStatus: string;
  approvedBy?: string;
  approvalDate?: Date;
  rejectionReason?: string;
  version: number;
}
