"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRightIcon } from "lucide-react";

interface InsightSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function InsightSection({
  title,
  children,
  defaultOpen = true,
}: InsightSectionProps) {
  return (
    <Collapsible defaultOpen={defaultOpen}>
      <CollapsibleTrigger className="flex w-full items-center gap-1.5 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground [&[data-state=open]>svg]:rotate-90">
        <ChevronRightIcon className="size-3.5 transition-transform duration-150" />
        {title}
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 pb-3 text-sm leading-relaxed text-foreground">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
