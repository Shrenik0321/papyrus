import { create } from "zustand";

export interface OpenChatTab {
  id: string;
  title: string;
}

function generateChatId(): string {
  return `chat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function truncateTitle(title: string, max = 24): string {
  return title.length > max ? `${title.slice(0, max)}…` : title;
}

interface ChatState {
  openTabs: OpenChatTab[];
  activeTabId: string | null;
  openChat: (chat: { id: string; title: string }) => void;
  closeChatTab: (tabId: string) => void;
  setActiveChatTab: (tabId: string) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  openTabs: [],
  activeTabId: null,

  openChat: (chat) => {
    const { openTabs } = get();
    const existing = openTabs.find((t) => t.id === chat.id);
    if (existing) {
      set({ activeTabId: chat.id });
      return;
    }

    set((state) => ({
      openTabs: [
        ...state.openTabs,
        { id: chat.id, title: truncateTitle(chat.title) },
      ],
      activeTabId: chat.id,
    }));
  },

  closeChatTab: (tabId) => {
    const { openTabs, activeTabId } = get();
    const newTabs = openTabs.filter((t) => t.id !== tabId);
    let newActiveId = activeTabId;

    if (activeTabId === tabId) {
      const closedIndex = openTabs.findIndex((t) => t.id === tabId);
      newActiveId =
        newTabs[closedIndex]?.id ?? newTabs[closedIndex - 1]?.id ?? null;
    }

    set({ openTabs: newTabs, activeTabId: newActiveId });
  },

  setActiveChatTab: (tabId) => set({ activeTabId: tabId }),

  reset: () => set({ openTabs: [], activeTabId: null }),
}));
