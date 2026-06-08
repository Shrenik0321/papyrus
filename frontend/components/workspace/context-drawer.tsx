"use client";

import { cn } from "@/lib/utils";
import { SparklesIcon } from "lucide-react";
import { AiInput } from "./drawer/ai-input";
import { ChatPanel } from "./drawer/chat-panel";
import { ChatTabBar } from "./drawer/chat-tab-bar";

interface ContextDrawerProps {
  className?: string;
}

export function ContextDrawer({ className }: ContextDrawerProps) {
  return (
    <aside
      className={cn(
        "flex h-full w-[380px] shrink-0 flex-col border-l border-border bg-card",
        className,
      )}
    >
      <div className="flex h-10 shrink-0 items-center border-b border-border px-4">
        <div className="flex items-center gap-2">
          <SparklesIcon className="size-4 text-primary" />
          <span className="font-heading text-sm font-medium">AI Assistant</span>
        </div>
      </div>

      <ChatTabBar />

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <ChatPanel />
      </div>

      <AiInput />
    </aside>
  );
}
