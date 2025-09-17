// app/workspace/page.tsx

"use client";

import { WorkspaceStats } from "@/components/workspace/workspace-stats";
import { WorkspaceTasks } from "@/components/workspace/workspace-tasks";
import { WorkspaceTimeline } from "@/components/workspace/workspace-timeline";
import { WorkspaceActivity } from "@/components/workspace/workspace-activity";
import { WorkspaceProjects } from "@/components/workspace/workspace-projects";
import { WorkspaceCta } from "@/components/workspace/workspace-cta";
import { Button } from '@/components/ui/button';
import { 
  Plus,
  Settings,
  Bell,
  Search
} from 'lucide-react';

export default function WorkspacePage() {
  return (
    <div className="space-y-6 p-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-semibold tracking-tight">Welcome back!</h1>
          </div>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Here's what's happening with your projects today.
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <WorkspaceStats />
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Tasks and Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <WorkspaceTasks />
          <WorkspaceTimeline />
        </div>
        
        {/* Right Column - Activity and CTA */}
        <div className="space-y-6">
          <WorkspaceActivity />
          <WorkspaceCta />
        </div>
      </div>
      
      {/* Projects Overview */}
      <WorkspaceProjects />
    </div>
  );
}