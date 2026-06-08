"use client";

import { ActivityCard } from "@/components/workspace/shared/activity-card";
import { WorkspaceSearchInput } from "@/components/workspace/shared/workspace-search-input";
import { SkeletonActivityGrid } from "@/components/loader";
import { useWorkspaceStore } from "@/lib/stores/workspace-store";
import { useRecentActivity } from "@/modules/research/hooks/useActivities";
import { useCurrentUser } from "@/modules/users/hooks/useCurrentUser";
import { getPaperById } from "@/lib/mock/papers";
import { getNoteById } from "@/lib/mock/notes";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export function HomeTab() {
  const { data: user } = useCurrentUser();
  const { data: activities, isLoading } = useRecentActivity();
  const openPaperTab = useWorkspaceStore((s) => s.openPaperTab);
  const openNoteTab = useWorkspaceStore((s) => s.openNoteTab);
  const openNoveltyTab = useWorkspaceStore((s) => s.openNoveltyTab);

  const firstName = user?.name?.split(" ")[0] ?? "Researcher";

  const handleActivityClick = (type: string, refId: string, title: string) => {
    if (type === "paper") {
      openPaperTab({ id: refId, title: getPaperById(refId)?.title ?? title });
    } else if (type === "note") {
      openNoteTab({ id: refId, title: getNoteById(refId)?.title ?? title });
    } else {
      openNoveltyTab();
    }
  };

  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto max-w-4xl px-8 py-10">
        <div className="mb-10">
          <h1 className="font-heading text-4xl font-semibold tracking-tight">
            {getGreeting()}, {firstName}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Continue your research.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="mb-4 font-heading text-lg font-medium">
            Recent Activity
          </h2>
          {isLoading ? (
            <SkeletonActivityGrid count={3} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activities?.slice(0, 6).map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onClick={() =>
                    handleActivityClick(
                      activity.type,
                      activity.refId,
                      activity.title,
                    )
                  }
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 font-heading text-lg font-medium">
            Research Workspace Search
          </h2>
          <WorkspaceSearchInput />
        </section>
      </div>
    </div>
  );
}
