import { DataSource } from 'typeorm';
import { Library } from 'src/modules/library/entities/library.entity';
import { LibraryType } from 'src/modules/library/utils';
import { User } from 'src/modules/user/entities/user.entity';
import { Workspace } from 'src/modules/workspace/entities/workspace.entity';
import { Seeder } from './seeder.interface';

const SEED_USER_ID = 'uRoADctFT64PiREyiw11s2wFL0PvotSm';
const SEED_USER_EMAIL = 's.shrenikdeep@gmail.com';

const DEMO_LIBRARY_ITEMS = [
  {
    workspaceTitle: 'Personal Notes',
    type: LibraryType.Note,
    title: 'AML Literature Review',
    fileUrl: '/notes/aml-literature-review.md',
  },
  {
    workspaceTitle: 'Project Alpha',
    type: LibraryType.Paper,
    title: 'Attention Is All You Need',
    fileUrl: '/papers/attention-is-all-you-need.pdf',
  },
] as const;

export class LibrarySeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const userRepo = dataSource.getRepository(User);
    const workspaceRepo = dataSource.getRepository(Workspace);
    const libraryRepo = dataSource.getRepository(Library);

    const seedUser = await userRepo.findOne({
      where: { email: SEED_USER_EMAIL },
    });
    if (!seedUser) {
      console.warn(
        'Library seeder skipped: seed user not found. Run UserSeeder first.',
      );
      return;
    }

    const workspaces = await Promise.all(
      DEMO_LIBRARY_ITEMS.map(({ workspaceTitle }) =>
        workspaceRepo.findOne({
          where: { userId: SEED_USER_ID, title: workspaceTitle },
        }),
      ),
    );

    if (workspaces.some((workspace) => !workspace)) {
      console.warn(
        'Library seeder skipped: demo workspaces not found. Run WorkspaceSeeder first.',
      );
      return;
    }

    const workspaceIds = workspaces.map((workspace) => workspace!.id);
    const existing = await libraryRepo
      .createQueryBuilder('library')
      .where('library.workspaceId IN (:...workspaceIds)', { workspaceIds })
      .getCount();

    if (existing > 0) {
      return;
    }

    for (const [index, item] of DEMO_LIBRARY_ITEMS.entries()) {
      await libraryRepo.save(
        libraryRepo.create({
          title: item.title,
          type: item.type,
          fileUrl: item.fileUrl,
          workspaceId: workspaces[index]!.id,
          createdById: seedUser.id,
          updatedById: null,
        }),
      );
    }

    console.log(
      `Seeded ${DEMO_LIBRARY_ITEMS.length} library items (1 note, 1 paper) for user ${seedUser.id}.`,
    );
  }
}
