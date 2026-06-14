import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Seeder } from './seeder.interface';
import { LibrarySeeder } from './library.seed';
import { UserSeeder } from './user.seed';
import { WorkspaceSeeder } from './workspce.seed';

@Injectable()
export class SeedRunner {
  private readonly seeders: Seeder[] = [
    new UserSeeder(),
    new WorkspaceSeeder(),
    new LibrarySeeder(),
  ];

  constructor(private readonly dataSource: DataSource) {}

  async run(): Promise<void> {
    for (const seeder of this.seeders) {
      await seeder.run(this.dataSource);
    }
  }
}
