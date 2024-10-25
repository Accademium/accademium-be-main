import { DocumentApprovalStatus } from "src/utils/enums/document-approval-status.enum";

export class DocumentApprovalDto {
    approvalStatus: DocumentApprovalStatus;
    approvedBy: string;
    rejectionReason?: string;
}