"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Paper, PaperAvailability } from "@/lib/mock/types";
import { cn } from "@/lib/utils";
import {
  FileTextIcon,
  MessageSquareIcon,
  PlusIcon,
  SparklesIcon,
} from "lucide-react";
import { toast } from "sonner";

const AVAILABILITY_LABELS: Record<PaperAvailability, string> = {
  open_access: "Open Access",
  paywall: "Paywall",
  preprint: "Preprint",
};

const AVAILABILITY_VARIANT: Record<
  PaperAvailability,
  "default" | "secondary" | "outline"
> = {
  open_access: "default",
  preprint: "secondary",
  paywall: "outline",
};

function formatLastViewed(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

interface PaperCardProps {
  paper: Paper;
  onOpen: () => void;
}

export function PaperCard({ paper, onOpen }: PaperCardProps) {
  return (
    <div
      className={cn(
        "group relative rounded-xl border border-border bg-card p-4 transition-colors duration-150",
        "hover:border-primary/20 hover:shadow-sm",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-medium leading-snug text-foreground">{paper.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {paper.authors.slice(0, 3).join(", ")}
            {paper.authors.length > 3 ? " et al." : ""} · {paper.year}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge
              variant={AVAILABILITY_VARIANT[paper.availability]}
              className="rounded-md text-xs font-normal"
            >
              {AVAILABILITY_LABELS[paper.availability]}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Viewed {formatLastViewed(paper.lastViewedAt)}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={onOpen}
        >
          <FileTextIcon className="size-4" />
        </Button>
      </div>

      <div className="mt-3 flex gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        <Button size="xs" variant="secondary" onClick={onOpen}>
          Open
        </Button>
        <Button
          size="xs"
          variant="ghost"
          onClick={() => toast.info("Chat with paper coming soon")}
        >
          <MessageSquareIcon className="size-3" />
          Chat
        </Button>
        <Button
          size="xs"
          variant="ghost"
          onClick={() => toast.info("Summarize coming soon")}
        >
          <SparklesIcon className="size-3" />
          Summarize
        </Button>
        <Button
          size="xs"
          variant="ghost"
          onClick={() => toast.info("Add note coming soon")}
        >
          <PlusIcon className="size-3" />
          Add Note
        </Button>
      </div>
    </div>
  );
}
