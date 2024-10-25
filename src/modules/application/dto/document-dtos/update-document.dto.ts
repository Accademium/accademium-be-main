import { DocumentApprovalStatus } from "src/utils/enums/document-approval-status.enum";

export class UpdateDocumentDto {
    documentType?: string;
    s3Key?: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    approvalStatus?: DocumentApprovalStatus;
    approvedBy?: string;
    approvalDate?: Date;
    rejectionReason?: string;
    version?: number;
}