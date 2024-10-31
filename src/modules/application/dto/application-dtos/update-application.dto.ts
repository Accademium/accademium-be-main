import { ApplicationStatus } from "src/utils/enums/application-status.enum";

export class UpdateApplicationDto {
    status?: ApplicationStatus;
    submissionDate?: Date;
    notes?: string;
}