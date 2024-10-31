import { Injectable } from '@nestjs/common';
import { Application } from '../entities/application.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationStatus } from 'src/utils/enums/application-status.enum';
import { CreateApplicationDto } from '../dto/application-dtos/create-application.dto';
import { UpdateApplicationDto } from '../dto/application-dtos/update-application.dto';

@Injectable()
export class ApplicationRepository {
  constructor(
    @InjectRepository(Application)
    private readonly repository: Repository<Application>,
  ) {}

  /**
   * Find all applications for a specific user
   * @param userId - The ID of the user
   * @returns Promise<Application[]> - A list of applications
   */
  async findByUserId(userId: string): Promise<Application[]> {
    return this.repository.find({
      where: { user: { userId } },
      relations: ['documents', 'user'],
    });
  }

  /**
   * Find a specific application by application ID
   * @param applicationId - The ID of the application
   * @returns Promise<Application> - The application or null if not found
   */
  async findByApplicationId(
    applicationId: string,
  ): Promise<Application> {
    return this.repository.findOne({
      where: { applicationId: applicationId },
      relations: ['documents', 'user'],
    });
  }

  /**
   * Update the status of an application
   * @param applicationId - {@link string} The ID of the application
   * @param status - {@link ApplicationStatus} The new status
   * @returns Promise<Application> - The updated application or null if not found
   */
  async updateStatus(
    applicationId: string,
    status: ApplicationStatus,
  ): Promise<Application> {
    await this.repository.update(applicationId, 
      {
        status: status,
        ...(status === ApplicationStatus.SENT_TO_UNIVERSITY && 
          { submissionDate: new Date() })
        });
    return this.repository.findOne({
      where: { applicationId: applicationId },
      relations: ['documents', 'user'],
    });
  }

  
  /**
   * Update the status of an application
   * @param applicationId - {@link string} The ID of the application
   * @param applicationData - {@link UpdateApplicationDto} The new data
   * @returns Promise<Application> - The updated application or null if not found
   */
  async update(
    applicationId: string,
    applicationData: UpdateApplicationDto,
  ): Promise<Application> {
    await this.repository.update(applicationId, applicationData);
    return this.repository.findOne({
      where: { applicationId: applicationId },
      relations: ['documents', 'user'],
    });
  }

  /**
   * Create a new application
   * @param application - The application data
   * @returns Promise<Application> - The created application
   */
  async create(userId: string, applicationData: Partial<CreateApplicationDto>): Promise<Application> {
    const application = this.repository.create({
      ...applicationData,
      status: ApplicationStatus.CREATED,
      user: {userId: userId}
    });

    return this.repository.save(application);
  }
}
