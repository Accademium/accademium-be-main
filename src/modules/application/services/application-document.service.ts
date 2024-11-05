import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ApplicationDocumentRepository } from '../repositories/application-document.repository.ts.js';
import { ApplicationDocument } from '../entities/application-document.entity.js';
import { DocumentApprovalStatus } from '../../../utils/enums/document-approval-status.enum.js';
import { ApplicationDocumentType } from '../../../utils/enums/document-type.enum.js';
import { CreateApplicationDocumentDto } from '../dto/application-dtos/create-application-document.dto.js';
import { UserDocument } from '../../user/entities/user-document.entity.js';
import { UpdateApplicationDocumentDto } from '../dto/application-dtos/update-application-document.dto.js';

@Injectable()
export class ApplicationDocumentService {
  private readonly SERVICE_NAME = 'ProgramCoreService';
  private readonly logger = new Logger(ApplicationDocumentService.name);

  constructor(
    private readonly applicationDocumentRepository: ApplicationDocumentRepository,
  ) {}

  /**
   * Get all documents for an application
   * @param applicationId - The ID of the application
   * @returns Promise<ApplicationDocument[]> - A list of application documents
   */
  async findAllDocumentsForApplication(
    applicationId: string,
  ): Promise<ApplicationDocument[]> {
    return this.applicationDocumentRepository.findAllByApplicationId(applicationId);
  }

  /**
   * Get details of a specific document
   * @param documentId - The ID of the document
   * @returns {@link ApplicationDocument} - The document details
   * @throws {@link NotFoundException} if the document is not found
   */
  async findDocumentDetails(
    documentId: string,
  ): Promise<ApplicationDocument> {
    const document = this.applicationDocumentRepository.findByDocumentId(documentId);

    if (!document) {
      throw new Error('Document not found');
    } 
    return document;
  }

  /**
   * Update the approval status of a document
   * @param applicationDocumentId - The ID of the {@link ApplicationDocument}
   * @param approvalStatus - The new approval status
   * @param approvedBy - Optional parameter to set the user, who approved the document
   * @param rejectionReason - Optional parameter to set the reason of the rejection
   * @returns {@link ApplicationDocument} - The updated document
   * @throws {@link NotFoundException} if the document is not found
   * @throws {@link BadRequestException} if there is no approver but the {@link DocumentApprovalStatus} is set to APPROVED
   * @throws {@link BadRequestException} if there is no rejection reason but the {@link DocumentApprovalStatus} is set to REJECTED
   */
  async updateApplicationDocumentApprovalStatus(
    applicationDocumentId: string,
    approvalStatus: DocumentApprovalStatus,
    approvedBy?: string,
    rejectionReason?: string,
  ): Promise<ApplicationDocument> {
    const applicationDocumentDto = new UpdateApplicationDocumentDto();
    
    applicationDocumentDto.approvalStatus = approvalStatus;
  
    if (approvalStatus === DocumentApprovalStatus.APPROVED) {
      if (!approvedBy) {
        throw new BadRequestException('ApprovedBy is required for approved documents.');
      }
      applicationDocumentDto.approvedBy = approvedBy;
      applicationDocumentDto.approvalDate = new Date();
  
    } else if (approvalStatus === DocumentApprovalStatus.REJECTED) {
      if (!rejectionReason) {
        throw new BadRequestException('Rejection reason is required for rejected documents.');
      }
      applicationDocumentDto.rejectionReason = rejectionReason;
    }
  
    return await this.applicationDocumentRepository.updateApplicationDocument(applicationDocumentId, applicationDocumentDto);
  }

  /**
   * Creates a new application document associated with a specific application ID.
   * @param applicationId - The unique identifier of the application to associate with the document.
   * @param documentData - The data for the document, excluding 'documentId', 'applicationId', and 'uploadDate', which will be generated or assigned automatically.
   * @returns The created application document.
   */
  async createApplicationDocument(
    documentData: CreateApplicationDocumentDto,
  ): Promise<ApplicationDocument> {
    return this.applicationDocumentRepository.createApplicationDocument(documentData);
  }

  /**
   * 
   * @param applicationId 
   * @param country
   */
  async createDefaultApplicationDocument(
    applicationId: string, 
    country: string
  ): Promise<void> {
    if (country == 'NE') { // TODO migrato to enum (look at application.service.ts)
      this.createDefaultApplicationDocumentForNetherland(applicationId);
    } else {
      this.logger.error(`There are no defined defaut application documents for country ${country}.`)
    }
  }

  /**
   * 
   * @param applicationDocumentId 
   * @param userDocumentId 
   */
  async assignUserDocumentToApplicationDocument(
    applicationDocumentId: string, 
    userDocument: UserDocument
  ) {
    this.applicationDocumentRepository.updateApplicationDocument(applicationDocumentId, { userDocument });
  }

  /**
   * 
   * @param applicationId 
   */
  private createDefaultApplicationDocumentForNetherland(
    applicationId: string
  ): void {
    const defaultDocuments = [
      { documentType: ApplicationDocumentType.ID_OR_PASSPORT, isMandatory: true, description: "A copy of passport or ID card." },
      { documentType: ApplicationDocumentType.PASSPORT_PICTURE, isMandatory: true, description: "A passport picture." },
      { documentType: ApplicationDocumentType.MOTIVATIONAL_LETTER, isMandatory: true, description: "A personal statement in English (should contain around 500-800 words answering questions such as: Why and what would you like to study at the university? What are your plans after graduation?)." },
      { documentType: ApplicationDocumentType.HIGH_SCHOOL_CERTIFICATE, isMandatory: true, description: "Copies of obtained secondary school diplomas, certificates and/or grade lists (uploaded diplomas and/or grade lists which are not in English or Dutch need to be accompanied by an official English translation)." },
      { documentType: ApplicationDocumentType.LANGUAGE_CERTIFICATE, isMandatory: true, description: "Proof of English/Dutch language proficiency." },
      { documentType: ApplicationDocumentType.CV, isMandatory: true, description: "CV or resume." },
    ];

    for (const doc of defaultDocuments) {
      this.applicationDocumentRepository.createApplicationDocument({
        applicationId: applicationId,
        approvalStatus: DocumentApprovalStatus.NOT_UPLOADED,
        documentType: doc.documentType,
        isMandatory: doc.isMandatory,
        description: doc.description,
      });
    }
  }
}
