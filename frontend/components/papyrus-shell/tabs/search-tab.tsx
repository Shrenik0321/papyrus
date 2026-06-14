"use client";

import { WorkspaceSearchInput } from "../shared/workspace-search-input";
import { toast } from "sonner";

export function SearchTab() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8">
      <div className="w-full max-w-xl">
        <h2 className="mb-6 text-center font-heading text-2xl font-semibold">
          Research Workspace Search
        </h2>
        <WorkspaceSearchInput
          id="workspace-search-tab"
          onSubmit={(query) =>
            toast.info("Workspace search coming soon", { description: query })
          }
        />
      </div>
    </div>
  );
}
