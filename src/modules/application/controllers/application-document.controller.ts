import { Controller, Get, Put, Param, Body, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApplicationDocumentService } from '../services/application-document.service';
import { ApplicationDocument } from '../entities/application-document.entity';
import { DocumentApprovalStatus } from 'src/utils/enums/document-approval-status.enum';
import { ApplicationDocumentType } from 'src/utils/enums/document-type.enum';
import { UserDocumentService } from 'src/modules/user/services/user.document.service';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/v1/application-documents/')
export class ApplicationDocumentController {
  constructor(
    private readonly applicationDocumentService: ApplicationDocumentService,
    private readonly userDocumentService: UserDocumentService,
  ) {}

  @Get(':applicationId')
  async getAllDocumentsForApplication(
    @Param('applicationId') applicationId: string,
  ): Promise<ApplicationDocument[]> {
    return this.applicationDocumentService.findAllDocumentsForApplication(
      applicationId,
    );
  }

  @Get(':documentId')
  async getDocumentDetails(
    @Param('documentId') documentId: string,
  ): Promise<ApplicationDocument> {
    return this.applicationDocumentService.findDocumentDetails(
      documentId,
    );
  }

  @Put(':documentId/:approval-status')
  async updateDocumentApprovalStatus(
    @Param('documentId') documentId: string,
    @Param('approval-status') approvalStatus: DocumentApprovalStatus,
  ): Promise<ApplicationDocument> {
    return this.applicationDocumentService.updateApplicationDocumentApprovalStatus(
      documentId,
      approvalStatus,
      "approverid"
    );
  }

  @Post(':userId/:applicationDocumentId/:documentType')
  @UseInterceptors(FileInterceptor('file'))
  async uploadApplicationDocument(
    @Param('applicationDocumentId') applicationDocumentId: string,
    @Param('documentType') documentType: ApplicationDocumentType,
    @Param('userId') userId: string, // TODO ini the future move as decorator retrived from jwt token (eg @User('userId') userId: string)
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> { // TODO return DTO
    const userDocument = await this.userDocumentService.createUserDocument(
      userId,
      documentType,
      file,
    );

    this.applicationDocumentService.assignUserDocumentToApplicationDocument(
      applicationDocumentId,
      userDocument,
    );
  }

  @Post(':applicationId/assign-document')
  async assignDocumentToApplication(
    @Param('applicationId') applicationId: string,
    @Body('userDocumentId') userDocumentId: string,
  ): Promise<void> { // TODO return DTO
    const userDocument = await this.userDocumentService.findById(userDocumentId);

    return await this.applicationDocumentService.assignUserDocumentToApplicationDocument(
      applicationId,
      userDocument,
    );
  }
}
