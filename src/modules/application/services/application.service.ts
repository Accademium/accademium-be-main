import { Injectable, NotFoundException } from '@nestjs/common';
import { ApplicationRepository } from '../repositories/application.repository';
import { Application } from '../interfaces/application.interface';
import { v4 as uuidv4 } from 'uuid';
import { ApplicationKey, UserKey } from 'src/utils/interfaces/keys';

@Injectable()
export class ApplicationService {
  constructor(
    private readonly applicationRepository: ApplicationRepository
  ) {}

  /**
   * Get all applications for a user
   * @param userId - The ID of the user
   * @returns Promise<Application[]> - A list of applications
   */
  async getAllApplicationsForUser(
    userId: UserKey
  ): Promise<Application[]> {
    return this.applicationRepository.findAllByUserId(userId);
  }

  /**
   * Get a specific application for a user
   * @param userId - The ID of the user
   * @param applicationId - The ID of the application
   * @returns Promise<Application> - The application
   * @throws NotFoundException if the application is not found
   */
  async getApplicationForUser(
    userId: UserKey, 
    applicationId: ApplicationKey
  ): Promise<Application> {
    const application = await this.applicationRepository.findByUserIdAndApplicationId(userId, applicationId);
    if (!application) {
      throw new NotFoundException(`Application with ID ${applicationId} not found for user ${userId}`);
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
    userId: UserKey, 
    applicationId: ApplicationKey, 
    status: string
  ): Promise<Application> {
    return this.applicationRepository.updateStatus(applicationId, null);
  }

  /**
   * Create a new application for a user
   * @param userId - The ID of the user
   * @param applicationData - The application data
   * @returns Promise<Application> - The created application
   */
  async createApplication(
    userId: UserKey, 
    applicationData: Omit<Application, 'userId' | 'applicationId' | 'creationDate' | 'lastUpdatedDate'>
  ): Promise<Application> {
    const newApplication: Application = {
      ...applicationData,
      applicationId: uuidv4(),
      user_id: userId,
      creationDate: new Date(),
      lastUpdatedDate: new Date(),
      status: 'In Progress' //TODO replace with constant
    };
    return this.applicationRepository.save(newApplication);
  }
}