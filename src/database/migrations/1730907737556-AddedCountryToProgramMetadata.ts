import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedCountryToProgramMetadata1730907737556 implements MigrationInterface {
    name = 'AddedCountryToProgramMetadata1730907737556'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."programs_metadata_country_enum" AS ENUM('AT', 'BG', 'DE', 'NE')`);
        await queryRunner.query(`ALTER TABLE "programs_metadata" ADD "country" "public"."programs_metadata_country_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "programs_metadata" DROP COLUMN "country"`);
        await queryRunner.query(`DROP TYPE "public"."programs_metadata_country_enum"`);
    }

}
