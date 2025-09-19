// components/project/project-header.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Settings,
  Share,
  Plus,
  Calendar,
  FileImage,
  FileText,
} from "lucide-react";
import { useProject } from "@/hooks/use-projects";

interface ProjectHeaderProps {
  projectId: string; // Changed from project?: Project
}

export function ProjectHeader({ projectId }: ProjectHeaderProps) {
  const { project, isLoading, error } = useProject(projectId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-between">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-9 bg-gray-200 rounded w-24"></div>
          <div className="h-9 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">Error loading project: {error}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <p className="text-yellow-600">Project not found</p>
      </div>
    );
  }

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
                <Calendar className="mr-2 h-4 w-4" />
                Create event
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileImage className="mr-2 h-4 w-4" />
                Add asset
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
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