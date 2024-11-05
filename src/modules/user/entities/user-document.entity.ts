import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { ApplicationDocumentType } from "../../../utils/enums/document-type.enum";
import { ApplicationDocument } from "../../application/entities/application-document.entity";

@Entity('userDocuments')
export class UserDocument {
  @PrimaryGeneratedColumn('uuid')
  userDocumentId: string;

  @Column()
  documentType: ApplicationDocumentType;

  @Column()
  s3Key: string;

  @Column()
  fileName: string;

  @Column()
  fileSize: number;

  @Column()
  mimeType: string;

  @Column({ default: 1 })
  version: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.userDocuments)
  user: User;

  @OneToMany(
    () => ApplicationDocument, applicationDocument => applicationDocument.userDocument, 
    { nullable: true })
  applicationDocuments: ApplicationDocument[];
}