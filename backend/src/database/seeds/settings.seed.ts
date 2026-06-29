import { DataSource } from 'typeorm';
import { Setting } from 'src/modules/settings/entities/setting.entity';
import {
  SETTING_PROPERTIES,
  SettingProperty,
} from 'src/modules/settings/utils';
import { Seeder } from './seeder.interface';

export class SettingsSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const settingRepo = dataSource.getRepository(Setting);

    for (const property of SETTING_PROPERTIES) {
      const existing = await settingRepo.findOne({ where: { property } });
      if (existing) {
        continue;
      }

      await settingRepo.save(
        settingRepo.create({
          property: property as SettingProperty,
          value: null,
        }),
      );
    }

    console.log(
      `Ensured ${SETTING_PROPERTIES.length} setting row(s) exist (${SETTING_PROPERTIES.join(', ')}).`,
    );
  }
}
