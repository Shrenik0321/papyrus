import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserRoleColumn1747680000000 implements MigrationInterface {
  name = 'AddUserRoleColumn1747680000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user"
      ADD COLUMN IF NOT EXISTS "role" text NOT NULL DEFAULT 'user'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "role"`);
  }
}
