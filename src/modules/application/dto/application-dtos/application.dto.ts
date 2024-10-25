import { DocumentDto } from "../document-dtos/document.dto";

export class ApplicationDto {
    applicationId: string;
    applicationName: string;
    userId: string;
    status: string;
    universityId?: string;
    universityName?: string;
    submissionDate?: Date;
    mentorId?: string;
    adminId?: string;
    notes?: string;
    documents?: DocumentDto[];
    creationDate: Date;
    lastUpdatedDate: Date;
}