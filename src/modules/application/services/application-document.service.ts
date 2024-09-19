import { Injectable, NotFoundException } from '@nestjs/common';
import { ApplicationDocumentRepository } from '../repositories/application-document.repository.ts';
import { ApplicationDocument } from '../interfaces/application-document.interface';
import { v4 as uuidv4 } from 'uuid';
import { ApplicationKey, DocumentKey } from 'src/utils/interfaces/keys.js';

@Injectable()
export class ApplicationDocumentService {
    constructor(private readonly applicationDocumentRepository: ApplicationDocumentRepository) {}

  /**
   * Get all documents for an application
   * @param applicationId - The ID of the application
   * @returns Promise<ApplicationDocument[]> - A list of application documents
   */
  async getAllDocumentsForApplication(
    applicationId: ApplicationKey
  ): Promise<ApplicationDocument[]> {
    return this.applicationDocumentRepository.findAllByApplicationId(applicationId);
  }

  /**
   * Get details of a specific document
   * @param applicationId - The ID of the application
   * @param documentId - The ID of the document
   * @returns Promise<ApplicationDocument> - The document details
   * @throws NotFoundException if the document is not found
   */
  async getDocumentDetails(
    applicationId: ApplicationKey, 
    documentId: DocumentKey
  ): Promise<ApplicationDocument> {
    return this.applicationDocumentRepository.findByDocumentId(applicationId, documentId);
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
    applicationId: ApplicationKey, 
    documentId: DocumentKey, 
    approvalStatus: string
  ): Promise<ApplicationDocument> {
    return this.applicationDocumentRepository.updateApprovalStatus(applicationId, documentId, approvalStatus);
  }

  async createApplicationDocument(
    applicationId: ApplicationKey, 
    documentData: Omit<ApplicationDocument, 'documentId' | 'applicationId' | 'uploadDate'>
  ): Promise<ApplicationDocument> {
    const newDocument: ApplicationDocument = {
      ...documentData,
      document_id: uuidv4(),
      applicationId,
      uploadDate: new Date(),
    };
    return this.applicationDocumentRepository.save(newDocument);
  }
}