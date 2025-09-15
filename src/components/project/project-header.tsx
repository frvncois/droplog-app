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
  MoreHorizontal, 
  Settings, 
  Share,
  Plus,
  Archive,
  Users,
} from "lucide-react";
import { 
  Project, 
  getTasksByProjectId, 
} from "@/lib/utils/dummy-data";

interface ProjectHeaderProps {
  project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const projectTasks = getTasksByProjectId(project.id);

  return (
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-0">
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-semibold tracking-tight">{project.title}</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              {project.description || "No description available for this project."}
            </p>
          </div>
          <div className="space-y-0">
          <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Quick add
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Create task
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                Create event
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                Add asset
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                Add content
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
            <Button variant="default" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Editor
            </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Project Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Project Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                Manage Team
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Archive className="mr-2 h-4 w-4" />
                Archive Project
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
          </div>
        </div>
      </div>
  );
}