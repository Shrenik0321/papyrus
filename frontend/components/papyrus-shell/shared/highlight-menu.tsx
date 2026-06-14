"use client";

import { Button } from "@/components/ui/button";
import {
  BookmarkIcon,
  HelpCircleIcon,
  ListPlusIcon,
  SparklesIcon,
} from "lucide-react";

interface HighlightMenuProps {
  position: { x: number; y: number };
  selectedText: string;
  onSaveInsight: (text: string) => void;
  onClose: () => void;
}

export function HighlightMenu({
  position,
  selectedText,
  onSaveInsight,
  onClose,
}: HighlightMenuProps) {
  return (
    <div
      className="fixed z-50 flex items-center gap-0.5 rounded-xl border border-border bg-card p-1 shadow-md"
      style={{
        left: position.x,
        top: position.y - 48,
        transform: "translateX(-50%)",
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <Button
        size="xs"
        variant="ghost"
        onClick={() => {
          onSaveInsight(selectedText);
          onClose();
        }}
      >
        <BookmarkIcon className="size-3" />
        Save Insight
      </Button>
      <Button
        size="xs"
        variant="ghost"
        onClick={() => {
          onClose();
        }}
      >
        <HelpCircleIcon className="size-3" />
        Explain
      </Button>
      <Button
        size="xs"
        variant="ghost"
        onClick={() => onClose()}
      >
        <SparklesIcon className="size-3" />
        Summarize
      </Button>
      <Button
        size="xs"
        variant="ghost"
        onClick={() => onClose()}
      >
        <ListPlusIcon className="size-3" />
        Add To Context
      </Button>
    </div>
  );
}
