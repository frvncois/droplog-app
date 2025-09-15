"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Settings,
  Plug,
  Bell,
  Users,
} from "lucide-react";

export function ProjectsHeader() {

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-0">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
          </div>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Manage and organize all your projects in one place
          </p>
        </div>
        <div className="space-y-0">
          <div className="flex items-center space-x-2">
<Button
  variant="default"
  size="sm"
  onClick={() => console.log('Create project clicked')}
>
  <Plus className="h-4 w-4 mr-2" />
  Create project
</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Projects settings</DropdownMenuLabel>
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
                  Authorisations
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}