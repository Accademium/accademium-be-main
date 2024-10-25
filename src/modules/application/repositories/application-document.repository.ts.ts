import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationKey, DocumentKey } from 'src/utils/interfaces/keys';
import { Repository } from 'typeorm';
import { ApplicationDocument } from '../entities/application-document.entity';
import { DocumentApprovalStatus } from 'src/utils/enums/document-approval-status.enum';

@Injectable()
export class ApplicationDocumentRepository {
  constructor(
    @InjectRepository(ApplicationDocument)
    private readonly repository: Repository<ApplicationDocument>,
  ) {}

  /**
   * Find all documents for a specific application
   * @param applicationId - The ID of the application
   * @returns Promise<ApplicationDocument[]> - A list of application documents
   */
  async findAllByApplicationId(
    applicationId: string
  ): Promise<ApplicationDocument[]> {
    return this.repository.find({
      where: { application: { applicationId: applicationId } },
      relations: ['application', 'user'],
    });
  }

  /**
   * Find a specific document by application ID and document ID
   * @param documentId - The ID of the document
   * @returns Promise<ApplicationDocument | null> - The document or null if not found
   */
    async findByDocumentId(
      documentId: string,
    ): Promise<ApplicationDocument> {
      const document = this.repository.findOne({
        where: { documentId },
        relations: ['application', 'user'],
      });
      if (!document) {
        throw new Error('Document not found');
      } 
      return document;
    }

  /**
   * Update the approval status of a document
   * @param applicationId - The ID of the application
   * @param documentId - The ID of the document
   * @param approvalStatus - The new approval status
   * @returns Promise<ApplicationDocument | null> - The updated document or null if not found
   */
  async updateApprovalStatus(
    documentId: string,
    approvalStatus: DocumentApprovalStatus,
    approvedBy?: string,
    rejectionReason?: string,
  ): Promise<ApplicationDocument> {
    const document: ApplicationDocument = await this.findByDocumentId(documentId);
    document.approvalStatus = approvalStatus;

    if (approvalStatus === DocumentApprovalStatus.APPROVED) {
      document.approvedBy = approvedBy;
      document.approvalDate = new Date();
    } else if (approvalStatus === DocumentApprovalStatus.REJECTED) {
      document.rejectionReason = rejectionReason;
    }
  
    return await this.repository.save(document);
  }

  /**
   * 
   * @param applicationId 
   * @param documentData 
   * @returns 
   */
  async save(
    applicationId: string,
    documentData: Partial<ApplicationDocument>
  ): Promise<ApplicationDocument> {
    const document = this.repository.create({
      ...documentData,
      application: {applicationId}
    });

    return this.repository.save(document);
  }
}
