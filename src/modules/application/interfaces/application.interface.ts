import { ApplicationKey, UserKey } from "src/utils/interfaces/keys";

export interface Application extends ApplicationKey {
    user_id: UserKey;
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