import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  decryptSettingValue,
  encryptSettingValue,
} from '../../lib/crypto/settings-encryption';
import { ApiResponse, Response } from '../../lib/utils';
import { SettingResponseDto } from './dto/setting-response.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Setting } from './entities/setting.entity';
import { SettingsRepository } from './settings.repo';
import {
  isSensitiveSettingProperty,
  isSettingProperty,
  SETTINGS_API_MESSAGES,
  SettingProperty,
} from './utils';

@Injectable()
export class SettingsService {
  private readonly settingsRepository: SettingsRepository;

  constructor(settingsRepository: SettingsRepository) {
    this.settingsRepository = settingsRepository;
  }

  async findAll(userId: string): Promise<Response<SettingResponseDto[]>> {
    const settings = await this.settingsRepository.findAllByUser(userId);
    return ApiResponse(
      settings.map((setting) => this.toResponseDto(setting)),
      SETTINGS_API_MESSAGES.getAll,
    );
  }

  async findByProperty(
    userId: string,
    property: string,
  ): Promise<Response<SettingResponseDto>> {
    const settingProperty = this.parseProperty(property);
    const setting = await this.settingsRepository.findByUserAndProperty(
      userId,
      settingProperty,
    );

    return ApiResponse(
      setting
        ? this.toResponseDto(setting)
        : this.toEmptyResponseDto(settingProperty),
      SETTINGS_API_MESSAGES.getOne,
    );
  }

  async update(
    userId: string,
    property: string,
    dto: UpdateSettingDto,
  ): Promise<Response<SettingResponseDto>> {
    const settingProperty = this.parseProperty(property);
    const value = dto.value?.trim();
    if (!value) {
      throw new BadRequestException('value is required');
    }

    const existing = await this.settingsRepository.findByUserAndProperty(
      userId,
      settingProperty,
    );
    const storedValue = isSensitiveSettingProperty(settingProperty)
      ? encryptSettingValue(value)
      : value;

    const updated = await this.settingsRepository.save({
      ...existing,
      userId,
      property: settingProperty,
      value: storedValue,
    });

    return ApiResponse(
      this.toResponseDto(updated),
      SETTINGS_API_MESSAGES.update,
    );
  }

  async clear(
    userId: string,
    property: string,
  ): Promise<Response<SettingResponseDto>> {
    const settingProperty = this.parseProperty(property);
    const setting = await this.settingsRepository.findByUserAndProperty(
      userId,
      settingProperty,
    );

    if (!setting) {
      return ApiResponse(
        this.toEmptyResponseDto(settingProperty),
        SETTINGS_API_MESSAGES.delete,
      );
    }

    const updated = await this.settingsRepository.save({
      ...setting,
      value: null,
    });

    return ApiResponse(
      this.toResponseDto(updated),
      SETTINGS_API_MESSAGES.delete,
    );
  }

  async getDecryptedValue(
    property: SettingProperty,
    userId: string,
  ): Promise<string | null> {
    const setting = await this.settingsRepository.findByUserAndProperty(
      userId,
      property,
    );
    if (!setting?.value) {
      return null;
    }
    if (isSensitiveSettingProperty(property)) {
      return decryptSettingValue(setting.value);
    }
    return setting.value;
  }

  private parseProperty(property: string): SettingProperty {
    if (!isSettingProperty(property)) {
      throw new NotFoundException(SETTINGS_API_MESSAGES.notFound(property));
    }
    return property;
  }

  private toEmptyResponseDto(property: SettingProperty): SettingResponseDto {
    const now = new Date();
    return {
      id: '00000000-0000-0000-0000-000000000000',
      property,
      value: null,
      hasValue: false,
      createdAt: now,
      updatedAt: now,
    };
  }

  private toResponseDto(setting: Setting): SettingResponseDto {
    const hasValue = setting.value !== null && setting.value !== '';
    if (isSensitiveSettingProperty(setting.property)) {
      return {
        id: setting.id,
        property: setting.property,
        value: null,
        hasValue,
        createdAt: setting.createdAt,
        updatedAt: setting.updatedAt,
      };
    }

    return {
      id: setting.id,
      property: setting.property,
      value: setting.value,
      hasValue,
      createdAt: setting.createdAt,
      updatedAt: setting.updatedAt,
    };
  }
}
