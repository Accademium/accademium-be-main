import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ApplicationRepository } from '../repositories/application.repository';
import { v4 as uuidv4 } from 'uuid';
import { ApplicationKey, UserKey } from 'src/utils/interfaces/keys';
import { Application } from '../entities/application.entity';
import { ApplicationStatus, ApplicationStatusGroup, STATUS_GROUPS } from 'src/utils/enums/application-status.enum';
import { CreateApplicationDto } from '../dto/application-dtos/create-application.dto';

@Injectable()
export class ApplicationService {
  constructor(private readonly applicationRepository: ApplicationRepository) {}

  /**
   * Get all applications for a user
   * @param userId - The ID of the user
   * @returns Promise<Application[]> - A list of applications
   */
  async getAllApplicationsForUser(
    userId: string
  ): Promise<Application[]> {
    const applications = await this.applicationRepository.findByUserId(userId);
    if (!applications.length) {
      throw new NotFoundException(`No applications found for user ${userId}`);
    }
    return applications;
  }

  /**
   * Get a specific application for a user
   * @param userId - The ID of the user
   * @param applicationId - The ID of the application
   * @returns Promise<Application> - The application
   * @throws NotFoundException if the application is not found
   */
  async getApplicationForUser(
    userId: string,
    applicationId: string,
  ): Promise<Application> {
    const application = await this.applicationRepository.findByApplicationId(
      applicationId,
    );
    if (!application) {
      throw new NotFoundException(
        `Application ${applicationId} not found for user ${userId}`,
      );
    }
    return application;
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
    userId: string,
    applicationId: string,
    status: ApplicationStatus,
  ): Promise<Application> {
    const application = await this.getApplicationForUser(userId, applicationId);
    
    // Validate status transition
    if (!this.isValidAdminStatusTransition(application.status, status)) {
      throw new BadRequestException(
        `Invalid status transition from ${application.status} to ${status}`,
      );
    }

    return this.applicationRepository.updateStatus(applicationId, status);
  }

  /**
   * Create a new application for a user
   * @param userId - The ID of the user
   * @param applicationData - The application data
   * @returns Promise<Application> - The created application
   */
  async createApplication(
    userId: string,
    applicationData: Partial<CreateApplicationDto>,
  ): Promise<Application> {
    return this.applicationRepository.create(userId, applicationData);
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
  ): Promise<Application> {
    const application = await this.applicationRepository.findByApplicationId(
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

    // Update admin ID for admin actions
    if (this.statusRequiresAdmin(newStatus)) {
      await this.applicationRepository.update(applicationId, { 
        adminId,
        status: newStatus,
        ...(newStatus === ApplicationStatus.SENT_TO_UNIVERSITY && {
          submissionDate: new Date()
        })
      });
    }

    return this.applicationRepository.updateStatus(applicationId, newStatus);
  }

  /**
   * Handles university-specific status updates
   * @param applicationId 
   * @param newStatus 
   * @param notes 
   * @returns 
   */
  async updateUniversityStatus(
    applicationId: ApplicationKey,
    newStatus: ApplicationStatus,
    notes?: string,
  ): Promise<Application> {
    const application = await this.applicationRepository.findByApplicationId(applicationId);
    
    if (!application) {
      throw new NotFoundException(`Application ${applicationId} not found`);
    }

    if (!this.isValidUniversityStatusTransition(application.status, newStatus)) {
      throw new BadRequestException(
        `Invalid university status transition from ${application.status} to ${newStatus}`,
      );
    }

    return this.applicationRepository.update(applicationId, {
      status: newStatus,
      notes: notes ? `${application.notes ? application.notes + '\n' : ''}${notes}` : application.notes
    });
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

  private statusRequiresAdmin(status: ApplicationStatus): boolean {
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
  getStatusGroup(status: ApplicationStatus): ApplicationStatusGroup {
    return Object.entries(STATUS_GROUPS).find(([_, statuses]) => 
      statuses.includes(status)
    )?.[0] as ApplicationStatusGroup;
  }
}
