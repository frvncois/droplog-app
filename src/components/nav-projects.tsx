"use client"

import { type LucideIcon, MoreHorizontal, Plus } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

export function NavProjects({
  projects,
}: {
  projects: {
    name: string
    url: string
    icon: LucideIcon
    status?: string
    tasksCount?: number
  }[]
}) {
  const { isMobile } = useSidebar()
  const pathname = usePathname()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Active Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => {
          const isActive = pathname.includes(item.url)
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild tooltip={item.name} isActive={isActive}>
                <Link href={item.url}>
                  <span className="truncate">{item.name}</span>
                </Link>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem>
                    <span>View Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Project Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <span>Add Task</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          )
        })}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70" asChild>
            <Link href="/app/projects/new">
              <Plus className="text-sidebar-foreground/70" />
              <span>New Project</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}