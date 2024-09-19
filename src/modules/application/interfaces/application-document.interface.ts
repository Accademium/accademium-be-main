import { ApplicationKey } from "./application.interface";

export interface ApplicationDocument extends DocumentKey{
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

export interface DocumentKey{
    documentId: string;
}