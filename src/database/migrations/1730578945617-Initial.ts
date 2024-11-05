import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1730578945617 implements MigrationInterface {
    name = 'Initial1730578945617'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "documents" ("documentId" uuid NOT NULL DEFAULT uuid_generate_v4(), "documentType" "public"."documents_documenttype_enum" NOT NULL, "s3Key" character varying NOT NULL, "fileName" character varying NOT NULL, "fileSize" integer NOT NULL, "mimeType" character varying NOT NULL, "approvalStatus" "public"."documents_approvalstatus_enum" NOT NULL DEFAULT 'PENDING', "approvedBy" character varying, "approvalDate" TIMESTAMP, "rejectionReason" text, "version" integer NOT NULL DEFAULT '1', "isMandatory" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "applicationId" uuid, CONSTRAINT "PK_0592c7aa6895bb9fe3dcec8b6f6" PRIMARY KEY ("documentId"))`);
        await queryRunner.query(`CREATE TABLE "applications" ("applicationId" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."applications_status_enum" NOT NULL DEFAULT 'CREATED', "programId" character varying NOT NULL, "programName" character varying NOT NULL, "universityName" character varying NOT NULL, "city" character varying NOT NULL, "country" character varying NOT NULL, "submissionDate" TIMESTAMP, "mentorId" character varying, "notes" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" character varying(36) NOT NULL, CONSTRAINT "PK_f36b435bfa3976e33f912958f19" PRIMARY KEY ("applicationId"))`);
        await queryRunner.query(`CREATE TABLE "users" ("userId" character varying(36) NOT NULL, "email" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "date_of_birth" date, "phone" character varying, "address" character varying, "nationality" character varying, "language_skills" jsonb, "current_education_level" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_active" boolean NOT NULL DEFAULT true, "last_login" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_8bf09ba754322ab9c22a215c919" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`CREATE TABLE "university_details" ("university_id" character varying NOT NULL, "city" character varying NOT NULL, "university" character varying NOT NULL, "university_logo_link" character varying NOT NULL, "university_type" character varying NOT NULL, "address" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_bbd109c67375f73bdf21c1e7e6e" PRIMARY KEY ("university_id", "city"))`);
        await queryRunner.query(`CREATE TABLE "programs_metadata" ("program_id" character varying NOT NULL, "program_title" character varying NOT NULL, "generalized_name" character varying NOT NULL, "university_id" character varying NOT NULL, "city" character varying NOT NULL, "degree_type" character varying NOT NULL, "language" character varying NOT NULL, "fields" text array NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_25e09aaf0a84ba8754b7f4c0b1a" PRIMARY KEY ("program_id"))`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_a46d9e1edf44fe362a14bd5344d" FOREIGN KEY ("applicationId") REFERENCES "applications"("applicationId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "applications" ADD CONSTRAINT "FK_90ad8bec24861de0180f638b9cc" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "programs_metadata" ADD CONSTRAINT "FK_e03af883f8cfef659488055e0a8" FOREIGN KEY ("university_id", "city") REFERENCES "university_details"("university_id","city") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "programs_metadata" DROP CONSTRAINT "FK_e03af883f8cfef659488055e0a8"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "FK_90ad8bec24861de0180f638b9cc"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_a46d9e1edf44fe362a14bd5344d"`);
        await queryRunner.query(`DROP TABLE "programs_metadata"`);
        await queryRunner.query(`DROP TABLE "university_details"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "applications"`);
        await queryRunner.query(`DROP TABLE "documents"`);
    }

}
