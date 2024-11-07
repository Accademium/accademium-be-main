import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { UserDocumentRepository } from "../repositories/user.document.repository";
import { UserDocument } from "../entities/user-document.entity";
import { ApplicationDocumentType } from "src/utils/enums/document-type.enum";
import { S3Service } from "src/aws/s3/s3.service";

@Injectable()
export class UserDocumentService {
    private readonly SERVICE_NAME = 'UserDocumentService';
    private readonly logger = new Logger(UserDocumentService.name);

    constructor(
        private readonly repository: UserDocumentRepository,
        private readonly s3Service: S3Service,
    ) {}

    /**
     * 
     * @param id 
     * @returns 
     */
    async findById(
        id: string
    ): Promise<UserDocument> {
        const userDocument = await this.repository.findById(id);
        if (!userDocument) {
            throw new NotFoundException(`UserDocument with ID ${id} not found`);
        }
        return userDocument;
    }

    /**
     * 
     * @param userId 
     * @param documentType 
     * @param file 
     * @returns 
     */
    async createUserDocument(
        userId: string, 
        documentType: ApplicationDocumentType, 
        file: Express.Multer.File
    ): Promise<UserDocument> {
        const { originalname: fileName, mimetype, buffer, size: fileSize } = file;
        const key = `${userId}/${Date.now()}_${fileName}`;

        const s3Key = await this.s3Service.uploadFile(
          buffer,
          key,
          mimetype,
          userId,
          "1111111",
        );

        return await this.repository.createUserDocument({
          userId,
          documentType,
          fileName,
          s3Key,
          fileSize,
          mimeType: mimetype,
        });
    }
}