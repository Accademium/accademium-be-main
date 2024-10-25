import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import { ApplicationDocumentService } from '../services/application-document.service';
import { ApplicationDocument } from '../entities/application-document.entity';
import { DocumentApprovalStatus } from 'src/utils/enums/document-approval-status.enum';

@Controller('api/v1/application-documents/')
export class ApplicationDocumentController {
  constructor(
    private readonly applicationDocumentService: ApplicationDocumentService,
  ) {}

  @Get(':applicationId')
  async getAllDocumentsForApplication(
    @Param('applicationId') applicationId: string,
  ): Promise<ApplicationDocument[]> {
    return this.applicationDocumentService.getAllDocumentsForApplication(
      applicationId,
    );
  }

  @Get(':documentId')
  async getDocumentDetails(
    @Param('documentId') documentId: string,
  ): Promise<ApplicationDocument> {
    return this.applicationDocumentService.getDocumentDetails(
      documentId,
    );
  }

  @Put(':documentId/:approval-status')
  async updateDocumentApprovalStatus(
    @Param('documentId') documentId: string,
    @Param('approval-status') approvalStatus: DocumentApprovalStatus,
  ): Promise<ApplicationDocument> {
    return this.applicationDocumentService.updateDocumentApprovalStatus(
      documentId,
      approvalStatus,
      "approverid"
    );
  }
}
