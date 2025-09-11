"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  LayoutDashboard,
  FolderOpen,
  CheckSquare,
  FileImage,
  Users,
  Settings,
  FileText,
  Plug,
  Plus,
  Calendar,
  Circle,
  ChevronRight,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { NavSecondary } from "@/components/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { getActiveProjects } from "@/lib/utils/dummy-data"

// This is sample data for the sidebar
const data = {
  user: {
    name: "Current User",
    email: "user@droplog.com",
    avatar: "/avatars/current-user.png",
  },
  teams: [
    {
      name: "Droplog",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Workspace",
      url: "/app/workspace",
      icon: LayoutDashboard,
    },
    {
      title: "Projects",
      url: "/app/projects",
      icon: FolderOpen,
    },
    {
      title: "Tasks",
      url: "/app/tasks",
      icon: CheckSquare,
    },
    {
      title: "Assets",
      url: "/app/assets",
      icon: FileImage,
    },
    {
      title: "Team",
      url: "/app/team",
      icon: Users,
    },
  ],
  navSecondary: [
    {
      title: "Documentation",
      url: "/app/documentation",
      icon: FileText,
    },
    {
      title: "Integrations",
      url: "/app/integrations",
      icon: Plug,
    },
    {
      title: "Settings",
      url: "/app/settings",
      icon: Settings,
    },
  ],
  projects: getActiveProjects().slice(0, 5).map(project => ({
    name: project.title,
    url: `/app/projects/${project.id}`,
    icon: Circle,
    status: project.status,
    tasksCount: project.tasksCount,
  })),
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}