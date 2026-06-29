export const SettingProperty = {
  OpenRouterApiKeyEncrypted: "openrouterApiKeyEncrypted",
} as const;

export type SettingProperty =
  (typeof SettingProperty)[keyof typeof SettingProperty];

export interface Setting {
  id: string;
  property: SettingProperty;
  value: string | null;
  hasValue: boolean;
  createdAt: string;
  updatedAt: string;
}
