import { IsEnum, IsOptional, IsString } from "class-validator";
import { UserDocument } from "../../../user/entities/user-document.entity";
import { DocumentApprovalStatus } from "src/utils/enums/document-approval-status.enum";
import { ApplicationDocumentType } from "src/utils/enums/document-type.enum";

export class UpdateApplicationDocumentDto {
    @IsOptional()
    @IsString()
    userDocument?: UserDocument;

    @IsOptional()
    @IsEnum(DocumentApprovalStatus)
    approvalStatus?: DocumentApprovalStatus;

    @IsOptional()
    @IsEnum(ApplicationDocumentType)
    documentType?: ApplicationDocumentType;
    
    @IsOptional()
    @IsString()
    approvedBy?: string;
    
    @IsOptional()
    @IsString()
    approvalDate?: Date;
    
    @IsOptional()
    @IsString()
    rejectionReason?: string;
    
    @IsOptional()
    @IsString()
    description?: string;
}