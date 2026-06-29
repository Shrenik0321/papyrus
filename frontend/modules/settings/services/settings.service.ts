import { unwrapApiResponse } from "@/lib/types";
import * as settingsApi from "../api/settings.api";
import type { Setting, SettingProperty } from "../types/setting.type";

export async function getSettings(): Promise<Setting[]> {
  const response = await settingsApi.fetchSettings();
  return unwrapApiResponse(response);
}

export async function getSettingByProperty(
  property: SettingProperty,
): Promise<Setting> {
  const response = await settingsApi.fetchSettingByProperty(property);
  return unwrapApiResponse(response);
}

export async function updateSettingValue(
  property: SettingProperty,
  value: string,
): Promise<Setting> {
  const response = await settingsApi.updateSetting(property, value);
  return unwrapApiResponse(response);
}

export async function clearSettingValue(
  property: SettingProperty,
): Promise<Setting> {
  const response = await settingsApi.clearSetting(property);
  return unwrapApiResponse(response);
}
