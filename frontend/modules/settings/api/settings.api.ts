import { apiDelete, apiGet, apiPut } from "@/lib/utils";
import type { ApiResponse } from "@/lib/types";
import { SETTINGS_ROUTES } from "@/lib/routes";
import type { Setting, SettingProperty } from "../types/setting.type";

export function fetchSettings(): Promise<ApiResponse<Setting[]>> {
  return apiGet<Setting[]>(SETTINGS_ROUTES.base);
}

export function fetchSettingByProperty(
  property: SettingProperty,
): Promise<ApiResponse<Setting>> {
  return apiGet<Setting>(SETTINGS_ROUTES.byProperty(property));
}

export function updateSetting(
  property: SettingProperty,
  value: string,
): Promise<ApiResponse<Setting>> {
  return apiPut<Setting>(SETTINGS_ROUTES.byProperty(property), { value });
}

export function clearSetting(
  property: SettingProperty,
): Promise<ApiResponse<Setting>> {
  return apiDelete<Setting>(SETTINGS_ROUTES.byProperty(property));
}
