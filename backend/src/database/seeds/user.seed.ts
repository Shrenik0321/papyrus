import { DataSource } from 'typeorm';
import { auth } from '../../lib/auth/utils';
import { UserRole } from '../../modules/user/utils';
import { User } from '../../modules/user/entities/user.entity';
import { Seeder } from './seeder.interface';

const DEMO_USERS = [
  {
    email: 's.shrenikdeep@gmail.com',
    name: 'Shrenik',
    password: 'test@123',
    role: UserRole.Admin,
  },
  {
    email: 'alice@example.com',
    name: 'Alice',
    password: 'test@456',
    role: UserRole.User,
  },
] as const;

export class UserSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    const count = await userRepository.count();

    if (count > 0) {
      return;
    }

    for (const demoUser of DEMO_USERS) {
      const result = await auth.api.signUpEmail({
        body: {
          email: demoUser.email,
          password: demoUser.password,
          name: demoUser.name,
        },
      });

      if (result?.user?.id) {
        await userRepository.update(result.user.id, {
          role: demoUser.role,
          emailVerified: true,
        });
      }
    }

    console.log(
      'Seeded demo users: s.shrenikdeep@gmail.com (admin), alice@example.com (user).',
    );
  }
}
