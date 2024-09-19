import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import { ApplicationDocumentService } from '../services/application-document.service';
import { ApplicationDocument, DocumentKey } from '../interfaces/application-document.interface';
import { ApplicationKey } from '../interfaces/application.interface';

@Controller('api/v1/application-documents/')
export class ApplicationDocumentController {
    constructor(private readonly applicationDocumentService: ApplicationDocumentService) {}

    @Get(':applicationId')
    async getAllDocumentsForApplication(
        @Param('applicationId') applicationId: ApplicationKey
    ): Promise<ApplicationDocument[]> {
        return this.applicationDocumentService.getAllDocumentsForApplication(applicationId);
    }

    @Get(':applicationId/:documentId')
    async getDocumentDetails(
        @Param('applicationId') applicationId: ApplicationKey,
        @Param('documentId') documentId: DocumentKey
    ): Promise<ApplicationDocument> {
        return this.applicationDocumentService.getDocumentDetails(applicationId, documentId);
    }

    @Put(':applicationId/:documentId/approval-status')
    async updateDocumentApprovalStatus(
        @Param('applicationId') applicationId: ApplicationKey,
        @Param('documentId') documentId: DocumentKey,
        @Body('approvalStatus') approvalStatus: string
    ): Promise<ApplicationDocument> {
        return this.applicationDocumentService.updateDocumentApprovalStatus(applicationId, documentId, approvalStatus);
    }
}