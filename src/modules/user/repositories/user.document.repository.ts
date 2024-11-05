import { InjectRepository } from "@nestjs/typeorm";
import { UserDocument } from "../entities/user-document.entity";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { ApplicationDocumentType } from "src/utils/enums/document-type.enum";
import { CreateUserDocumentDto } from "../dto/user-document.dto";

@Injectable()
export class UserDocumentRepository {
  constructor(
    @InjectRepository(UserDocument)
    private readonly repository: Repository<UserDocument>,
  ) {}

  /**
   * Finds a user by their unique ID.
   * @param id - The unique identifier of the {@link UserDocument}.
   * @returns The {@link UserDocument} entity if found, otherwise undefined.
   */
  async findById(id: string): Promise<UserDocument> {
    return await this.repository.findOne({
        where: { userDocumentId: id },
    });
  }

  /**
   * TODO
   * @param userDocumentData 
   * @returns 
   */
  createUserDocument(
    userDocumentData: CreateUserDocumentDto
  ): Promise<UserDocument> {
    const userDocument = this.repository.create(userDocumentData);
    return this.repository.save(userDocument);
  }
}