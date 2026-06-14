"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { useWorkspaceStore } from "@/lib/stores/workspace-store";
import { SearchIcon } from "lucide-react";
import { toast } from "sonner";

const EXAMPLE_PROMPTS = [
  "Summarize my AML literature",
  "Find gaps in my notes",
  "Generate experiment ideas",
];

interface WorkspaceSearchInputProps {
  id?: string;
  className?: string;
  onSubmit?: (query: string) => void;
}

export function WorkspaceSearchInput({
  id = "workspace-search",
  className,
  onSubmit,
}: WorkspaceSearchInputProps) {
  const [query, setQuery] = React.useState("");
  const openNavTab = useWorkspaceStore((s) => s.openNavTab);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (onSubmit) {
      onSubmit(query.trim());
    } else {
      openNavTab("search");
      toast.info("Workspace search coming soon", {
        description: query.trim(),
      });
    }
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            id={id}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask your workspace anything..."
            className="h-14 rounded-[10px] pl-12 text-base"
          />
        </div>
      </form>
      <div className="mt-4 flex flex-wrap gap-2">
        {EXAMPLE_PROMPTS.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => setQuery(example)}
            className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground transition-colors duration-150 hover:border-primary/30 hover:text-foreground"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}
