"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as settingsService from "../services/settings.service";
import type { SettingProperty } from "../types/setting.type";

export const settingsKeys = {
  all: ["settings"] as const,
  lists: () => [...settingsKeys.all, "list"] as const,
  detail: (property: SettingProperty) =>
    [...settingsKeys.all, "detail", property] as const,
};

export function useSettings() {
  return useQuery({
    queryKey: settingsKeys.lists(),
    queryFn: settingsService.getSettings,
  });
}

export function useSetting(property: SettingProperty) {
  return useQuery({
    queryKey: settingsKeys.detail(property),
    queryFn: () => settingsService.getSettingByProperty(property),
  });
}

export function useUpdateSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      property,
      value,
    }: {
      property: SettingProperty;
      value: string;
    }) => settingsService.updateSettingValue(property, value),
    onSuccess: (_data, { property }) => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: settingsKeys.detail(property) });
    },
  });
}

export function useClearSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (property: SettingProperty) =>
      settingsService.clearSettingValue(property),
    onSuccess: (_data, property) => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: settingsKeys.detail(property) });
    },
  });
}
