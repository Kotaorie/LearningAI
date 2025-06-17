import { MigrationInterface, QueryRunner } from "typeorm";

export class FixDatabase1750147746252 implements MigrationInterface {
    name = 'FixDatabase1750147746252'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lessons" DROP CONSTRAINT "lessons_chapter_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "quizzes" DROP CONSTRAINT "quizzes_course_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "quizzes" DROP CONSTRAINT "quizzes_chapter_id_fkey"`);
        await queryRunner.query(`ALTER TABLE "chapters" DROP CONSTRAINT "chapters_course_id_fkey"`);
        await queryRunner.query(`CREATE TABLE "schedules" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "courseId" character varying NOT NULL, "courseName" character varying NOT NULL, "days" text NOT NULL, "hoursPerSession" integer NOT NULL, "durationWeeks" integer NOT NULL, "startDate" character varying NOT NULL, CONSTRAINT "PK_7e33fc2ea755a5765e3564e66dd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "course" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "title" character varying NOT NULL, "level" integer NOT NULL, "status" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bf95180dd756fd204fb01ce4916" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "first_name"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "lessons" DROP COLUMN "chapter_id"`);
        await queryRunner.query(`ALTER TABLE "lessons" DROP COLUMN "content_markdown"`);
        await queryRunner.query(`ALTER TABLE "quizzes" DROP COLUMN "course_id"`);
        await queryRunner.query(`ALTER TABLE "quizzes" DROP COLUMN "chapter_id"`);
        await queryRunner.query(`ALTER TABLE "quizzes" DROP COLUMN "questions_json"`);
        await queryRunner.query(`ALTER TABLE "quizzes" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "chapters" DROP COLUMN "course_id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "firstName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "lastName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "googleTokens" character varying`);
        await queryRunner.query(`ALTER TABLE "lessons" ADD "chapterId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lessons" ADD "contentMarkdown" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quizzes" ADD "courseId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quizzes" ADD "chapterId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quizzes" ADD "questionsJson" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quizzes" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "chapters" ADD "courseId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "users_email_key"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password_hash"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password_hash" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "level"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "level" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lessons" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "lessons" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lessons" ALTER COLUMN "position" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quizzes" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "quizzes" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chapters" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "chapters" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chapters" ALTER COLUMN "position" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chapters" ALTER COLUMN "position" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chapters" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "chapters" ADD "title" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "quizzes" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "quizzes" ADD "title" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "lessons" ALTER COLUMN "position" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lessons" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "lessons" ADD "title" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "level"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "level" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password_hash"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password_hash" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "users_email_key" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "chapters" DROP COLUMN "courseId"`);
        await queryRunner.query(`ALTER TABLE "quizzes" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "quizzes" DROP COLUMN "questionsJson"`);
        await queryRunner.query(`ALTER TABLE "quizzes" DROP COLUMN "chapterId"`);
        await queryRunner.query(`ALTER TABLE "quizzes" DROP COLUMN "courseId"`);
        await queryRunner.query(`ALTER TABLE "lessons" DROP COLUMN "contentMarkdown"`);
        await queryRunner.query(`ALTER TABLE "lessons" DROP COLUMN "chapterId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "googleTokens"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "chapters" ADD "course_id" uuid`);
        await queryRunner.query(`ALTER TABLE "quizzes" ADD "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "quizzes" ADD "questions_json" jsonb`);
        await queryRunner.query(`ALTER TABLE "quizzes" ADD "chapter_id" uuid`);
        await queryRunner.query(`ALTER TABLE "quizzes" ADD "course_id" uuid`);
        await queryRunner.query(`ALTER TABLE "lessons" ADD "content_markdown" text`);
        await queryRunner.query(`ALTER TABLE "lessons" ADD "chapter_id" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD "last_name" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "first_name" character varying(100)`);
        await queryRunner.query(`DROP TABLE "course"`);
        await queryRunner.query(`DROP TABLE "schedules"`);
        await queryRunner.query(`ALTER TABLE "chapters" ADD CONSTRAINT "chapters_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lessons" ADD CONSTRAINT "lessons_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
