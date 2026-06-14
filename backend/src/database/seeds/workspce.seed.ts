import { DataSource } from 'typeorm';
import { Workspace } from 'src/modules/workspace/entities/workspace.entity';
import { Seeder } from './seeder.interface';

const SEED_USER_ID = 'uRoADctFT64PiREyiw11s2wFL0PvotSm';

const DEMO_WORKSPACES = [
  { title: 'Personal Notes' },
  { title: 'Project Alpha' },
] as const;

export class WorkspaceSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(Workspace);

    const existing = await repo.count({ where: { userId: SEED_USER_ID } });
    if (existing > 0) {
      return;
    }

    for (const { title } of DEMO_WORKSPACES) {
      await repo.save(
        repo.create({
          title,
          userId: SEED_USER_ID,
          createdById: SEED_USER_ID,
          updatedById: null,
        }),
      );
    }

    console.log(
      `Seeded ${DEMO_WORKSPACES.length} workspaces for user ${SEED_USER_ID}.`,
    );
  }
}
