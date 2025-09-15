// components/projects/project-tabs.tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectOverview } from "./project-overview";
import { ProjectTasksList } from "./project-tasks-list";
import { ProjectAssetsList } from "./project-assets-list";
import { ProjectContentList } from "./project-content-list";
import { ProjectTeamList } from "./project-team-list";
import { ProjectDocumentation } from '@/components/project/project-documentation'
import { ProjectSettings } from "./project-settings";
import { 
  FileText, 
  CheckSquare, 
  FileImage, 
  Users, 
  Settings,
  LayoutDashboard
} from "lucide-react";
import { Project } from "@/lib/utils/dummy-data";

interface ProjectTabsProps {
  project: Project;
}

export function ProjectTabs({ project }: ProjectTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-7">
        <TabsTrigger value="overview" className="flex items-center space-x-2">
          <LayoutDashboard className="h-4 w-4" />
          <span>Overview</span>
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
        <TabsTrigger value="team" className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span>Team</span>
        </TabsTrigger>
        <TabsTrigger value="documentation" className="flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <span>Documentation</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </TabsTrigger>
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
        <ProjectDocumentation projectId={project.id} />
      </TabsContent>

      <TabsContent value="settings">
        <ProjectSettings project={project} />
      </TabsContent>
    </Tabs>
  );
}