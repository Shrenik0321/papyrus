"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export const collapsedSidebarIconClass =
  "flex size-9 w-full items-center justify-center rounded-[10px] transition-colors duration-150";

interface SidebarNavItemProps {
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  collapsed?: boolean;
  onClick: () => void;
}

export function SidebarNavItem({
  label,
  icon: Icon,
  isActive,
  collapsed,
  onClick,
}: SidebarNavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-sm transition-colors duration-150",
        collapsed && collapsedSidebarIconClass,
        isActive
          ? "bg-accent font-medium text-accent-foreground"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      <Icon className="size-4 shrink-0" />
      {!collapsed && <span>{label}</span>}
    </button>
  );
}
