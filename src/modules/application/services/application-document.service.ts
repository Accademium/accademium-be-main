import { Injectable } from '@nestjs/common';
import { ApplicationDocumentRepository } from '../repositories/application-document.repository.ts.js';
import { ApplicationDocument } from '../entities/application-document.entity.js';
import { DocumentApprovalStatus } from 'src/utils/enums/document-approval-status.enum.js';
import { ApplicationRepository } from '../repositories/application.repository.js';

@Injectable()
export class ApplicationDocumentService {
  constructor(
    private readonly applicationDocumentRepository: ApplicationDocumentRepository,
    private readonly applicationRepository: ApplicationRepository,
  ) {}

  /**
   * Get all documents for an application
   * @param applicationId - The ID of the application
   * @returns Promise<ApplicationDocument[]> - A list of application documents
   */
  async getAllDocumentsForApplication(
    applicationId: string,
  ): Promise<ApplicationDocument[]> {
    return this.applicationDocumentRepository.findAllByApplicationId(
      applicationId,
    );
  }

  /**
   * Get details of a specific document
   * @param documentId - The ID of the document
   * @returns Promise<ApplicationDocument> - The document details
   * @throws NotFoundException if the document is not found
   */
  async getDocumentDetails(
    documentId: string,
  ): Promise<ApplicationDocument> {
    return this.applicationDocumentRepository.findByDocumentId(
      documentId,
    );
  }

  /**
   * Update the approval status of a document
   * @param applicationId - The ID of the application
   * @param documentId - The ID of the document
   * @param approvalStatus - The new approval status
   * @returns Promise<ApplicationDocument> - The updated document
   * @throws NotFoundException if the document is not found
   */
  async updateDocumentApprovalStatus(
    documentId: string,
    approvalStatus: DocumentApprovalStatus,
    approvedBy?: string,
    rejectionReason?: string,
  ): Promise<ApplicationDocument> {
    return this.applicationDocumentRepository.updateApprovalStatus(
      documentId,
      approvalStatus,
      approvedBy,
      rejectionReason
    );
  }

  async createApplicationDocument(
    applicationId: string,
    documentData: Omit<
      ApplicationDocument,
      'documentId' | 'applicationId' | 'uploadDate'
    >,
  ): Promise<ApplicationDocument> {
    return this.applicationDocumentRepository.save(applicationId, documentData);
  }
}
