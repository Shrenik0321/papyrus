import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLibraryTable1780921449734 implements MigrationInterface {
  name = 'CreateLibraryTable1780921449734';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "library_type_enum" AS ENUM ('note', 'paper')`,
    );
    await queryRunner.query(`
      CREATE TABLE "library" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "title" character varying(255) NOT NULL,
        "type" "library_type_enum" NOT NULL,
        "fileUrl" text NOT NULL,
        "workspaceId" uuid NOT NULL,
        "createdById" text NOT NULL,
        "updatedById" text,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_library_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_library_workspaceId" ON "library" ("workspaceId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_library_workspaceId_type" ON "library" ("workspaceId", "type")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_library_createdById" ON "library" ("createdById")`,
    );
    await queryRunner.query(
      `ALTER TABLE "library" ADD CONSTRAINT "FK_library_workspaceId" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "library" ADD CONSTRAINT "FK_library_createdById" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "library" ADD CONSTRAINT "FK_library_updatedById" FOREIGN KEY ("updatedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "library" DROP CONSTRAINT "FK_library_updatedById"`,
    );
    await queryRunner.query(
      `ALTER TABLE "library" DROP CONSTRAINT "FK_library_createdById"`,
    );
    await queryRunner.query(
      `ALTER TABLE "library" DROP CONSTRAINT "FK_library_workspaceId"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_library_createdById"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_library_workspaceId_type"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_library_workspaceId"`);
    await queryRunner.query(`DROP TABLE "library"`);
    await queryRunner.query(`DROP TYPE "library_type_enum"`);
  }
}
