import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ApplicationRepository } from '../repositories/application.repository';
import { ApplicationStatus, ApplicationStatusGroup, STATUS_GROUPS } from 'src/utils/enums/application-status.enum';
import { ApplicationAggregatedDto, ApplicationDto } from '../dto/application-dtos/application.dto';
import { ApplicationMapper } from '../mappers/application.mapper';
import { ApplicationAggregatedMapper } from '../mappers/application-aggregated.mapper';
import { ProgramMetadataService } from 'src/modules/programs/services/program-metadata.service';
import { CreateApplicationDto } from '../dto/application-dtos/create-application.dto';
import { ApplicationDocumentService } from './application-document.service';

@Injectable()
export class ApplicationService {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly applicationMapper: ApplicationMapper,
    private readonly applicationAggregatedMapper: ApplicationAggregatedMapper,
    private readonly programMetadataService: ProgramMetadataService,
    private readonly applicationDocumentService: ApplicationDocumentService
  ) {}

  /**
   * Get all applications for a user
   * @param userId - The ID of the user
   * @returns Promise<ApplicationDto[]> - A list of applications
   */
  async findAllApplicationsForUser(
    userId: string
  ): Promise<ApplicationDto[]> {
    const applications = await this.applicationRepository.findAllApllicationsByUserId(userId);
    if (!applications.length) {
      throw new NotFoundException(`No applications found for user ${userId}`);
    }
    return this.applicationMapper.toDtoArray(applications);
  }

  /**
   * Get a specific application for a user
   * @param applicationId - The ID of the application
   * @returns Promise<ApplicationAggregatedDto> - The application
   * @throws NotFoundException if the application is not found
   */
  async findAggregatedApplicationForUser(
    applicationId: string,
  ): Promise<ApplicationAggregatedDto> {
    const application = await this.applicationRepository.findApplicationById(
      applicationId,
    );
    if (!application) {
      throw new NotFoundException(
        `Application ${applicationId} not found`,
      );
    }
    return this.applicationAggregatedMapper.toDto(application);
  }

  /**
   * Update the status of an application
   * @param userId - The ID of the user
   * @param applicationId - The ID of the application
   * @param status - The new status
   * @returns Promise<Application> - The updated application
   * @throws NotFoundException if the application is not found
   */
  async updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus,
  ): Promise<ApplicationDto> {
    const application = await this.findAggregatedApplicationForUser(applicationId);
    
    // Validate status transition
    if (!this.isValidAdminStatusTransition(application.status, status)) {
      throw new BadRequestException(
        `Invalid status transition from ${application.status} to ${status}`,
      );
    }

    const updatedApplciation = await this.applicationRepository.updateApplicationStatus(applicationId, status);
    
    return this.applicationMapper.toDto(updatedApplciation);
  }

  /**
   * Create a new application for a user
   * @param userId - The ID of the user
   * @param programId - The program id
   * @returns Promise<Application> - The created application
   */
  async createApplication(
    userId: string,
    programId: string,
  ): Promise<ApplicationDto> {
    const program = await this.programMetadataService.findProgramMetadata(programId);
    // TODO add country as university property and enum
    const country = 'NE';
    const application = await this.applicationRepository.createApplication({
      userId,
      programId,
      programName: program.program_title,
      universityName: program.university.university,
      city: program.city,
      country: 'NE',
      status: ApplicationStatus.CREATED,
      notes: '',
    });

    this.applicationDocumentService.createDefaultApplicationDocument(application.applicationId, country);

    return this.applicationMapper.toDto(application);
  }

  /**
   * 
   * @param applicationId 
   * @param newStatus 
   * @param adminId 
   * @returns 
   */
  async updateApplicationStatusAdmin(
    applicationId: string,
    newStatus: ApplicationStatus,
    adminId: string,
  ): Promise<ApplicationDto> {
    const application = await this.applicationRepository.findApplicationById(
      applicationId,
    );
    
    if (!application) {
      throw new NotFoundException(`Application ${applicationId} not found`);
    }

    if (!this.isValidAdminStatusTransition(application.status, newStatus)) {
      throw new BadRequestException(
        `Invalid admin status transition from ${application.status} to ${newStatus}`,
      );
    }

    const updatedApplication = await this.applicationRepository.updateApplicationStatus(applicationId, newStatus);
    return this.applicationMapper.toDto(updatedApplication);
  }

  /**
   * Handles university-specific status updates
   * @param applicationId 
   * @param newStatus 
   * @param notes 
   * @returns 
   */
  async updateUniversityStatus(
    applicationId: string,
    newStatus: ApplicationStatus,
    notes?: string,
  ): Promise<ApplicationDto> {
    const application = await this.applicationRepository.findApplicationById(applicationId);
    
    if (!application) {
      throw new NotFoundException(`Application ${applicationId} not found`);
    }

    if (!this.isValidUniversityStatusTransition(application.status, newStatus)) {
      throw new BadRequestException(
        `Invalid university status transition from ${application.status} to ${newStatus}`,
      );
    }

    const updatedApplication = await this.applicationRepository.updateApplication(applicationId, {
      status: newStatus,
      notes: notes ? `${application.notes ? application.notes + '\n' : ''}${notes}` : application.notes
    });

    return this.applicationMapper.toDto(updatedApplication);
  }

  private isValidAdminStatusTransition(
    currentStatus: ApplicationStatus,
    newStatus: ApplicationStatus,
  ): boolean {
    const allowedTransitions = {
      [ApplicationStatus.SUBMITTED]: [
        ApplicationStatus.UNDER_REVIEW,
        ApplicationStatus.REJECTED,
      ],
      [ApplicationStatus.UNDER_REVIEW]: [
        ApplicationStatus.DOCUMENTS_APPROVED,
        ApplicationStatus.REJECTED,
        ApplicationStatus.NEEDS_REVISION,
      ],
      [ApplicationStatus.DOCUMENTS_APPROVED]: [
        ApplicationStatus.SENT_TO_UNIVERSITY,
      ],
      [ApplicationStatus.SENT_TO_UNIVERSITY]: [
        ApplicationStatus.UNIVERSITY_REVIEWING,
      ],
      [ApplicationStatus.UNIVERSITY_NEEDS_INFO]: [
        ApplicationStatus.UNDER_REVIEW,
      ],
    };

    return allowedTransitions[currentStatus]?.includes(newStatus) ?? false;
  }

  /**
   * Checks university-specific status updates
   * @param currentStatus 
   * @param newStatus 
   * @returns 
   */
  private isValidUniversityStatusTransition(
    currentStatus: ApplicationStatus,
    newStatus: ApplicationStatus,
  ): boolean {
    const allowedTransitions = {
      [ApplicationStatus.UNIVERSITY_REVIEWING]: [
        ApplicationStatus.UNIVERSITY_APPROVED,
        ApplicationStatus.UNIVERSITY_REJECTED,
        ApplicationStatus.UNIVERSITY_NEEDS_INFO,
      ],
    };

    return allowedTransitions[currentStatus]?.includes(newStatus) ?? false;
  }

  private statusRequiresAdmin(
    status: ApplicationStatus
  ): boolean {
    return [
      ApplicationStatus.UNDER_REVIEW,
      ApplicationStatus.DOCUMENTS_APPROVED,
      ApplicationStatus.SENT_TO_UNIVERSITY,
      ApplicationStatus.REJECTED,
      ApplicationStatus.NEEDS_REVISION,
    ].includes(status);
  }

  /**
   * Helper to determine the current stage of the application
   * @param status 
   * @returns 
   */
  private findStatusGroup(
    status: ApplicationStatus
  ): ApplicationStatusGroup {
    return Object.entries(STATUS_GROUPS).find(([_, statuses]) => 
      statuses.includes(status)
    )?.[0] as ApplicationStatusGroup;
  }
}
