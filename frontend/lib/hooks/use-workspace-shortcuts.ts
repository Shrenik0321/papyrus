"use client";

import * as React from "react";
import { useWorkspaceStore } from "@/lib/stores/workspace-store";

export function useWorkspaceShortcuts() {
  const toggleSidebar = useWorkspaceStore((s) => s.toggleSidebar);
  const toggleDrawer = useWorkspaceStore((s) => s.toggleDrawer);
  const openNavTab = useWorkspaceStore((s) => s.openNavTab);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;

      if (e.key === "k") {
        e.preventDefault();
        openNavTab("search");
        const el = document.getElementById("workspace-search-tab");
        if (el) {
          el.focus();
        } else {
          const homeSearch = document.getElementById("workspace-search");
          homeSearch?.focus();
        }
      } else if (e.key === "b") {
        e.preventDefault();
        toggleSidebar();
      } else if (e.key === ".") {
        e.preventDefault();
        toggleDrawer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar, toggleDrawer, openNavTab]);
}
