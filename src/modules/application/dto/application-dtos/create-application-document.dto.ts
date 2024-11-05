import { DocumentApprovalStatus } from "src/utils/enums/document-approval-status.enum";
import { ApplicationDocumentType } from "src/utils/enums/document-type.enum";

export class CreateApplicationDocumentDto {
    applicationId: string;
    approvalStatus: DocumentApprovalStatus;
    documentType: ApplicationDocumentType;
    isMandatory: boolean;
    description: string;
}