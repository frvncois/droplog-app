// components/global/app-sidebar.tsx - Cleaned

"use client"

import * as React from "react"
import {
  GalleryVerticalEnd,
  SquareKanban,
  FolderOpen,
  CheckSquare,
  FileImage,
  Users,
  Settings,
  FileText,
  Plug,
  Circle,
} from "lucide-react"

import { NavMain } from "@/components/global/nav-main"
import { NavProjects } from "@/components/global/nav-projects"
import { NavUser } from "@/components/global/nav-user"
import { NavOrganization } from "@/components/global/nav-organization"
import { NavSecondary } from "@/components/global/nav-secondary"
import { ThemeToggle } from "@/components/global/theme-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { getActiveProjects } from "@/lib/utils/dummy-data"

const data = {
  user: {
    name: "Current User",
    email: "user@droplog.com",
    avatar: "/avatars/current-user.png",
  },
  organization: [
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
      icon: SquareKanban,
    },
    {
      title: "Projects",
      url: "/app/projects",
      icon: FolderOpen,
    },
    {
      title: "Timeline",
      url: "/app/timeline",
      icon: FileImage,
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
      title: "Organization",
      url: "/app/organization",
      icon: Users,
    },
  ],
  navSecondary: [
    {
      title: "Help",
      url: "/app/help",
      icon: FileText,
    },
    {
      title: "Integrations",
      url: "/app/integrations",
      icon: Plug,
    },
    {
      title: "Theme",
      component: <ThemeToggle />,
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
        <NavOrganization organizations={data.organization} />
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