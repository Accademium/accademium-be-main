import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationDocument } from '../entities/application-document.entity';
import { CreateApplicationDocumentDto } from '../dto/application-dtos/create-application-document.dto';
import { UpdateApplicationDocumentDto } from '../dto/application-dtos/update-application-document.dto';

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
   * @returns Promise<ApplicationDocument> - The document or null if not found
   */
    async findByDocumentId(
      documentId: string,
    ): Promise<ApplicationDocument> {
      return this.repository.findOne({
        where: { applicationDocumentId: documentId },
        relations: ['application', 'user'],
      });
    }

  /**
   * TODO
   * @param applicationId 
   * @param documentData 
   * @returns 
   */
  async createApplicationDocument(
    documentData: CreateApplicationDocumentDto
  ): Promise<ApplicationDocument> {
    const document = this.repository.create(documentData);
    return this.repository.save(document);
  }

  /**
   * TODO
   * @param applicationDocumentId 
   * @param applicationData 
   * @returns 
   */
  async updateApplicationDocument(
    applicationDocumentId: string, 
    applicationData: UpdateApplicationDocumentDto
  ) {
    const applicationDocument: ApplicationDocument = await this.findByDocumentId(applicationDocumentId);

    if (!applicationDocument) {
      throw new NotFoundException(`Application document with ID ${applicationDocumentId} not found.`);
    }
  
    Object.assign(applicationDocument, applicationData);
  
    return await this.repository.save(applicationDocument);
  }
}
