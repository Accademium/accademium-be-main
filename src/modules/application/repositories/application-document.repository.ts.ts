import { Injectable } from '@nestjs/common';
import { ApplicationDocument } from '../interfaces/application-document.interface';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { ApplicationKey, DocumentKey } from 'src/utils/interfaces/keys';

@Injectable()
export class ApplicationDocumentRepository {
  constructor(
    @InjectModel('ApplicationDocument')
    private applicationDocumentModel: Model<ApplicationDocument, DocumentKey>,
  ) {}

  /**
   * Find all documents for a specific application
   * @param applicationId - The ID of the application
   * @returns Promise<ApplicationDocument[]> - A list of application documents
   */
  async findAllByApplicationId(
    applicationId: ApplicationKey,
  ): Promise<ApplicationDocument[]> {
    return this.applicationDocumentModel
      .query('applicationId')
      .eq(applicationId)
      .exec();
  }

  /**
   * Find a specific document by application ID and document ID
   * @param applicationId - The ID of the application
   * @param documentId - The ID of the document
   * @returns Promise<ApplicationDocument | null> - The document or null if not found
   */
  async findByDocumentId(
    applicationId: ApplicationKey,
    documentId: DocumentKey,
  ): Promise<ApplicationDocument> {
    return null;
    // return this.applicationDocumentModel.query('applicationId').eq(applicationId).where('documentId').eq(documentId).exec();
  }

  /**
   * Update the approval status of a document
   * @param applicationId - The ID of the application
   * @param documentId - The ID of the document
   * @param approvalStatus - The new approval status
   * @returns Promise<ApplicationDocument | null> - The updated document or null if not found
   */
  async updateApprovalStatus(
    applicationId: ApplicationKey,
    documentId: DocumentKey,
    approvalStatus: string,
  ): Promise<ApplicationDocument> {
    return null;
    // return this.applicationDocumentModel.update(
    //   { applicationId, documentId },
    //   { approvalStatus, approvalDate: new Date() });
  }

  async save(document: ApplicationDocument): Promise<ApplicationDocument> {
    return this.applicationDocumentModel.create(document);
  }
}
