import { getNoteById } from "@/lib/mock/notes";
import { getPaperById } from "@/lib/mock/papers";
import type { WorkspaceTab } from "@/lib/stores/workspace-store";

const PINNED_TABS: WorkspaceTab[] = [
  { id: "home", type: "home", title: "Home", closable: false },
  { id: "library", type: "library", title: "Library", closable: false },
];

function truncateTitle(title: string, max = 28): string {
  return title.length > max ? `${title.slice(0, max)}…` : title;
}

export function getDefaultWorkspaceTabState(): {
  tabs: WorkspaceTab[];
  activeTabId: string;
} {
  return {
    tabs: PINNED_TABS.map((tab) => ({ ...tab })),
    activeTabId: "home",
  };
}

export function tabToToken(tab: WorkspaceTab): string {
  if (tab.type === "paper" && tab.meta?.libraryItemId) {
    return `paper:${String(tab.meta.libraryItemId)}`;
  }

  if (tab.type === "note" && tab.meta?.libraryItemId) {
    return `note:${String(tab.meta.libraryItemId)}`;
  }

  return tab.type;
}

export function tokenToTab(token: string): WorkspaceTab | null {
  if (token === "home") {
    return { id: "home", type: "home", title: "Home", closable: false };
  }

  if (token === "library") {
    return { id: "library", type: "library", title: "Library", closable: false };
  }

  if (token === "search") {
    return { id: "search", type: "search", title: "Search", closable: true };
  }

  if (token === "novelty") {
    return {
      id: "novelty",
      type: "novelty",
      title: "Novelty Analysis",
      closable: true,
    };
  }

  if (token === "settings") {
    return {
      id: "settings",
      type: "settings",
      title: "Settings",
      closable: true,
    };
  }

  const paperMatch = token.match(/^paper:(.+)$/);
  if (paperMatch) {
    const libraryItemId = paperMatch[1];
    const title = getPaperById(libraryItemId)?.title ?? "Paper";
    return {
      id: token,
      type: "paper",
      title: truncateTitle(title),
      closable: true,
      meta: { libraryItemId },
    };
  }

  const noteMatch = token.match(/^note:(.+)$/);
  if (noteMatch) {
    const libraryItemId = noteMatch[1];
    const title = getNoteById(libraryItemId)?.title ?? "Note";
    return {
      id: token,
      type: "note",
      title: truncateTitle(title),
      closable: true,
      meta: { libraryItemId },
    };
  }

  return null;
}

export function serializeWorkspaceTabs(
  tabs: WorkspaceTab[],
  activeTabId: string,
): { tabs: string; active: string } {
  const tokens = tabs.map(tabToToken);
  const activeTab = tabs.find((tab) => tab.id === activeTabId);
  const active = activeTab ? tabToToken(activeTab) : "home";

  return {
    tabs: tokens.join(","),
    active,
  };
}

export function deserializeWorkspaceTabs(
  tabsParam: string | null,
  activeParam: string | null,
): { tabs: WorkspaceTab[]; activeTabId: string } | null {
  if (!tabsParam?.trim()) {
    return null;
  }

  const seen = new Set<string>();
  const tabs: WorkspaceTab[] = [];

  for (const rawToken of tabsParam.split(",")) {
    const token = rawToken.trim();
    if (!token || seen.has(token)) continue;

    const tab = tokenToTab(token);
    if (!tab) continue;

    seen.add(token);
    tabs.push(tab);
  }

  if (tabs.length === 0) {
    return null;
  }

  if (!tabs.some((tab) => tab.id === "home")) {
    tabs.unshift({
      id: "home",
      type: "home",
      title: "Home",
      closable: false,
    });
  }

  if (!tabs.some((tab) => tab.id === "library")) {
    const homeIndex = tabs.findIndex((tab) => tab.id === "home");
    tabs.splice(homeIndex + 1, 0, {
      id: "library",
      type: "library",
      title: "Library",
      closable: false,
    });
  }

  const activeToken = activeParam?.trim();
  const activeTab = activeToken
    ? tabs.find((tab) => tabToToken(tab) === activeToken)
    : undefined;

  return {
    tabs,
    activeTabId: activeTab?.id ?? "home",
  };
}

function tabsEqual(a: WorkspaceTab[], b: WorkspaceTab[]): boolean {
  if (a.length !== b.length) return false;

  return a.every((tab, index) => {
    const other = b[index];
    return (
      tab.id === other.id &&
      tab.type === other.type &&
      tab.title === other.title &&
      tab.closable === other.closable &&
      JSON.stringify(tab.meta ?? {}) === JSON.stringify(other.meta ?? {})
    );
  });
}

export function workspaceTabStateEqual(
  a: { tabs: WorkspaceTab[]; activeTabId: string },
  b: { tabs: WorkspaceTab[]; activeTabId: string },
): boolean {
  return a.activeTabId === b.activeTabId && tabsEqual(a.tabs, b.tabs);
}
