import { MigrationInterface, QueryRunner } from "typeorm";

export class FixedUserTable1730388522303 implements MigrationInterface {
    name = 'FixedUserTable1730388522303'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "date_of_birth" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "date_of_birth" SET NOT NULL`);
    }

}
