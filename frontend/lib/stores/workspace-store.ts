import { create } from "zustand";
import { workspaceTabStateEqual } from "@/lib/workspace-url";

export type TabType =
  | "home"
  | "library"
  | "search"
  | "paper"
  | "note"
  | "chat"
  | "novelty"
  | "plan";

export interface WorkspaceTab {
  id: string;
  type: TabType;
  title: string;
  closable: boolean;
  meta?: Record<string, unknown>;
}

const PINNED_TABS: WorkspaceTab[] = [
  { id: "home", type: "home", title: "Home", closable: false },
  { id: "library", type: "library", title: "Library", closable: false },
];

const HOME_ONLY_TABS: WorkspaceTab[] = [
  { id: "home", type: "home", title: "Home", closable: false },
];

function generateTabId(): string {
  return `tab-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function truncateTitle(title: string, max = 28): string {
  return title.length > max ? `${title.slice(0, max)}…` : title;
}

interface WorkspaceState {
  tabs: WorkspaceTab[];
  activeTabId: string;
  sidebarCollapsed: boolean;
  drawerOpen: boolean;
  sidebarMobileOpen: boolean;
  drawerMobileOpen: boolean;
  openTab: (tab: Omit<WorkspaceTab, "id"> & { id?: string }) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  hydrateWorkspaceTabs: (tabs: WorkspaceTab[], activeTabId: string) => void;
  resetWorkspaceUiForRoute: (workspaceId: string | null) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleDrawer: () => void;
  setDrawerOpen: (open: boolean) => void;
  setSidebarMobileOpen: (open: boolean) => void;
  setDrawerMobileOpen: (open: boolean) => void;
  openNavTab: (type: "home" | "library" | "search") => void;
  openPaperTab: (paper: { id: string; title: string }) => void;
  openNoteTab: (note: { id: string; title: string }) => void;
  openNoveltyTab: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  tabs: PINNED_TABS,
  activeTabId: "home",
  sidebarCollapsed: false,
  drawerOpen: true,
  sidebarMobileOpen: false,
  drawerMobileOpen: false,

  openTab: (tab) => {
    const id = tab.id ?? generateTabId();
    const existing = get().tabs.find(
      (t) =>
        t.id === id ||
        (tab.type !== "paper" &&
          tab.type !== "note" &&
          tab.type !== "chat" &&
          t.type === tab.type &&
          t.title === tab.title),
    );

    if (existing) {
      set({ activeTabId: existing.id });
      return;
    }

    set((state) => ({
      tabs: [...state.tabs, { ...tab, id }],
      activeTabId: id,
    }));
  },

  closeTab: (tabId) => {
    const { tabs, activeTabId } = get();
    const tab = tabs.find((t) => t.id === tabId);
    if (!tab || !tab.closable) return;

    const newTabs = tabs.filter((t) => t.id !== tabId);
    let newActiveId = activeTabId;

    if (activeTabId === tabId) {
      const closedIndex = tabs.findIndex((t) => t.id === tabId);
      const nextTab =
        newTabs[closedIndex] ?? newTabs[closedIndex - 1] ?? newTabs[0];
      newActiveId = nextTab?.id ?? "home";
    }

    set({ tabs: newTabs, activeTabId: newActiveId });
  },

  setActiveTab: (tabId) => set({ activeTabId: tabId }),

  hydrateWorkspaceTabs: (tabs, activeTabId) => {
    const { tabs: currentTabs, activeTabId: currentActiveTabId } = get();
    const nextState = { tabs, activeTabId };
    const currentState = { tabs: currentTabs, activeTabId: currentActiveTabId };

    if (workspaceTabStateEqual(nextState, currentState)) {
      return;
    }

    set(nextState);
  },

  resetWorkspaceUiForRoute: (workspaceId) => {
    if (workspaceId !== null) {
      return;
    }

    set({
      tabs: HOME_ONLY_TABS,
      activeTabId: "home",
      drawerOpen: false,
      drawerMobileOpen: false,
    });
  },

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  toggleDrawer: () => set((state) => ({ drawerOpen: !state.drawerOpen })),

  setDrawerOpen: (open) => set({ drawerOpen: open }),

  setSidebarMobileOpen: (open) => set({ sidebarMobileOpen: open }),

  setDrawerMobileOpen: (open) => set({ drawerMobileOpen: open }),

  openNavTab: (type) => {
    const titles: Record<typeof type, string> = {
      home: "Home",
      library: "Library",
      search: "Search",
    };

    const pinnedId = type === "home" || type === "library" ? type : undefined;

    if (pinnedId) {
      set({ activeTabId: pinnedId });
      return;
    }

    const existing = get().tabs.find((t) => t.type === type);
    if (existing) {
      set({ activeTabId: existing.id });
      return;
    }

    get().openTab({
      type,
      title: titles[type],
      closable: true,
    });
  },

  openPaperTab: (paper) => {
    const existing = get().tabs.find(
      (t) =>
        t.type === "paper" && t.meta?.libraryItemId === paper.id,
    );
    if (existing) {
      set({ activeTabId: existing.id });
      return;
    }
    get().openTab({
      type: "paper",
      title: truncateTitle(paper.title),
      closable: true,
      meta: { libraryItemId: paper.id },
    });
  },

  openNoteTab: (note) => {
    const existing = get().tabs.find(
      (t) => t.type === "note" && t.meta?.libraryItemId === note.id,
    );
    if (existing) {
      set({ activeTabId: existing.id });
      return;
    }
    get().openTab({
      type: "note",
      title: truncateTitle(note.title),
      closable: true,
      meta: { libraryItemId: note.id },
    });
  },

  openNoveltyTab: () => {
    const existing = get().tabs.find((t) => t.type === "novelty");
    if (existing) {
      set({ activeTabId: existing.id });
      return;
    }
    get().openTab({
      type: "novelty",
      title: "Novelty Analysis",
      closable: true,
    });
  },
}));

export function useActiveTab(): WorkspaceTab | undefined {
  return useWorkspaceStore((state) =>
    state.tabs.find((t) => t.id === state.activeTabId),
  );
}
