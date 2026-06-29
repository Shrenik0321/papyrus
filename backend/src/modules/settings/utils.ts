export const SettingProperty = {
  OpenRouterApiKeyEncrypted: 'openrouterApiKeyEncrypted',
} as const;

export type SettingProperty =
  (typeof SettingProperty)[keyof typeof SettingProperty];

export const SETTING_PROPERTIES = Object.values(
  SettingProperty,
) as SettingProperty[];

const SENSITIVE_PROPERTIES = new Set<SettingProperty>([
  SettingProperty.OpenRouterApiKeyEncrypted,
]);

export function isSettingProperty(value: string): value is SettingProperty {
  return (SETTING_PROPERTIES as string[]).includes(value);
}

export function isSensitiveSettingProperty(property: SettingProperty): boolean {
  return SENSITIVE_PROPERTIES.has(property);
}

export const SETTINGS_API_MESSAGES = {
  getAll: 'Settings retrieved successfully',
  getOne: 'Setting retrieved successfully',
  update: 'Setting updated successfully',
  delete: 'Setting cleared successfully',
  notFound: (property: string) => `Setting "${property}" not found`,
} as const;
