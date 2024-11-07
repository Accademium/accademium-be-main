import { MigrationInterface, QueryRunner } from "typeorm";

export class OptimizedApplicationTable1730913122381 implements MigrationInterface {
    name = 'OptimizedApplicationTable1730913122381'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "programName"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "country"`);
        await queryRunner.query(`ALTER TABLE "applications" ADD CONSTRAINT "FK_19b2f32f7895f833c906cdc1b14" FOREIGN KEY ("programId") REFERENCES "programs_metadata"("program_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "FK_19b2f32f7895f833c906cdc1b14"`);
        await queryRunner.query(`ALTER TABLE "applications" ADD "country" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "applications" ADD "city" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "applications" ADD "programName" character varying NOT NULL`);
    }

}
