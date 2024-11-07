import { ProgramMetadata } from "src/modules/programs/entities/program-metadata.entity";
import { User } from "src/modules/user/entities/user.entity";
import { ApplicationStatus } from "src/utils/enums/application-status.enum";

export class CreateApplicationDto {
    program: ProgramMetadata;
    user: User;
    status: ApplicationStatus;
    universityName: string;
    notes?: string;
}