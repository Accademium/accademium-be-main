import { Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApplicationService } from '../services/application.service';
import { ApplicationStatus } from 'src/utils/enums/application-status.enum';
import { ApplicationDto } from '../dto/application-dtos/application.dto';

@Controller('api/v1/applications/')
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService
  ) {}

  @Get(':userId')
  async findAllApplicationsForUser(
    @Param('userId') userId: string,
  ): Promise<ApplicationDto[]> {
    return this.applicationService.findAllApplicationsForUser(userId);
  }

  @Get(':userId/:applicationId')
  async findApplicationForUser(
    @Param('userId') userId: string,
    @Param('applicationId') applicationId: string,
  ): Promise<ApplicationDto> {
    return this.applicationService.findAggregatedApplicationForUser(applicationId);
  }

  @Put(':userId/:applicationId/:status')
  async updateApplicationStatus(
    @Param('userId') userId: string,
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
    return this.applicationService.createApplication(userId, programId);
  }
}
