"use client";

import { Badge } from "@/components/ui/badge";
import type { ActivityItem } from "@/lib/mock/types";
import { cn } from "@/lib/utils";
import {
  FileTextIcon,
  LightbulbIcon,
  StickyNoteIcon,
} from "lucide-react";

const TYPE_CONFIG = {
  paper: { label: "Paper", icon: FileTextIcon, variant: "default" as const },
  note: { label: "Note", icon: StickyNoteIcon, variant: "secondary" as const },
  analysis: { label: "Analysis", icon: LightbulbIcon, variant: "outline" as const },
};

function formatRelativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

interface ActivityCardProps {
  activity: ActivityItem;
  onClick: () => void;
}

export function ActivityCard({ activity, onClick }: ActivityCardProps) {
  const config = TYPE_CONFIG[activity.type];
  const Icon = config.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full flex-col items-start rounded-xl border border-border bg-card p-4 text-left",
        "transition-colors duration-150 hover:border-primary/30 hover:bg-accent/30",
      )}
    >
      <Badge variant={config.variant} className="mb-3 rounded-md text-xs font-normal">
        <Icon className="mr-1 size-3" />
        {config.label}
      </Badge>
      <p className="line-clamp-2 font-medium text-foreground">{activity.title}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        {formatRelativeTime(activity.timestamp)}
      </p>
    </button>
  );
}
