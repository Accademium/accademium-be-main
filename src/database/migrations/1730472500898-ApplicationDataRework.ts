import { MigrationInterface, QueryRunner } from "typeorm";

export class ApplicationDataRework1730472500898 implements MigrationInterface {
    name = 'ApplicationDataRework1730472500898'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_c0ad1db259186a986daf71dfa56"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "userUserId"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "applicationName"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "universityId"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "adminId"`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "isMandatory" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "applications" ADD "programId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "applications" ADD "programName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "applications" ADD "city" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "applications" ADD "country" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "documentType"`);
        await queryRunner.query(`CREATE TYPE "public"."documents_documenttype_enum" AS ENUM('LANGUAGE_CERTIFICATE', 'HIGH_SCHOOL_CERTIFICATE', 'MOTIVATIONAL_LETTER', 'CV')`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "documentType" "public"."documents_documenttype_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "documentType"`);
        await queryRunner.query(`DROP TYPE "public"."documents_documenttype_enum"`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "documentType" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "country"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "programName"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "programId"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "isMandatory"`);
        await queryRunner.query(`ALTER TABLE "applications" ADD "adminId" character varying`);
        await queryRunner.query(`ALTER TABLE "applications" ADD "universityId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "applications" ADD "applicationName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "userUserId" character varying(36)`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_c0ad1db259186a986daf71dfa56" FOREIGN KEY ("userUserId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
