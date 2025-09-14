// components/global/nav-organization.tsx - Cleanded

"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronsUpDown, Building2, Users, FolderOpen, Bell, CreditCard, Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const organizationMenuItems = [
  {
    name: "Overview",
    tab: "overview",
    icon: Building2,
  },
  {
    name: "Team",
    tab: "team", 
    icon: Users,
  },
  {
    name: "Projects",
    tab: "projects",
    icon: FolderOpen,
  },
  {
    name: "Notifications", 
    tab: "notifications",
    icon: Bell,
  },
  {
    name: "Plan & Billing",
    tab: "plan",
    icon: CreditCard,
  },
  {
    name: "Settings",
    tab: "settings",
    icon: Settings,
  }
]

export function NavOrganization({
  organizations,
}: {
  organizations: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const [activeTeam] = React.useState(organizations[0])

  const handleNavigateToOrganization = (tab: string) => {
    router.push(`/app/organization?tab=${tab}`)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <activeTeam.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeTeam.name}
                </span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Organization Pages
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {organizationMenuItems.map((item) => {
              const IconComponent = item.icon
              return (
                <DropdownMenuItem
                  key={item.tab}
                  onClick={() => handleNavigateToOrganization(item.tab)}
                  className="gap-4 p-2">
                  <div className="flex size-6 items-center justify-center">
                    <IconComponent className="size-4 shrink-0" />
                  </div>
                  {item.name}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}