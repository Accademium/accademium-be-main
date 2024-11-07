import { Expose } from "class-transformer";
import { DocumentApprovalStatus } from "src/utils/enums/document-approval-status.enum";
import { ApplicationDocumentType } from "src/utils/enums/document-type.enum";

export class ApplicationDocumentDto {
  @Expose({ name: 'documentId' })
  id: string;
  @Expose()
  s3Key?: string;
  @Expose()
  fileName?: string;
  @Expose()
  documentType: ApplicationDocumentType;
  @Expose()
  approvalStatus: DocumentApprovalStatus;
  @Expose()
  approvedBy?: string;
  @Expose()
  approvalDate?: Date;
  @Expose()
  rejectionReason?: string;
  @Expose()
  version: number;
  @Expose()
  isMandatory: boolean;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}
