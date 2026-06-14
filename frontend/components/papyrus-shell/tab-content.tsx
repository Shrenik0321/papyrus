"use client";

import { useActiveTab } from "@/lib/stores/workspace-store";
import { useActiveWorkspaceId } from "@/modules/workspace/hooks/useWorkspace";
import { GlobalHomeTab } from "./tabs/global-home-tab";
import { HomeTab } from "./tabs/home-tab";
import { LibraryTab } from "./tabs/library-tab";
import { SearchTab } from "./tabs/search-tab";
import { PaperTab } from "./tabs/paper-tab";
import { NotesTab } from "./tabs/notes-tab";
import { NoveltyTab } from "./tabs/novelty-tab";

export function TabContent() {
  const activeWorkspaceId = useActiveWorkspaceId();
  const activeTab = useActiveTab();

  if (!activeWorkspaceId) {
    return <GlobalHomeTab />;
  }

  if (!activeTab) return <HomeTab />;

  switch (activeTab.type) {
    case "home":
      return <HomeTab />;
    case "library":
      return <LibraryTab />;
    case "search":
      return <SearchTab />;
    case "paper":
      return <PaperTab />;
    case "note":
      return <NotesTab />;
    case "novelty":
      return <NoveltyTab />;
    default:
      return (
        <div className="flex h-full flex-col items-center justify-center px-8">
          <h2 className="font-heading text-2xl font-semibold">
            {activeTab.title}
          </h2>
          <p className="mt-2 text-muted-foreground">Coming soon</p>
        </div>
      );
  }
}
