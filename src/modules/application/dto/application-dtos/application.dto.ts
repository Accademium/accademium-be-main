import { ApplicationStatus } from "src/utils/enums/application-status.enum";
import { DocumentDto } from "../document-dtos/document.dto";
import { ProgramUniversityLocation } from "src/utils/interfaces/program-university-location.inteface";
import { Expose, Transform, Type } from 'class-transformer';

export class ApplicationDto {
    @Expose()
    applicationId: string;

    @Expose()
    status: ApplicationStatus;

    @Expose()
    programId: string;

    @Expose()
    programName: string;

    @Expose()
    universityName: string;

    @Expose()
    @Transform(({ obj }) => ({
        city: obj.city,
        country: obj.country
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
    @Expose()
    @Type(() => DocumentDto)
    documents?: DocumentDto[];
}