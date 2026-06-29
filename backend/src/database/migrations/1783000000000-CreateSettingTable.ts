import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSettingTable1783000000000 implements MigrationInterface {
  name = 'CreateSettingTable1783000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "setting" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "property" character varying(255) NOT NULL,
        "value" text,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_setting_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_setting_property" ON "setting" ("property")`,
    );
    await queryRunner.query(`
      INSERT INTO "setting" ("property", "value")
      VALUES ('openrouterApiKeyEncrypted', NULL)
      ON CONFLICT ("property") DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_setting_property"`);
    await queryRunner.query(`DROP TABLE "setting"`);
  }
}
