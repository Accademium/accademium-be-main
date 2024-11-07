import { Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApplicationService } from '../services/application.service';
import { ApplicationStatus } from 'src/utils/enums/application-status.enum';
import { ApplicationAggregatedDto, ApplicationDto } from '../dto/application-dtos/application.dto';

@Controller('api/v1/applications/')
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService
  ) {}

  @Get(':userId/all')
  async findAllApplicationsForUser(
    @Param('userId') userId: string,
  ): Promise<ApplicationAggregatedDto[]> {
    return await this.applicationService.findUserApplications(userId);
  }

  @Get(':applicationId')
  async findApplicationForUser(
    @Param('applicationId') applicationId: string,
  ): Promise<ApplicationDto> {
    return this.applicationService.findAggregatedApplication(applicationId);
  }

  @Put(':userId/:applicationId/:status')
  async updateApplicationStatus(
    @Param('applicationId') applicationId: string,
    @Param('status') status: ApplicationStatus,
  ): Promise<ApplicationDto> {
    return this.applicationService.updateApplicationStatus(
      applicationId,
      status,
    );
  }

  @Post(':userId/:programId')
  async createApplication(
    @Param('userId') userId: string,
    @Param('programId') programId: string,
  ): Promise<ApplicationDto> {
    return this.applicationService.createApplication(
      userId, 
      programId
    );
  }
}
