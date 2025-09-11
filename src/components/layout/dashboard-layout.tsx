"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  FolderOpen,
  CheckSquare,
  FileImage,
  Users,
  Settings,
  FileText,
  Plug,
  Menu,
  Search,
  Bell,
  LogOut,
  Plus,
  Calendar,
  ChevronRight,
  Circle,
  LucideIcon,
} from "lucide-react";
import { projects, getActiveProjects } from "@/lib/utils/dummy-data";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface QuickCreateOption {
  name: string;
  href: string;
  icon: LucideIcon;
}

const navigation: NavItem[] = [
  { name: "Workspace", href: "/app/workspace", icon: LayoutDashboard },
  { name: "Projects", href: "/app/projects", icon: FolderOpen },
  { name: "Tasks", href: "/app/tasks", icon: CheckSquare },
  { name: "Assets", href: "/app/assets", icon: FileImage },
  { name: "Team", href: "/app/team", icon: Users },
  { name: "Documentation", href: "/app/documentation", icon: FileText },
  { name: "Integrations", href: "/app/integrations", icon: Plug },
  { name: "Settings", href: "/app/settings", icon: Settings },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const pathname = usePathname();
  const activeProjects = getActiveProjects();

  const quickCreateOptions: QuickCreateOption[] = [
    { name: "Project", href: "/app/projects/new", icon: FolderOpen },
    { name: "Task", href: "/app/tasks/new", icon: CheckSquare },
    { name: "Event", href: "/app/calendar/new", icon: Calendar },
    { name: "Content", href: "/app/content/new", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 flex flex-col`}>
        <div className="flex h-16 items-center px-6 border-b">
          <Link href="/app/workspace" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">D</span>
            </div>
            <span className="text-xl font-bold">Droplog</span>
          </Link>
        </div>

        {/* Quick Create Button */}
        <div className="px-4 py-4 border-b">
          <DropdownMenu open={quickCreateOpen} onOpenChange={setQuickCreateOpen}>
            <DropdownMenuTrigger asChild>
              <Button className="w-full justify-start" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Quick Create
                <ChevronRight className="ml-auto h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="start" side="right">
              {quickCreateOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <DropdownMenuItem key={option.name} asChild>
                    <Link href={option.href} className="flex items-center">
                      <Icon className="mr-2 h-4 w-4" />
                      {option.name}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.name}
              </Link>
            );
          })}

          {/* Projects Section */}
          <div className="pt-4">
            <div className="flex items-center justify-between px-3 py-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Active Projects
              </h3>
              <Link href="/app/projects">
                <Button variant="ghost" size="sm" className="h-auto p-1">
                  <Plus className="h-3 w-3" />
                </Button>
              </Link>
            </div>
            <div className="space-y-1 mt-2">
              {activeProjects.slice(0, 5).map((project) => {
                const isProjectActive = pathname.includes(`/projects/${project.id}`);
                const statusColor = project.status === 'active' ? 'text-green-500' : 'text-orange-500';
                
                return (
                  <Link
                    key={project.id}
                    href={`/app/projects/${project.id}`}
                    className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors group ${
                      isProjectActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <Circle className={`mr-2 h-2 w-2 fill-current ${statusColor}`} />
                    <span className="truncate flex-1">{project.title}</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {project.tasksCount}
                    </Badge>
                  </Link>
                );
              })}
              {activeProjects.length > 5 && (
                <Link
                  href="/app/projects"
                  className="flex items-center px-3 py-2 text-sm text-muted-foreground hover:text-accent-foreground"
                >
                  <span className="text-xs">View all projects...</span>
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* Bottom section */}
        <div className="border-t p-4 mt-auto">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/avatars/current-user.png" />
              <AvatarFallback>CU</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Current User</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="h-16 bg-background border-b flex items-center px-4 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden mr-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold capitalize">
                {pathname.split('/').pop() || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                  3
                </Badge>
              </Button>

              {/* Quick Create Desktop */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" size="sm" className="hidden sm:flex">
                    <Plus className="h-4 w-4 mr-2" />
                    Create
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48" align="end">
                  {quickCreateOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <DropdownMenuItem key={option.name} asChild>
                        <Link href={option.href} className="flex items-center">
                          <Icon className="mr-2 h-4 w-4" />
                          {option.name}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatars/current-user.png" />
                      <AvatarFallback>CU</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}