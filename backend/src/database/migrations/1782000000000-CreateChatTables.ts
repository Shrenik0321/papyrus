import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateChatTables1782000000000 implements MigrationInterface {
  name = 'CreateChatTables1782000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "chat_session" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "workspaceId" uuid NOT NULL,
        "userId" text NOT NULL,
        "title" character varying(255) NOT NULL DEFAULT 'New chat',
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_chat_session_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "chat_message" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "sessionId" uuid NOT NULL,
        "role" character varying(20) NOT NULL,
        "content" text NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_chat_message_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_chat_session_workspace_user" ON "chat_session" ("workspaceId", "userId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_chat_session_user" ON "chat_session" ("userId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_chat_session_updatedAt" ON "chat_session" ("updatedAt")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_chat_message_session_createdAt" ON "chat_message" ("sessionId", "createdAt")`,
    );

    await queryRunner.query(`
      ALTER TABLE "chat_session"
      ADD CONSTRAINT "FK_chat_session_workspaceId"
      FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "chat_session"
      ADD CONSTRAINT "FK_chat_session_userId"
      FOREIGN KEY ("userId") REFERENCES "user"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "chat_message"
      ADD CONSTRAINT "FK_chat_message_sessionId"
      FOREIGN KEY ("sessionId") REFERENCES "chat_session"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chat_message" DROP CONSTRAINT "FK_chat_message_sessionId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_session" DROP CONSTRAINT "FK_chat_session_userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_session" DROP CONSTRAINT "FK_chat_session_workspaceId"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_chat_message_session_createdAt"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_chat_session_updatedAt"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_chat_session_user"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_chat_session_workspace_user"`,
    );
    await queryRunner.query(`DROP TABLE "chat_message"`);
    await queryRunner.query(`DROP TABLE "chat_session"`);
  }
}

