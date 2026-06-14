import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWorkspaceTable1780921449733 implements MigrationInterface {
  name = 'CreateWorkspaceTable1780921449733';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE "workspace" (
            "id" uuid NOT NULL DEFAULT gen_random_uuid(),
            "title" character varying(255) NOT NULL,
            "userId" text NOT NULL,
            "createdById" text NOT NULL,
            "updatedById" text,
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "PK_ca86b6f9b3be5fe26d307d09b49" PRIMARY KEY ("id")
          )
        `);
    await queryRunner.query(
      `CREATE INDEX "IDX_b48532fc84800d41cfee110682" ON "workspace" ("userId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fb730da36fb79e21e8fa5f2c30" ON "workspace" ("createdById")`,
    );
    await queryRunner.query(
      `ALTER TABLE "workspace" ADD CONSTRAINT "FK_b48532fc84800d41cfee110682c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "workspace" DROP CONSTRAINT "FK_b48532fc84800d41cfee110682c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3ae1d1221dbc787b1633dad301"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_session" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "email" text NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "user_email_key" UNIQUE ("email")`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "name" text NOT NULL`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fb730da36fb79e21e8fa5f2c30"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b48532fc84800d41cfee110682"`,
    );
    await queryRunner.query(`DROP TABLE "workspace"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_refresh_session_userId" ON "refresh_session" ("userId") `,
    );
  }
}
