import { IsEnum, IsNumber, IsString } from "class-validator";
import { ApplicationDocumentType } from "src/utils/enums/document-type.enum";

export class CreateUserDocumentDto {
    @IsString()
    userId: string;
    @IsEnum(ApplicationDocumentType)
    documentType: ApplicationDocumentType; 
    @IsString()
    fileName: string;
    @IsString() 
    s3Key: string;
    @IsNumber() 
    size: number;
    @IsString() 
    mimeType: string; 
}