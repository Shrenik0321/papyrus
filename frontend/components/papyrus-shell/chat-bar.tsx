"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AiInput } from "./drawer/ai-input";
import { ChatPanel } from "./drawer/chat-panel";
import { useChatStore, type OpenChatTab } from "@/lib/stores/chat-store";
import { useWorkspaceStore } from "@/lib/stores/workspace-store";
import { useBreakpoint } from "@/lib/use-breakpoint";
import { cn } from "@/lib/utils";
import { useActiveWorkspace } from "@/modules/workspace/hooks/useWorkspace";
import { MessageSquareIcon, PlusIcon, SparklesIcon, XIcon } from "lucide-react";
import { useChatActions } from "@/modules/chat/hooks/useChatActions";

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

function ChatTabStrip({
  onNewChat,
}: {
  onNewChat: () => void;
}) {
  const openTabs = useChatStore((s) => s.openTabs);
  const activeTabId = useChatStore((s) => s.activeTabId);
  const setActiveChatTab = useChatStore((s) => s.setActiveChatTab);
  const closeChatTab = useChatStore((s) => s.closeChatTab);

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
            onClick={onNewChat}
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

function ChatBarPanel({
  className,
  onNewChat,
  onSend,
  isSending,
}: {
  className?: string;
  onNewChat: () => void;
  onSend: (content: string) => Promise<void>;
  isSending: boolean;
}) {
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

      <ChatTabStrip onNewChat={onNewChat} />

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <ChatPanel />
      </div>

      <AiInput disabled={isSending} onSend={onSend} />
    </aside>
  );
}

export function ChatBar() {
  const { isMobile, isCompact } = useBreakpoint();

  const drawerOpen = useWorkspaceStore((s) => s.drawerOpen);
  const drawerMobileOpen = useWorkspaceStore((s) => s.drawerMobileOpen);
  const setDrawerOpen = useWorkspaceStore((s) => s.setDrawerOpen);
  const setDrawerMobileOpen = useWorkspaceStore((s) => s.setDrawerMobileOpen);

  const { activeWorkspaceId, isLoading } = useActiveWorkspace();
  const { createNewChat, sendMessage, isSending } = useChatActions();

  const hasWorkspace = Boolean(activeWorkspaceId);

  const showInlineDrawer = hasWorkspace && !isCompact && drawerOpen;
  const showDrawerSheet = hasWorkspace && isCompact && drawerMobileOpen;

  if (isLoading) return null;

  return (
    <>
      {showInlineDrawer && (
        <ChatBarPanel
          onNewChat={createNewChat}
          onSend={sendMessage}
          isSending={isSending}
          className={undefined}
        />
      )}

      <Sheet
        open={showDrawerSheet}
        onOpenChange={(open) => {
          setDrawerMobileOpen(open);
          if (!isCompact) setDrawerOpen(open);
        }}
      >
        <SheetContent
          side={isMobile ? "bottom" : "right"}
          className={isMobile ? "h-[70vh] rounded-t-2xl p-0" : "w-[380px] p-0"}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>AI Assistant</SheetTitle>
          </SheetHeader>
          <ChatBarPanel
            className="w-full border-0"
            onNewChat={createNewChat}
            onSend={sendMessage}
            isSending={isSending}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
