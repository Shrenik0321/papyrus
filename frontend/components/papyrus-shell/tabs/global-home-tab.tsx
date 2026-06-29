"use client";

import { CreateWorkspaceDialog } from "@/components/papyrus-shell/sidebar/create-workspace-dialog";
import {
  useActiveWorkspace,
  useCreateWorkspaceFlow,
} from "@/modules/workspace/hooks/useWorkspace";
import { useCurrentUser } from "@/modules/users/hooks/useCurrentUser";
import { cn } from "@/lib/utils";
import { LayersIcon, PlusIcon } from "lucide-react";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export function GlobalHomeTab() {
  const { data: user } = useCurrentUser();
  const { workspaces, isLoading, selectWorkspace } = useActiveWorkspace();
  const {
    dialogOpen,
    setDialogOpen,
    handleCreateWorkspace,
    isPending,
  } = useCreateWorkspaceFlow();

  const firstName = user?.name?.split(" ")[0] ?? "Researcher";

  const handleSelectWorkspace = (workspaceId: string) => {
    selectWorkspace(workspaceId);
  };

  return (
    <>
      <div className="h-full overflow-auto">
      <div className="mx-auto max-w-4xl px-8 py-10">
        <div className="mb-10">
          <h1 className="font-heading text-4xl font-semibold tracking-tight">
            {getGreeting()}, {firstName}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Choose a workspace to continue your research.
          </p>
        </div>

        <section>
          <h2 className="mb-4 font-heading text-lg font-medium">
            Your Workspaces
          </h2>

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-xl border border-border bg-muted/40"
                />
              ))}
            </div>
          ) : workspaces.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-8 py-12 text-center">
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-muted">
                <LayersIcon className="size-6 text-muted-foreground" />
              </div>
              <h3 className="font-heading text-sm font-medium">
                No workspaces yet
              </h3>
              <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
                Create a workspace from the sidebar to get started with your
                research.
              </p>
              <button
                type="button"
                onClick={() => setDialogOpen(true)}
                className="mt-4 flex items-center gap-2 rounded-[10px] border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              >
                <PlusIcon className="size-4" />
                New workspace
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {workspaces.map((workspace) => (
                <button
                  key={workspace.id}
                  type="button"
                  onClick={() => handleSelectWorkspace(workspace.id)}
                  className={cn(
                    "flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left transition-colors duration-150",
                    "hover:border-primary/30 hover:bg-muted/40",
                  )}
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <LayersIcon className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{workspace.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Open workspace
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>

      <CreateWorkspaceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreateWorkspace}
        isPending={isPending}
      />
    </>
  );
}
