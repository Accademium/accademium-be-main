import { ApplicationStatus } from "src/utils/enums/application-status.enum";

export class CreateApplicationDto {
    programId: string;
    userId: string;
    programName: string;
    universityName: string;
    city: string;
    country: string;
    status: ApplicationStatus;
    notes?: string;
}