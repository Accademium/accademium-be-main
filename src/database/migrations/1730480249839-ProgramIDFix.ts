import { MigrationInterface, QueryRunner } from "typeorm";

export class ProgramIDFix1730480249839 implements MigrationInterface {
    name = 'ProgramIDFix1730480249839'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "programs_metadata" DROP CONSTRAINT "PK_25e09aaf0a84ba8754b7f4c0b1a"`);
        await queryRunner.query(`ALTER TABLE "programs_metadata" DROP COLUMN "program_id"`);
        await queryRunner.query(`ALTER TABLE "programs_metadata" ADD "program_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "programs_metadata" ADD CONSTRAINT "PK_25e09aaf0a84ba8754b7f4c0b1a" PRIMARY KEY ("program_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "programs_metadata" DROP CONSTRAINT "PK_25e09aaf0a84ba8754b7f4c0b1a"`);
        await queryRunner.query(`ALTER TABLE "programs_metadata" DROP COLUMN "program_id"`);
        await queryRunner.query(`ALTER TABLE "programs_metadata" ADD "program_id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "programs_metadata" ADD CONSTRAINT "PK_25e09aaf0a84ba8754b7f4c0b1a" PRIMARY KEY ("program_id")`);
    }

}
