// components/project/project-tabs.tsx
"use client";

import { useState } from "react";
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
import { Project } from "@/lib/types";

interface ProjectTabsProps {
  projectId: string;
  currentUserId?: string;
}

export function ProjectTabs({ projectId, currentUserId = "u1" }: ProjectTabsProps) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!projectId) {
    return null;
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleDropdownAction = (action: string) => {
    switch (action) {
      case "settings":
        setActiveTab("settings");
        break;
      case "team":
        setActiveTab("team");
        break;
      case "delete":
        // Handle delete project logic here
        console.log("Delete project:", projectId);
        break;
      default:
        break;
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Project Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDropdownAction("settings")}>
              <Settings className="h-4 w-4 mr-2" />
              Project Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDropdownAction("team")}>
              <Users className="h-4 w-4 mr-2" />
              Manage Team
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600"
              onClick={() => handleDropdownAction("delete")}
            >
              <Trash className="h-4 w-4 mr-2 text-red-600" />
              Delete Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </TabsList>

      <TabsContent value="overview">
        <ProjectOverview projectId={projectId} />
      </TabsContent>

      <TabsContent value="timeline">
        <ProjectTimeline projectId={projectId} currentUserId={currentUserId} />
      </TabsContent>

      <TabsContent value="tasks">
        <ProjectTasksList projectId={projectId} />
      </TabsContent>

      <TabsContent value="assets">
        <ProjectAssetsList projectId={projectId} />
      </TabsContent>

      <TabsContent value="content">
        <ProjectContentList projectId={projectId} />
      </TabsContent>

      <TabsContent value="documentation">
        <ProjectDocumentation projectId={projectId} />
      </TabsContent>

      <TabsContent value="team">
        <ProjectTeamList projectId={projectId} />
      </TabsContent>

      <TabsContent value="settings">
        <ProjectSettings projectId={projectId} />
      </TabsContent>
    </Tabs>
  );
}