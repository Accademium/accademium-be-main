import { MigrationInterface, QueryRunner } from "typeorm";

export class RefreshTokenTable1730996880201 implements MigrationInterface {
    name = 'RefreshTokenTable1730996880201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "applicationDocuments" RENAME COLUMN "documentType" TO "applicationDocumentType"`);
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("id" SERIAL NOT NULL, "token" text NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "lastUsed" TIMESTAMP, "ipAddress" character varying(45), "userAgent" text, "isRevoked" boolean NOT NULL DEFAULT false, "userUserId" character varying(36), CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_da6f731627474661222cac88bd9" FOREIGN KEY ("userUserId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_da6f731627474661222cac88bd9"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
        await queryRunner.query(`ALTER TABLE "applicationDocuments" RENAME COLUMN "applicationDocumentType" TO "documentType"`);
    }

}
