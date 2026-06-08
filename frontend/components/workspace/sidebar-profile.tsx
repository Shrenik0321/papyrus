"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/modules/auth/hooks/useAuth";
import { useCurrentUser } from "@/modules/users/hooks/useCurrentUser";
import { ChevronsUpDownIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

interface SidebarProfileProps {
  collapsed?: boolean;
}

export function SidebarProfile({ collapsed }: SidebarProfileProps) {
  const router = useRouter();
  const { data: user, isPending } = useCurrentUser();
  const logout = useLogout();

  const displayName = user?.name ?? "User";
  const displayEmail = user?.email ?? "";
  const avatar = user?.image ?? "";

  const handleSignOut = async () => {
    await logout.mutateAsync();
    router.push("/sign-in");
    router.refresh();
  };

  if (isPending) {
    return (
      <div
        className={cn(
          "flex items-center justify-center py-1.5",
          !collapsed && "px-2 text-sm text-muted-foreground",
        )}
      >
        {collapsed ? (
          <div className="size-8 animate-pulse rounded-lg bg-muted" />
        ) : (
          "Loading…"
        )}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex w-full items-center gap-2 rounded-[10px] text-left transition-colors duration-200 outline-none hover:bg-muted/60",
          collapsed ? "size-9 justify-center p-0" : "p-2",
        )}
      >
        <Avatar
          className={cn("shrink-0 rounded-lg", collapsed ? "size-8" : "size-8")}
        >
          <AvatarImage src={avatar || undefined} alt={displayName} />
          <AvatarFallback className="rounded-lg text-xs">
            {initials(displayName)}
          </AvatarFallback>
        </Avatar>
        {!collapsed && (
          <>
            <div className="grid min-w-0 flex-1 text-sm leading-tight">
              <span className="truncate font-medium">{displayName}</span>
              <span className="truncate text-xs text-muted-foreground">
                {displayEmail}
              </span>
            </div>
            <ChevronsUpDownIcon className="size-4 shrink-0 text-muted-foreground" />
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-xl">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-2">
            <Avatar className="size-8 rounded-lg">
              <AvatarImage src={avatar || undefined} alt={displayName} />
              <AvatarFallback className="rounded-lg text-xs">
                {initials(displayName)}
              </AvatarFallback>
            </Avatar>
            <div className="grid text-sm leading-tight">
              <span className="font-medium">{displayName}</span>
              <span className="text-xs text-muted-foreground">
                {displayEmail}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOutIcon className="size-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
