import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Seeder } from './seeder.interface';
import { UserSeeder } from './user.seed';

@Injectable()
export class SeedRunner {
  private readonly seeders: Seeder[] = [new UserSeeder()];

  constructor(private readonly dataSource: DataSource) {}

  async run(): Promise<void> {
    for (const seeder of this.seeders) {
      await seeder.run(this.dataSource);
    }
  }
}
