import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';
import { SettingProperty } from './utils';

@Injectable()
export class SettingsRepository {
  constructor(
    @InjectRepository(Setting)
    private readonly repository: Repository<Setting>,
  ) {}

  findAllByUser(userId: string): Promise<Setting[]> {
    return this.repository.find({
      where: { userId },
      order: { property: 'ASC' },
    });
  }

  findByUserAndProperty(
    userId: string,
    property: SettingProperty,
  ): Promise<Setting | null> {
    return this.repository.findOne({ where: { userId, property } });
  }

  save(setting: Partial<Setting>): Promise<Setting> {
    return this.repository.save(setting);
  }
}
