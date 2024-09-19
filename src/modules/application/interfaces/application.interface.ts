export interface Application extends ApplicationKey{
    userId: string;
    status: string;
    creationDate: Date;
    lastUpdatedDate: Date;
    universityId: string;
    universityName: string;
    submissionDate?: Date;
    mentorId?: string;
    adminId?: string;
    notes?: string;
    requiredDocuments: string[];
}

export interface ApplicationKey {
    applicationId: string;
}