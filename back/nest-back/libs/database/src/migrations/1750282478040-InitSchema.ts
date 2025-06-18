import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1750282478040 implements MigrationInterface {
    name = 'InitSchema1750282478040'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "level" integer NOT NULL, "googleTokens" character varying, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lessons" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "chapterId" uuid NOT NULL, "title" character varying NOT NULL, "contentMarkdown" text NOT NULL, "position" integer NOT NULL, CONSTRAINT "PK_9b9a8d455cac672d262d7275730" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chapters" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "courseId" uuid NOT NULL, "title" character varying NOT NULL, "position" integer NOT NULL, CONSTRAINT "PK_a2bbdbb4bdc786fe0cb0fcfc4a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."course_type_enum" AS ENUM('historien', 'developpeur', 'scientifique', 'artiste', 'entrepreneur', 'linguiste', 'sportif')`);
        await queryRunner.query(`CREATE TABLE "course" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "title" character varying NOT NULL, "type" "public"."course_type_enum" NOT NULL, "sujet" character varying NOT NULL, "level" integer NOT NULL, "status" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bf95180dd756fd204fb01ce4916" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "schedules" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "courseId" character varying NOT NULL, "courseName" character varying NOT NULL, "days" text NOT NULL, "hoursPerSession" integer NOT NULL, "durationWeeks" integer NOT NULL, "startDate" character varying NOT NULL, CONSTRAINT "PK_7e33fc2ea755a5765e3564e66dd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quizzes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "courseId" character varying NOT NULL, "chapterId" character varying NOT NULL, "title" character varying NOT NULL, "questionsJson" jsonb NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b24f0f7662cf6b3a0e7dba0a1b4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "lessons" ADD CONSTRAINT "FK_1067c75d93c6ce6408cd1ad156a" FOREIGN KEY ("chapterId") REFERENCES "chapters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chapters" ADD CONSTRAINT "FK_becd2c25ed5b601e7a4466271c8" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chapters" DROP CONSTRAINT "FK_becd2c25ed5b601e7a4466271c8"`);
        await queryRunner.query(`ALTER TABLE "lessons" DROP CONSTRAINT "FK_1067c75d93c6ce6408cd1ad156a"`);
        await queryRunner.query(`DROP TABLE "quizzes"`);
        await queryRunner.query(`DROP TABLE "schedules"`);
        await queryRunner.query(`DROP TABLE "course"`);
        await queryRunner.query(`DROP TYPE "public"."course_type_enum"`);
        await queryRunner.query(`DROP TABLE "chapters"`);
        await queryRunner.query(`DROP TABLE "lessons"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
