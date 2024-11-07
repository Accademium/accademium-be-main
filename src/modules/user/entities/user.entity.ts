import { Application } from "../../application/entities/application.entity";
import { Entity, Column, CreateDateColumn, UpdateDateColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { UserDocument } from "./user-document.entity";
import { RefreshToken } from "../../../authentication/entities/user-refresh-token.entity";

@Entity('users')
export class User {
  @PrimaryColumn('varchar', { length: 36 })
  userId: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  nationality: string;

  @Column({ type: 'jsonb', nullable: true })
  languageSkills: Record<string, string>;

  @Column({ nullable: true })
  currentEducationLevel: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date;

  @OneToMany(() => UserDocument, userDocument => userDocument.user)
  userDocuments: UserDocument[];

  @OneToMany(() => Application, app => app.user)
  applications: Application[];

  @OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
  refreshTokens: RefreshToken[];
}