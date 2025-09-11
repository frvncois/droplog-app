import { WorkspaceOverview } from "@/components/workspace/workspace-overview";
import { TasksPreview } from "@/components/workspace/tasks-preview";
import { ProjectsPreview } from "@/components/workspace/projects-preview";
import { ActivityFeed } from "@/components/workspace/activity-feed";

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Upload, 
  Search, 
  Filter, 
  Plug,
  Bell,
  Users,
  Plus,
  Settings,
  ArrowUpDown, 
  Grid3X3, 
  List,
  Download,
  MoreHorizontal 
} from 'lucide-react'

export default function WorkspacePage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between">
          <div className="space-y-0">
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-semibold tracking-tight">Welcome back!</h1>
            </div>
            <p className="text-muted-foreground text-sm max-w-2xl">
             Here's what's happening with your projects today.
            </p>
          </div>

        <div className="space-y-0">
          <div className="flex items-center space-x-2">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" size="sm">
                <Plus className="h-4 w-4" />
                Quick add
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Plug className="mr-2 h-4 w-4" />
                New project
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                Add task
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                Set event
              </DropdownMenuItem>
                            <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                Create content
              </DropdownMenuItem>
                            <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                Add asset
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Account settings</DropdownMenuLabel>
              <DropdownMenuSeparator/>
              <DropdownMenuItem>
                <Plug className="mr-2 h-4 w-4" />
                Integrations
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                Authorizations
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        </div>
      </div>

      {/* Overview Stats */}
      <WorkspaceOverview />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Tasks and Projects */}
        <div className="lg:col-span-2 space-y-8">
          <TasksPreview />
          <ProjectsPreview />
        </div>

        {/* Right Column - Activity Feed */}
        <div className="lg:col-span-1">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}