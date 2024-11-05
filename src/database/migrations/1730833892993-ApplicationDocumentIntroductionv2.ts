import { MigrationInterface, QueryRunner } from "typeorm";

export class ApplicationDocumentIntroductionv21730833892993 implements MigrationInterface {
    name = 'ApplicationDocumentIntroductionv21730833892993'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "userDocuments" ("userDocumentId" uuid NOT NULL DEFAULT uuid_generate_v4(), "documentType" character varying NOT NULL, "s3Key" character varying NOT NULL, "fileName" character varying NOT NULL, "fileSize" integer NOT NULL, "mimeType" character varying NOT NULL, "version" integer NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userUserId" character varying(36), CONSTRAINT "PK_cb27077aae293cf5333836a9f3e" PRIMARY KEY ("userDocumentId"))`);
        await queryRunner.query(`CREATE TABLE "applicationDocuments" ("applicationDocumentId" uuid NOT NULL DEFAULT uuid_generate_v4(), "approvalStatus" character varying NOT NULL, "documentType" character varying NOT NULL, "approvedBy" character varying, "approvalDate" TIMESTAMP, "rejectionReason" character varying, "isMandatory" boolean NOT NULL, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "applicationId" uuid NOT NULL, "userDocumentId" uuid, CONSTRAINT "PK_788f5cd5f601f182c776144d2f4" PRIMARY KEY ("applicationDocumentId"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "first_name"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "date_of_birth"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "language_skills"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "current_education_level"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_login"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "firstName" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "lastName" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "dateOfBirth" date`);
        await queryRunner.query(`ALTER TABLE "users" ADD "languageSkills" jsonb`);
        await queryRunner.query(`ALTER TABLE "users" ADD "currentEducationLevel" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "users" ADD "lastLogin" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "userDocuments" ADD CONSTRAINT "FK_ce9e5c966b9bbe694bf1975fb41" FOREIGN KEY ("userUserId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "applicationDocuments" ADD CONSTRAINT "FK_a0d2f1e10f40b889fd63ecde062" FOREIGN KEY ("applicationId") REFERENCES "applications"("applicationId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "applicationDocuments" ADD CONSTRAINT "FK_35f105821e0a3e1892e7b4e68aa" FOREIGN KEY ("userDocumentId") REFERENCES "userDocuments"("userDocumentId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "applicationDocuments" DROP CONSTRAINT "FK_35f105821e0a3e1892e7b4e68aa"`);
        await queryRunner.query(`ALTER TABLE "applicationDocuments" DROP CONSTRAINT "FK_a0d2f1e10f40b889fd63ecde062"`);
        await queryRunner.query(`ALTER TABLE "userDocuments" DROP CONSTRAINT "FK_ce9e5c966b9bbe694bf1975fb41"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastLogin"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "currentEducationLevel"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "languageSkills"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "dateOfBirth"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "last_login" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ADD "is_active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "current_education_level" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "language_skills" jsonb`);
        await queryRunner.query(`ALTER TABLE "users" ADD "date_of_birth" date`);
        await queryRunner.query(`ALTER TABLE "users" ADD "last_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "first_name" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "applicationDocuments"`);
        await queryRunner.query(`DROP TABLE "userDocuments"`);
    }

}
