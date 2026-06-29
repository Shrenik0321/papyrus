"use client";

import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { useWorkspaceStore } from "@/lib/stores/workspace-store";
import { cn } from "@/lib/utils";
import {
  ChevronRightIcon,
  MessageSquareIcon,
  PlusIcon,
} from "lucide-react";
import { collapsedSidebarIconClass } from "./sidebar-nav-item";
import { useChatActions } from "@/modules/chat/hooks/useChatActions";

interface SidebarChatsAccordionProps {
  collapsed?: boolean;
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function SidebarChatsAccordion({
  collapsed,
}: SidebarChatsAccordionProps) {
  const [expanded, setExpanded] = React.useState(true);
  const { sessions, activeTabId, selectChat, createNewChat } = useChatActions();
  const setDrawerOpen = useWorkspaceStore((s) => s.setDrawerOpen);
  const setDrawerMobileOpen = useWorkspaceStore((s) => s.setDrawerMobileOpen);

  const openDrawer = () => {
    setDrawerOpen(true);
    setDrawerMobileOpen(true);
  };

  const handleSelectChat = (chat: { id: string; title: string }) => {
    selectChat(chat);
    openDrawer();
  };

  const handleNewChat = () => {
    createNewChat();
    openDrawer();
  };

  const hasActiveChat = activeTabId !== null;

  if (collapsed) {
    return (
      <>
        <div className="my-1 border-t border-border" />
        <button
          type="button"
          title="Chats"
          onClick={() => {
            if (sessions[0]) {
              handleSelectChat({ id: sessions[0].id, title: sessions[0].title });
            } else {
              handleNewChat();
            }
          }}
          className={cn(
            collapsedSidebarIconClass,
            hasActiveChat
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
          )}
        >
          <MessageSquareIcon className="size-4 shrink-0" />
        </button>
      </>
    );
  }

  return (
    <div className="pt-3">
      <Separator className="mb-3" />

      <div className="flex items-center justify-between px-1 pb-1.5">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="group flex min-w-0 flex-1 items-center gap-1.5 rounded-md py-0.5 text-left transition-colors hover:text-foreground"
        >
          <ChevronRightIcon
            className={cn(
              "size-3.5 shrink-0 text-muted-foreground/70 transition-transform duration-200",
              expanded && "rotate-90",
            )}
          />
          <span className="truncate text-[11px] font-medium tracking-wide text-muted-foreground uppercase group-hover:text-foreground">
            Chats
          </span>
        </button>
        <button
          type="button"
          onClick={handleNewChat}
          title="New chat"
          className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
        >
          <PlusIcon className="size-3.5" />
        </button>
      </div>

      {expanded && (
        <div className="space-y-0.5">
          {sessions.length === 0 ? (
            <p className="px-2.5 py-2 text-xs text-muted-foreground">
              No chats yet
            </p>
          ) : (
            sessions.map((chat) => {
              const isActive = activeTabId === chat.id;
              return (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() =>
                    handleSelectChat({ id: chat.id, title: chat.title })
                  }
                  className={cn(
                    "group relative flex w-full items-start gap-2 rounded-[8px] py-1.5 pr-2 pl-2.5 text-left transition-colors duration-150",
                    isActive
                      ? "bg-muted/70 text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                >
                  {isActive && (
                    <span className="absolute top-1.5 bottom-1.5 left-0 w-0.5 rounded-full bg-primary/70" />
                  )}
                  <MessageSquareIcon
                    className={cn(
                      "mt-0.5 size-3.5 shrink-0",
                      isActive
                        ? "text-foreground/70"
                        : "text-muted-foreground/60 group-hover:text-muted-foreground",
                    )}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] leading-snug">
                      {chat.title}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-muted-foreground/80">
                      {formatRelativeTime(chat.lastMessageAt)}
                    </span>
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
