"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BotIcon, MessageSquarePlusIcon } from "lucide-react";
import { useChatActions } from "@/modules/chat/hooks/useChatActions";

function MessageBubble({
  role,
  content,
}: {
  role: "user" | "assistant";
  content: string;
}) {
  const isUser = role === "user";

  return (
    <div className={cn("flex gap-2", isUser && "flex-row-reverse")}>
      {!isUser && (
        <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10">
          <BotIcon className="size-3.5 text-primary" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[85%] rounded-[10px] px-3 py-2 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground",
        )}
      >
        {content}
      </div>
    </div>
  );
}

export function ChatPanel() {
  const { activeSession, createNewChat } = useChatActions();

  if (!activeSession) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center px-6 py-12 text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-muted">
          <MessageSquarePlusIcon className="size-6 text-muted-foreground" />
        </div>
        <h3 className="font-heading text-sm font-medium">AI Assistant</h3>
        <p className="mt-1.5 max-w-[240px] text-xs text-muted-foreground">
          Start a new chat or pick one from your history to perform agentic
          tasks on your research.
        </p>
        <Button
          size="sm"
          variant="outline"
          className="mt-4"
          onClick={createNewChat}
        >
          New chat
        </Button>
      </div>
    );
  }

  const messages = activeSession.messages ?? [];

  if (messages.length === 0) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center px-6 py-12 text-center">
        <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-muted">
          <BotIcon className="size-5 text-muted-foreground" />
        </div>
        <h3 className="font-heading text-sm font-medium">
          {activeSession.title}
        </h3>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Ask anything to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-3 p-4">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
      ))}
    </div>
  );
}
