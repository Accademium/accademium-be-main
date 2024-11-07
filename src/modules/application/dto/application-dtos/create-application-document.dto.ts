import { DocumentApprovalStatus } from "src/utils/enums/document-approval-status.enum";
import { ApplicationDocumentType } from "src/utils/enums/document-type.enum";
import { Application } from "../../entities/application.entity";

export class CreateApplicationDocumentDto {
    application: Application;
    approvalStatus: DocumentApprovalStatus;
    documentType: ApplicationDocumentType;
    isMandatory: boolean;
    description: string;
}