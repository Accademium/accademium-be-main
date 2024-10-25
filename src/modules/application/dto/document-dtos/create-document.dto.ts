export class CreateDocumentDto {
    documentType: string;
    s3Key?: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
}