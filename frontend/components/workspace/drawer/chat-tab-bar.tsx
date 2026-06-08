"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useChatStore, type OpenChatTab } from "@/lib/stores/chat-store";
import { cn } from "@/lib/utils";
import { MessageSquareIcon, PlusIcon, XIcon } from "lucide-react";

function ChatTabItem({
  tab,
  isActive,
  onSelect,
  onClose,
}: {
  tab: OpenChatTab;
  isActive: boolean;
  onSelect: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className={cn(
        "group relative flex h-7 max-w-[160px] min-w-0 shrink-0",
        isActive && "z-10",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "flex h-full w-full min-w-0 items-center gap-1.5 rounded-md border px-2 pr-6 text-xs transition-all duration-150",
          isActive
            ? "border-border bg-background font-medium text-foreground shadow-sm"
            : "border-transparent bg-muted/50 text-muted-foreground hover:bg-muted/80 hover:text-foreground",
        )}
      >
        <MessageSquareIcon className="size-3 shrink-0" />
        <span className="truncate">{tab.title}</span>
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className={cn(
          "absolute right-1 top-1/2 flex size-3.5 -translate-y-1/2 items-center justify-center rounded-sm transition-all duration-150",
          "text-muted-foreground hover:bg-foreground/10 hover:text-foreground",
          isActive
            ? "opacity-70 hover:opacity-100"
            : "opacity-0 group-hover:opacity-70 group-hover:hover:opacity-100",
        )}
        aria-label={`Close ${tab.title}`}
      >
        <XIcon className="size-2.5" />
      </button>
    </div>
  );
}

export function ChatTabBar() {
  const openTabs = useChatStore((s) => s.openTabs);
  const activeTabId = useChatStore((s) => s.activeTabId);
  const setActiveChatTab = useChatStore((s) => s.setActiveChatTab);
  const closeChatTab = useChatStore((s) => s.closeChatTab);
  const createNewChat = useChatStore((s) => s.createNewChat);

  return (
    <div className="flex h-9 shrink-0 items-center border-b border-border bg-muted/30 px-2">
      <ScrollArea className="min-w-0 flex-1">
        <div className="flex items-center gap-1 py-1">
          {openTabs.map((tab) => (
            <ChatTabItem
              key={tab.id}
              tab={tab}
              isActive={tab.id === activeTabId}
              onSelect={() => setActiveChatTab(tab.id)}
              onClose={() => closeChatTab(tab.id)}
            />
          ))}
          <button
            type="button"
            onClick={createNewChat}
            className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-muted/80 hover:text-foreground"
            aria-label="New chat"
          >
            <PlusIcon className="size-3.5" />
          </button>
        </div>
        <ScrollBar orientation="horizontal" className="h-1" />
      </ScrollArea>
    </div>
  );
}
