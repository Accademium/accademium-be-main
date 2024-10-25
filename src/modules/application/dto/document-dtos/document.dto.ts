import { DocumentApprovalStatus } from "src/utils/enums/document-approval-status.enum";

export class DocumentDto {
    id: string;
    applicationId: string;
    userId: string;
    documentType: string;
    s3Key: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    approvalStatus: DocumentApprovalStatus;
    approvedBy?: string;
    approvalDate?: Date;
    rejectionReason?: string;
    version: number;
    createdAt: Date;
    updatedAt: Date;
  }