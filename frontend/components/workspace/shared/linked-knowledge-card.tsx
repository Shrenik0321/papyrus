"use client";

import { cn } from "@/lib/utils";
import { FileTextIcon, LightbulbIcon, StickyNoteIcon } from "lucide-react";

interface LinkedKnowledgeCardProps {
  title: string;
  items: { label: string; onClick?: () => void }[];
  emptyMessage?: string;
}

export function LinkedKnowledgeCard({
  title,
  items,
  emptyMessage = "None yet",
}: LinkedKnowledgeCardProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {title}
      </h4>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                onClick={item.onClick}
                disabled={!item.onClick}
                className={cn(
                  "flex w-full items-start gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-left text-sm",
                  item.onClick &&
                    "transition-colors hover:border-primary/20 hover:bg-accent/30",
                  !item.onClick && "cursor-default",
                )}
              >
                <LightbulbIcon className="mt-0.5 size-3.5 shrink-0 text-primary" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function RefCard({
  title,
  icon: Icon = FileTextIcon,
  onClick,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-left text-sm",
        onClick && "transition-colors hover:border-primary/20 hover:bg-accent/30",
      )}
    >
      <Icon className="size-3.5 shrink-0 text-muted-foreground" />
      <span className="line-clamp-2">{title}</span>
    </button>
  );
}

export { StickyNoteIcon, FileTextIcon };
