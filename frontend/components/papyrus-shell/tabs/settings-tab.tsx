"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useClearSetting,
  useSetting,
  useUpdateSetting,
} from "@/modules/settings/hooks/useSettings";
import { SettingProperty } from "@/modules/settings/types/setting.type";
import { CheckCircle2Icon, KeyRoundIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

function OpenRouterApiKeySection() {
  const { data: setting, isLoading, isError } = useSetting(
    SettingProperty.OpenRouterApiKeyEncrypted,
  );
  const updateMutation = useUpdateSetting();
  const clearMutation = useClearSetting();

  const [apiKey, setApiKey] = React.useState("");

  React.useEffect(() => {
    setApiKey("");
  }, [setting?.hasValue]);

  const isPending = updateMutation.isPending || clearMutation.isPending;
  const trimmedKey = apiKey.trim();
  const canSave = trimmedKey.length > 0 && !isPending;

  const handleSave = () => {
    if (!canSave) return;

    updateMutation.mutate(
      {
        property: SettingProperty.OpenRouterApiKeyEncrypted,
        value: trimmedKey,
      },
      {
        onSuccess: () => {
          setApiKey("");
          toast.success("OpenRouter API key saved");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to save API key");
        },
      },
    );
  };

  const handleClear = () => {
    clearMutation.mutate(SettingProperty.OpenRouterApiKeyEncrypted, {
      onSuccess: () => {
        setApiKey("");
        toast.success("OpenRouter API key removed");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to remove API key");
      },
    });
  };

  if (isLoading) {
    return (
      <Card className="rounded-2xl">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full max-w-md" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-9 w-24" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="rounded-2xl border-destructive/40">
        <CardContent className="py-8 text-center text-sm text-destructive">
          Failed to load OpenRouter API key settings.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <KeyRoundIcon className="size-5 text-muted-foreground" />
          <CardTitle className="font-heading text-lg">OpenRouter API key</CardTitle>
        </div>
        <CardDescription>
          Used by the AI assistant to generate chat responses. Your key is stored
          encrypted and never shown again after saving.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {setting?.hasValue ? (
          <div className="flex items-start gap-2 rounded-[10px] border border-border bg-muted/40 px-3 py-2.5 text-sm">
            <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="text-muted-foreground">
              An API key is already configured. Remove it below to add a new one.
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No API key configured yet. Add one to enable AI-generated chat
            messages.
          </p>
        )}

        <div className="space-y-2">
          <Label htmlFor="openrouter-api-key">
            {setting?.hasValue ? "New API key" : "API key"}
          </Label>
          <Input
            id="openrouter-api-key"
            type="password"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            placeholder="sk-or-..."
            autoComplete="off"
            className="rounded-[10px]"
            disabled={isPending}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
          >
            {updateMutation.isPending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : setting?.hasValue ? (
              "Replace key"
            ) : (
              "Save key"
            )}
          </Button>
          {setting?.hasValue && (
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              disabled={isPending}
            >
              {clearMutation.isPending ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                "Remove key"
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function SettingsTab() {
  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto max-w-2xl px-8 py-10">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Settings
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage integrations and preferences for your account.
          </p>
        </div>

        <div className="space-y-6">
          <OpenRouterApiKeySection />
        </div>
      </div>
    </div>
  );
}
