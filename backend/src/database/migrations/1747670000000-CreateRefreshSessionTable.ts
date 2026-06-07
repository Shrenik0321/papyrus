import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRefreshSessionTable1747670000000 implements MigrationInterface {
  name = 'CreateRefreshSessionTable1747670000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "refresh_session" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "userId" text NOT NULL,
        "refreshTokenHash" varchar(64) NOT NULL,
        "expiresAt" timestamptz NOT NULL,
        "deviceId" text,
        "userAgent" text,
        "ipAddress" text,
        "createdAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PK_refresh_session" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_refresh_session_hash" UNIQUE ("refreshTokenHash")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_refresh_session_userId" ON "refresh_session" ("userId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "refresh_session"`);
  }
}
