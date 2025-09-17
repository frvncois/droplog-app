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
} from "@/lib/utils/dummy-data";

interface ProjectHeaderProps {
  project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {

  return (
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center">
              <h1 className="text-3xl font-semibold tracking-tight">{project.title}</h1>
            </div>
            <p className="text-muted-foreground text-sm">
              {project.description || "No description available for this project."}
            </p>
          </div>
          <div>
          <div className="flex items-center gap-4">
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
        </div>
          </div>
        </div>
  );
}