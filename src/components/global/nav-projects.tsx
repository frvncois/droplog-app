"use client"

import { type LucideIcon, MoreHorizontal, Plus, ExternalLink, LayoutDashboard, CheckSquare, FileText, FileImage, BookOpen } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
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

const projectMenuItems = [
  {
    name: "Overview",
    path: "",
    icon: LayoutDashboard,
  },
  {
    name: "Tasks", 
    path: "/tasks",
    icon: CheckSquare,
  },
  {
    name: "Assets",
    path: "/assets",
    icon: FileImage,
  },
  {
    name: "Content",
    path: "/content", 
    icon: FileText,
  },
  {
    name: "Documentation",
    path: "/documentation",
    icon: BookOpen,
  }
]

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
  const router = useRouter()

  const handleNavigateToProject = (projectUrl: string, path: string) => {
    const fullUrl = path === "" ? projectUrl : `${projectUrl}${path}`
    router.push(fullUrl)
  }

  const handleOpenInEditor = (projectUrl: string) => {
    // TODO: Implement open in editor logic
    console.log("Open in editor:", projectUrl)
  }

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
                  <DropdownMenuItem 
                    onClick={() => handleOpenInEditor(item.url)}
                    className="gap-4 p-2"
                  >
                    <ExternalLink className="size-4" />
                    <span>Open in Editor</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {projectMenuItems.map((menuItem) => {
                    const IconComponent = menuItem.icon
                    return (
                      <DropdownMenuItem
                        key={menuItem.name}
                        onClick={() => handleNavigateToProject(item.url, menuItem.path)}
                        className="gap-4 p-2"
                      >
                        <IconComponent className="size-4" />
                        <span>{menuItem.name}</span>
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          )
        })}
        <SidebarMenuItem>
          <SidebarMenuButton
            className="text-sidebar-foreground/70"
            onClick={() => console.log('Create project - not implemented')}
          >
            <Plus className="text-sidebar-foreground/70" />
            <span>New Project</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}