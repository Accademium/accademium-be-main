import { Body, Controller, Get, Param,Post,Put } from '@nestjs/common';
import { ApplicationService } from '../services/application.service';
import { Application } from '../interfaces/application.interface';
import { ApplicationKey, UserKey } from 'src/utils/interfaces/keys';

@Controller('api/v1/applications/')
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService
  ) {}

  @Get('user/:userId')
  async getAllApplicationsForUser(
    @Param('userId') userId: UserKey
  ): Promise<Application[]> {
    return this.applicationService.getAllApplicationsForUser(userId);
  }

  @Get('user/:userId/:applicationId')
  async getApplicationForUser(
    @Param('userId') userId: UserKey,
    @Param('applicationId') applicationId: ApplicationKey
  ): Promise<Application> {
    return this.applicationService.getApplicationForUser(userId, applicationId);
  }

  @Put('user/:userId/:applicationId/status')
  async updateApplicationStatus(
    @Param('userId') userId: UserKey,
    @Param('applicationId') applicationId: ApplicationKey,
    @Body('status') status: string
  ): Promise<Application> {
    return this.applicationService.updateApplicationStatus(userId, applicationId, status);
  }

  @Post('user/:userId')
  async createApplication(
    @Param('userId') userId: UserKey,
    @Body() applicationData: Omit<Application, 'userId' | 'applicationId' | 'creationDate' | 'lastUpdatedDate'>
  ): Promise<Application> {
    return this.applicationService.createApplication(userId, applicationData);
  }
}
