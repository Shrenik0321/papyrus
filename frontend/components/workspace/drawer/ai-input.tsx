"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function AiInput() {
  const [value, setValue] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const insertToken = (token: string) => {
    setValue((prev) => (prev ? `${prev} ${token}` : token));
    textareaRef.current?.focus();
  };

  const handleSubmit = () => {
    if (!value.trim()) return;
    toast.info("AI responses coming soon", { description: value.trim() });
    setValue("");
  };

  return (
    <div className="shrink-0 border-t border-border p-4">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        placeholder="Ask anything..."
        className="min-h-[80px] resize-none rounded-[10px] text-sm"
      />
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <Badge
            variant="secondary"
            className="cursor-pointer rounded-md text-xs font-normal"
            onClick={() => insertToken("@paper")}
          >
            @paper
          </Badge>
          <Badge
            variant="secondary"
            className="cursor-pointer rounded-md text-xs font-normal"
            onClick={() => insertToken("#note")}
          >
            #note
          </Badge>
          <Badge
            variant="secondary"
            className="cursor-pointer rounded-md text-xs font-normal"
            onClick={() => insertToken("/commands")}
          >
            /commands
          </Badge>
        </div>
        <Button size="sm" onClick={handleSubmit} disabled={!value.trim()}>
          Send
        </Button>
      </div>
    </div>
  );
}
