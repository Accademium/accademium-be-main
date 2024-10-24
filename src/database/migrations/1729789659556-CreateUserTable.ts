import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1729789659556 implements MigrationInterface {
    name = 'CreateUserTable1729789659556'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "programs_metadata" ("program_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "program_title" character varying NOT NULL, "generalized_name" character varying NOT NULL, "university_id" character varying NOT NULL, "degree_type" character varying NOT NULL, "language" character varying NOT NULL, "city" character varying NOT NULL, "fields" text array NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_25e09aaf0a84ba8754b7f4c0b1a" PRIMARY KEY ("program_id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cognito_id" character varying NOT NULL, "email" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "date_of_birth" date NOT NULL, "phone" character varying, "address" character varying, "nationality" character varying, "language_skills" jsonb, "current_education_level" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_active" boolean NOT NULL DEFAULT true, "last_login" TIMESTAMP, CONSTRAINT "UQ_d9dea74916617da4a95c8cce52a" UNIQUE ("cognito_id"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "programs_metadata"`);
    }

}
