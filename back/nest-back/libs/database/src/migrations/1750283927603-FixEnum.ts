import { MigrationInterface, QueryRunner } from "typeorm";

export class FixEnum1750283927603 implements MigrationInterface {
    name = 'FixEnum1750283927603'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."course_type_enum" RENAME TO "course_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."course_type_enum" AS ENUM('histoire', 'code', 'science', 'art', 'business', 'langue', 'sport')`);
        await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "type" TYPE "public"."course_type_enum" USING "type"::"text"::"public"."course_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."course_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."course_type_enum_old" AS ENUM('historien', 'developpeur', 'scientifique', 'artiste', 'entrepreneur', 'linguiste', 'sportif')`);
        await queryRunner.query(`ALTER TABLE "course" ALTER COLUMN "type" TYPE "public"."course_type_enum_old" USING "type"::"text"::"public"."course_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."course_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."course_type_enum_old" RENAME TO "course_type_enum"`);
    }

}
