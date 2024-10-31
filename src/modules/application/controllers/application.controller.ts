import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApplicationService } from '../services/application.service';
import { ApplicationStatus } from 'src/utils/enums/application-status.enum';
import { CreateApplicationDto } from '../dto/application-dtos/create-application.dto';
import { ApplicationDto } from '../dto/application-dtos/application.dto';

@Controller('api/v1/applications/')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Get(':userId')
  async getAllApplicationsForUser(
    @Param('userId') userId: string,
  ): Promise<ApplicationDto[]> {
    return this.applicationService.getAllApplicationsForUser(userId);
  }

  @Get(':userId/:applicationId')
  async getApplicationForUser(
    @Param('userId') userId: string,
    @Param('applicationId') applicationId: string,
  ): Promise<ApplicationDto> {
    return this.applicationService.getAggregatedApplicationForUser(applicationId);
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

  @Post(':userId')
  async createApplication(
    @Param('userId') userId: string,
    @Body() applicationData: CreateApplicationDto,
  ): Promise<ApplicationDto> {
    return this.applicationService.createApplication(userId, applicationData);
  }
}
