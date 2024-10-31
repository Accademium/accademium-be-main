import { MigrationInterface, QueryRunner } from "typeorm";

export class MergeUserAndCognitoId1730394838885 implements MigrationInterface {
    name = 'MergeUserAndCognitoId1730394838885'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_d9dea74916617da4a95c8cce52a"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "cognito_id"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "FK_90ad8bec24861de0180f638b9cc"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_c0ad1db259186a986daf71dfa56"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_8bf09ba754322ab9c22a215c919"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "userId" character varying(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_8bf09ba754322ab9c22a215c919" PRIMARY KEY ("userId")`);
        await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "applications" ADD "userId" character varying(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "userUserId"`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "userUserId" character varying(36)`);
        await queryRunner.query(`ALTER TABLE "applications" ADD CONSTRAINT "FK_90ad8bec24861de0180f638b9cc" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_c0ad1db259186a986daf71dfa56" FOREIGN KEY ("userUserId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_c0ad1db259186a986daf71dfa56"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "FK_90ad8bec24861de0180f638b9cc"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "userUserId"`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "userUserId" uuid`);
        await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "applications" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_8bf09ba754322ab9c22a215c919"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "userId" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_8bf09ba754322ab9c22a215c919" PRIMARY KEY ("userId")`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_c0ad1db259186a986daf71dfa56" FOREIGN KEY ("userUserId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "applications" ADD CONSTRAINT "FK_90ad8bec24861de0180f638b9cc" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD "cognito_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_d9dea74916617da4a95c8cce52a" UNIQUE ("cognito_id")`);
    }

}
