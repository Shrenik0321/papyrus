"use client";

import { Button } from "@/components/ui/button";
import {
  useWorkspaceStore,
  type TabType,
  type WorkspaceTab,
} from "@/lib/stores/workspace-store";
import { cn } from "@/lib/utils";
import {
  FileTextIcon,
  HomeIcon,
  LibraryIcon,
  ListTodoIcon,
  MessageSquareIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
  StickyNoteIcon,
  XIcon,
  type LucideIcon,
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const TAB_ICONS: Record<TabType, LucideIcon> = {
  home: HomeIcon,
  library: LibraryIcon,
  search: SearchIcon,
  paper: FileTextIcon,
  note: StickyNoteIcon,
  chat: MessageSquareIcon,
  novelty: SparklesIcon,
  plan: ListTodoIcon,
};

function TabItem({
  tab,
  isActive,
  onSelect,
  onClose,
}: {
  tab: WorkspaceTab;
  isActive: boolean;
  onSelect: () => void;
  onClose: () => void;
}) {
  const Icon = TAB_ICONS[tab.type] ?? FileTextIcon;

  return (
    <div
      className={cn(
        "group relative flex h-8 max-w-[220px] min-w-0 shrink-0",
        isActive && "z-10",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "flex h-full w-full min-w-0 items-center gap-2 rounded-t-[10px] border px-3 text-sm transition-all duration-200",
          tab.closable && "pr-7",
          isActive
            ? "border-border border-b-accent bg-accent font-medium text-accent-foreground shadow-sm"
            : "border-transparent bg-muted/50 text-muted-foreground hover:border-border/60 hover:bg-muted/80 hover:text-foreground",
        )}
      >
        <Icon
          className={cn(
            "size-3.5 shrink-0",
            isActive ? "text-accent-foreground" : "text-muted-foreground",
          )}
        />
        <span className="truncate">{tab.title}</span>
      </button>
      {tab.closable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className={cn(
            "absolute right-1.5 top-1/2 flex size-4 -translate-y-1/2 items-center justify-center rounded-sm transition-all duration-150",
            "text-muted-foreground hover:bg-foreground/10 hover:text-foreground",
            isActive
              ? "opacity-70 hover:opacity-100"
              : "opacity-0 group-hover:opacity-70 group-hover:hover:opacity-100",
          )}
          aria-label={`Close ${tab.title}`}
        >
          <XIcon className="size-3" />
        </button>
      )}
    </div>
  );
}

export function TabBar() {
  const tabs = useWorkspaceStore((s) => s.tabs);
  const activeTabId = useWorkspaceStore((s) => s.activeTabId);
  const setActiveTab = useWorkspaceStore((s) => s.setActiveTab);
  const closeTab = useWorkspaceStore((s) => s.closeTab);
  const addNewTab = useWorkspaceStore((s) => s.addNewTab);
  const drawerOpen = useWorkspaceStore((s) => s.drawerOpen);
  const drawerMobileOpen = useWorkspaceStore((s) => s.drawerMobileOpen);
  const setDrawerOpen = useWorkspaceStore((s) => s.setDrawerOpen);
  const setDrawerMobileOpen = useWorkspaceStore((s) => s.setDrawerMobileOpen);

  const isAssistantOpen = drawerOpen || drawerMobileOpen;

  const handleToggleAssistant = () => {
    if (isAssistantOpen) {
      setDrawerOpen(false);
      setDrawerMobileOpen(false);
    } else {
      setDrawerOpen(true);
      setDrawerMobileOpen(true);
    }
  };

  return (
    <div className="flex h-10 shrink-0 items-end border-b border-border bg-card/80">
      <ScrollArea className="min-w-0 flex-1">
        <div className="flex h-10 items-end gap-1 px-2 pt-1">
          {tabs.map((tab) => (
            <TabItem
              key={tab.id}
              tab={tab}
              isActive={tab.id === activeTabId}
              onSelect={() => setActiveTab(tab.id)}
              onClose={() => closeTab(tab.id)}
            />
          ))}
          <button
            type="button"
            onClick={addNewTab}
            className="mb-0.5 flex size-7 shrink-0 items-center justify-center rounded-[8px] text-muted-foreground transition-colors duration-150 hover:bg-muted/80 hover:text-foreground"
            aria-label="New tab"
          >
            <PlusIcon className="size-4" />
          </button>
        </div>
        <ScrollBar orientation="horizontal" className="h-1.5" />
      </ScrollArea>

      <div className="flex shrink-0 items-center self-stretch border-l border-border px-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleToggleAssistant}
          aria-label={isAssistantOpen ? "Close AI assistant" : "Open AI assistant"}
          aria-pressed={isAssistantOpen}
          className={cn(
            isAssistantOpen && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
          )}
        >
          <SparklesIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
