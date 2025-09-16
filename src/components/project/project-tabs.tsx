// components/projects/project-tabs.tsx
"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectOverview } from "./project-overview";
import { ProjectTasksList } from "./project-tasks-list";
import { ProjectAssetsList } from "./project-assets-list";
import { ProjectContentList } from "./project-content-list";
import { ProjectTeamList } from "./project-team-list";
import { ProjectDocumentation } from '@/components/project/project-documentation'
import { ProjectTimeline } from "./project-timeline";
import { ProjectSettings } from "./project-settings";
import { 
  FileText, 
  CheckSquare, 
  FileImage,
  FolderCode,
  Calendar,
  Users, 
  Trash,
  Settings,
  LayoutDashboard
} from "lucide-react";
import { Project } from "@/lib/utils/dummy-data";

interface ProjectTabsProps {
  project: Project;
  currentUserId?: string; // Add currentUserId prop
}

export function ProjectTabs({ project, currentUserId = "u1" }: ProjectTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="flex w-full gap-10">
        <TabsTrigger value="overview" className="flex items-center space-x-2">
          <LayoutDashboard className="h-4 w-4" />
          <span>Overview</span>
        </TabsTrigger>
        <TabsTrigger value="timeline" className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>Timeline</span>
        </TabsTrigger>
        <TabsTrigger value="tasks" className="flex items-center space-x-2">
          <CheckSquare className="h-4 w-4" />
          <span>Tasks</span>
        </TabsTrigger>
        <TabsTrigger value="assets" className="flex items-center space-x-2">
          <FileImage className="h-4 w-4" />
          <span>Assets</span>
        </TabsTrigger>
        <TabsTrigger value="content" className="flex items-center space-x-2">
          <FileText className="h-4 w-4" />
          <span>Content</span>
        </TabsTrigger>
        <TabsTrigger value="documentation" className="flex items-center space-x-2">
          <FolderCode className="h-4 w-4" />
          <span>Documentation</span>
        </TabsTrigger>
        

        <DropdownMenu>
            <DropdownMenuTrigger asChild className="ml-auto">
              <Button variant="default" size="xs">
                <Settings className="h-4 w-4" />
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
              <DropdownMenuItem className="text-red-600">
                <Trash className="mr-2 h-4 w-4 text-red-600" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </TabsList>

      <TabsContent value="overview">
        <ProjectOverview project={project} />
      </TabsContent>

      <TabsContent value="tasks">
        <ProjectTasksList project={project} />
      </TabsContent>

      <TabsContent value="assets">
        <ProjectAssetsList project={project} />
      </TabsContent>

      <TabsContent value="content">
        <ProjectContentList project={project} />
      </TabsContent>

      <TabsContent value="team">
        <ProjectTeamList project={project} />
      </TabsContent>

      <TabsContent value="documentation">
        <ProjectDocumentation project={project} />
      </TabsContent>

      <TabsContent value="timeline">
        <ProjectTimeline
          project={project}
          currentUserId={currentUserId}
        />
      </TabsContent>

      <TabsContent value="settings">
        <ProjectSettings project={project} />
      </TabsContent>
    </Tabs>
  );
}