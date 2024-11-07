import { ApplicationStatus } from "src/utils/enums/application-status.enum";
import { ApplicationDocumentDto } from "../document-dtos/document.dto";
import { ProgramUniversityLocation } from "src/utils/interfaces/program-university-location.inteface";
import { Expose, Transform, Type } from 'class-transformer';

export class ApplicationDto {
    @Expose()
    applicationId: string;

    @Expose()
    status: ApplicationStatus;

    @Expose()
    @Transform(({ obj }) => obj.program.program_id)
    programId: string;

    @Expose()
    @Transform(({ obj }) => obj.program.programName)
    programName: string;

    @Expose()
    universityName: string;

    @Expose()
    @Transform(({ obj }) => ({
        city: obj.program.city,
        country: obj.program.country
    }))
    location: ProgramUniversityLocation;

    @Expose()
    submissionDate?: Date;

    @Expose()
    mentorId?: string;

    @Expose()
    notes?: string;

    @Expose()
    @Transform(({ obj }) => obj.updatedAt)
    lastUpdatedDate: Date;
}

export class ApplicationAggregatedDto extends ApplicationDto {
    @Transform(({ obj }) => obj.applicationDocuments)
    @Expose()
    @Type(() => ApplicationDocumentDto)
    documents: ApplicationDocumentDto[];
}