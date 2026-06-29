import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Single source of truth for the setting table (per-user key/value store).
 * Drops any prior setting table shape from earlier migrations and recreates it.
 */
export class CreateSettingTable1783300000000 implements MigrationInterface {
  name = 'CreateSettingTable1783300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "setting" CASCADE`);

    await queryRunner.query(`
      CREATE TABLE "setting" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "userId" text NOT NULL,
        "property" character varying(255) NOT NULL,
        "value" text,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_setting_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "setting"
        ADD CONSTRAINT "FK_setting_userId"
        FOREIGN KEY ("userId")
        REFERENCES "user"("id")
        ON DELETE CASCADE
        ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_setting_userId_property"
      ON "setting" ("userId", "property")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "setting" CASCADE`);
  }
}
