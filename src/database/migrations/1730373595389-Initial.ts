import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1730373595389 implements MigrationInterface {
    name = 'Initial1730373595389'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "user_id" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME CONSTRAINT "PK_96aac72f1574b88752e9fb00089" TO "PK_8bf09ba754322ab9c22a215c919"`);
        await queryRunner.query(`CREATE TYPE "public"."documents_approvalstatus_enum" AS ENUM('PENDING', 'APPROVED', 'REJECTED')`);
        await queryRunner.query(`CREATE TABLE "documents" ("documentId" uuid NOT NULL DEFAULT uuid_generate_v4(), "documentType" character varying NOT NULL, "s3Key" character varying NOT NULL, "fileName" character varying NOT NULL, "fileSize" integer NOT NULL, "mimeType" character varying NOT NULL, "approvalStatus" "public"."documents_approvalstatus_enum" NOT NULL DEFAULT 'PENDING', "approvedBy" character varying, "approvalDate" TIMESTAMP, "rejectionReason" text, "version" integer NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "applicationId" uuid, "userUserId" uuid, CONSTRAINT "PK_0592c7aa6895bb9fe3dcec8b6f6" PRIMARY KEY ("documentId"))`);
        await queryRunner.query(`CREATE TYPE "public"."applications_status_enum" AS ENUM('CREATED', 'SUBMITTED', 'UNDER_REVIEW', 'DOCUMENTS_APPROVED', 'SENT_TO_UNIVERSITY', 'UNIVERSITY_REVIEWING', 'UNIVERSITY_APPROVED', 'UNIVERSITY_REJECTED', 'UNIVERSITY_NEEDS_INFO', 'NEEDS_REVISION', 'REJECTED')`);
        await queryRunner.query(`CREATE TABLE "applications" ("applicationId" uuid NOT NULL DEFAULT uuid_generate_v4(), "applicationName" character varying NOT NULL, "status" "public"."applications_status_enum" NOT NULL DEFAULT 'CREATED', "universityId" character varying NOT NULL, "universityName" character varying NOT NULL, "submissionDate" TIMESTAMP, "mentorId" character varying, "adminId" character varying, "notes" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, CONSTRAINT "PK_f36b435bfa3976e33f912958f19" PRIMARY KEY ("applicationId"))`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_a46d9e1edf44fe362a14bd5344d" FOREIGN KEY ("applicationId") REFERENCES "applications"("applicationId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_c0ad1db259186a986daf71dfa56" FOREIGN KEY ("userUserId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "applications" ADD CONSTRAINT "FK_90ad8bec24861de0180f638b9cc" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "FK_90ad8bec24861de0180f638b9cc"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_c0ad1db259186a986daf71dfa56"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_a46d9e1edf44fe362a14bd5344d"`);
        await queryRunner.query(`DROP TABLE "applications"`);
        await queryRunner.query(`DROP TYPE "public"."applications_status_enum"`);
        await queryRunner.query(`DROP TABLE "documents"`);
        await queryRunner.query(`DROP TYPE "public"."documents_approvalstatus_enum"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME CONSTRAINT "PK_8bf09ba754322ab9c22a215c919" TO "PK_96aac72f1574b88752e9fb00089"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "userId" TO "user_id"`);
    }

}
