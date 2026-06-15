"use client";

import { cn } from "@/lib/utils";
import {
  FileStackIcon,
  FileTextIcon,
  StickyNoteIcon,
} from "lucide-react";
import * as React from "react";

export type LibraryContentFilter = "all" | "papers" | "notes";

const CONTENT_FILTERS: {
  value: LibraryContentFilter;
  label: string;
  icon: typeof FileTextIcon;
}[] = [
  { value: "all", label: "All", icon: FileStackIcon },
  { value: "papers", label: "Papers", icon: FileTextIcon },
  { value: "notes", label: "Notes", icon: StickyNoteIcon },
];

function SegmentButton({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-sm font-medium transition-colors duration-150",
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}

type LibraryContentFilterBarProps = {
  value: LibraryContentFilter;
  onChange: (value: LibraryContentFilter) => void;
  counts: {
    all: number;
    papers: number;
    notes: number;
  };
  trailing?: React.ReactNode;
};

export function LibraryContentFilterBar({
  value,
  onChange,
  counts,
  trailing,
}: LibraryContentFilterBarProps) {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-3">
      <div className="flex rounded-[10px] bg-muted/60 p-0.5">
        {CONTENT_FILTERS.map(({ value: filterValue, label, icon: Icon }) => (
          <SegmentButton
            key={filterValue}
            active={value === filterValue}
            onClick={() => onChange(filterValue)}
          >
            <Icon className="size-3.5" />
            {label}
            <span className="text-xs text-muted-foreground">
              {filterValue === "all"
                ? counts.all
                : filterValue === "papers"
                  ? counts.papers
                  : counts.notes}
            </span>
          </SegmentButton>
        ))}
      </div>
      {trailing}
    </div>
  );
}
