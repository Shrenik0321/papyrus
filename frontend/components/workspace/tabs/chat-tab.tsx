"use client";

import { useActiveTab } from "@/lib/stores/workspace-store";
import { getChatById } from "@/lib/mock/chats";
import { MessageSquareIcon } from "lucide-react";

export function ChatTab() {
  const activeTab = useActiveTab();
  const chatId = activeTab?.meta?.chatId as string | undefined;
  const chat = chatId ? getChatById(chatId) : undefined;
  const title = chat?.title ?? activeTab?.title ?? "Chat";

  return (
    <div className="flex h-full flex-col items-center justify-center px-8">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-xl bg-muted">
          <MessageSquareIcon className="size-7 text-muted-foreground" />
        </div>
        <h2 className="font-heading text-xl font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Chat UI coming soon
        </p>
      </div>
    </div>
  );
}
