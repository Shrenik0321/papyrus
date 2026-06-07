"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { isAdmin } from "@/modules/users/constants/user-role.constants"
import { useCurrentUser } from "@/modules/users/hooks/useCurrentUser"
import { UsersIcon, LayoutDashboardIcon, GalleryVerticalEndIcon } from "lucide-react"

const teams = [
  {
    name: "Papyrus",
    logo: <GalleryVerticalEndIcon />,
    plan: "Enterprise",
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: currentUser } = useCurrentUser()
  const canManageUsers = isAdmin(currentUser?.role)

  const navMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Users",
      url: "/users",
      icon: <UsersIcon />,
      isActive: true,
      items: [
        {
          title: "All Users",
          url: "/users",
        },
        ...(canManageUsers
          ? [
              {
                title: "Create New User",
                url: "/users/create",
              },
            ]
          : []),
      ],
    },
  ]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
