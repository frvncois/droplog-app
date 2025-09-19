// components/project/project-overview.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProjectTimeline } from "./project-timeline";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { 
  CheckSquare, 
  Clock, 
  TrendingUp, 
  Users,
  Calendar,
  FileImage,
  FileText,
  ArrowRight,
  Plus,
  ExternalLink,
  Bot,
  Sparkles
} from "lucide-react";
import { Project } from "@/lib/types";
import { useTasks } from "@/hooks/use-tasks";
import { useAssets } from "@/hooks/use-assets";
import { useTeam } from "@/hooks/use-team";
import { useProject } from "@/hooks/use-projects";
import { useActivities } from "@/hooks/use-activities";
import { format } from "date-fns";
import Link from "next/link";
import { ProjectWrittenSummary } from "@/components/project/project-written-summary";

interface ProjectOverviewProps {
  projectId: string;
}

// Utility function to format file sizes
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Generate consistent mock file size based on asset ID
const getMockFileSize = (assetId: string) => {
  let hash = 0;
  for (let i = 0; i < assetId.length; i++) {
    const char = assetId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Use absolute value and modulo to get consistent size between 100KB and 10MB
  return Math.abs(hash) % 10000000 + 100000;
};

// Memoized stat card component
const StatCard = React.memo(function StatCard({
  title,
  value,
  subtitle,
  progress,
  progressLabel,
  icon: Icon,
  iconColor,
  linkHref,
  linkText,
}: {
  title: string;
  value: number;
  subtitle: string;
  progress: number;
  progressLabel: string;
  icon: React.ElementType;
  iconColor: string;
  linkHref: string;
  linkText: string;
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-md ${iconColor}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">{progressLabel}</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        {/* Action Button */}
        <div className="mt-4">
          <Link href={linkHref}>
            <Button variant="outline" size="sm" className="w-full">
              <Icon className="h-4 w-4 mr-2" />
              {linkText}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
});

// Memoized team avatars component
const TeamAvatars = React.memo(function TeamAvatars({
  assignedTo,
  getTeamMemberById,
}: {
  assignedTo: string[] | undefined;
  getTeamMemberById: (id: string) => any;
}) {
  if (!assignedTo || assignedTo.length === 0) return null;

  return (
    <div className="mt-3 flex items-center space-x-1">
      {assignedTo.slice(0, 4).map((memberId) => {
        const member = getTeamMemberById(memberId);
        return (
          <Avatar key={memberId} className="w-6 h-6 border-2 border-background">
            <AvatarImage src={member?.avatarUrl} />
            <AvatarFallback className="text-xs">
              {member?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
            </AvatarFallback>
          </Avatar>
        );
      })}
      {assignedTo.length > 4 && (
        <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
          +{assignedTo.length - 4}
        </div>
      )}
    </div>
  );
});

export function ProjectOverview({ projectId }: ProjectOverviewProps) {
  // Hooks for data fetching
  const { project } = useProject(projectId);
  const { tasks } = useTasks({ projectId });
  const { assets } = useAssets({ projectId });
  const { getTeamMemberById } = useTeam();
  const { activities } = useActivities({ projectId, limit: 5 });

  // Memoized calculations
  const projectStats = React.useMemo(() => {
    if (!project) return null;

    const projectTasks = tasks.filter(task => task.projectId === project.id);
    const completedTasks = projectTasks.filter(t => t.status === "completed");
    const inProgressTasks = projectTasks.filter(t => t.status === "in_progress");
    const todoTasks = projectTasks.filter(t => t.status === "todo");
    
    const progress = projectTasks.length > 0 ? Math.round((completedTasks.length / projectTasks.length) * 100) : 0;

    const projectAssets = assets.filter(asset => asset.projectId === project.id);
    
    // Mock content data (TODO: replace with real content hook when available)
    const mockContent: Array<{ status: string }> = []; // Replace with real content when hook is available
    
    const totalAssetSize = projectAssets.reduce((acc, asset) => {
      return acc + getMockFileSize(asset.id);
    }, 0);

    return {
      tasks: {
        total: projectTasks.length,
        completed: completedTasks.length,
        inProgress: inProgressTasks.length,
        todo: todoTasks.length,
        progress
      },
      assets: {
        total: projectAssets.length,
        totalSize: totalAssetSize,
        storageProgress: Math.min(Math.round((projectAssets.length / 20) * 100), 100)
      },
      content: {
        total: mockContent.length,
        published: mockContent.filter(c => c.status === 'published').length,
        drafts: mockContent.filter(c => c.status === 'draft').length,
        publishedProgress: mockContent.length > 0 ? Math.round((mockContent.filter(c => c.status === 'published').length / mockContent.length) * 100) : 0
      },
      team: {
        total: project.assignedTo?.length || 0,
        capacityProgress: Math.min(Math.round(((project.assignedTo?.length || 0) / 10) * 100), 100)
      }
    };
  }, [project, tasks, assets]);

  // Helper function to convert activity type to readable action
  const getActionText = React.useCallback((type: string) => {
    switch (type) {
      case 'task_completed': return 'completed task'
      case 'asset_uploaded': return 'uploaded asset'
      case 'project_created': return 'created project'
      case 'member_added': return 'added team member'
      case 'comment_added': return 'commented on'
      default: return 'updated'
    }
  }, []);

  // Helper function to get target name from activity
  const getTargetText = React.useCallback((activity: any) => {
    return activity.metadata?.taskTitle || 
           activity.metadata?.assetTitle || 
           activity.metadata?.projectTitle ||
           activity.metadata?.memberName ||
           'item'
  }, []);

  // Memoized recent activities
  const recentActivities = React.useMemo(() => {
    return activities.map(activity => ({
      id: activity.id,
      user: activity.metadata?.userName || "Unknown User",
      action: getActionText(activity.type),
      target: getTargetText(activity),
      timestamp: activity.timestamp
    }))
  }, [activities, getActionText, getTargetText]);

  // Memoized summary data for ProjectWrittenSummary
  const summaryData = React.useMemo(() => {
    if (!project || !projectStats) return null;

    return {
      project: {
        id: project.id,
        title: project.title,
        url: project.url,
        status: project.status as 'active' | 'completed' | 'archived',
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        tasksCount: projectStats.tasks.total
      },
      tasks: tasks.filter(task => task.projectId === project.id).map(task => ({
        id: task.id,
        projectId: task.projectId,
        title: task.title,
        status: task.status as 'todo' | 'in_progress' | 'completed',
        priority: task.priority as 'low' | 'medium' | 'high',
        assignedTo: task.assignedTo,
        dueDate: task.dueDate,
        comments: task.comments
      })),
      assets: assets.filter(asset => asset.projectId === project.id).map(asset => ({
        id: asset.id,
        projectId: asset.projectId,
        type: asset.type,
        title: asset.title,
        addedBy: asset.addedBy,
        updatedAt: asset.updatedAt
      })),
      content: [], // TODO: Replace with real content data
      team: [] // TODO: Replace with real team data specific to project
    };
  }, [project, projectStats, tasks, assets]);

  if (!project || !projectStats) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-center">
                Project overview
              </CardTitle>
              <div className="p-2 rounded-md bg-blue-50">
                <Clock className="h-4 w-4 text-blue-600"/>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  {project.description || "No description available for this project. Click edit to add a detailed description of the project goals, requirements, and objectives."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Progress
              </CardTitle>
              <div className="p-2 rounded-md bg-blue-50">
                <Plus className="h-4 w-4 text-blue-600"/>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Overall Progress</span>
                  <span className="text-2xl font-bold">{projectStats.tasks.progress}%</span>
                </div>
                <Progress value={projectStats.tasks.progress} className="h-3" />
                <p className="text-sm text-muted-foreground">
                  {projectStats.tasks.completed} of {projectStats.tasks.total} tasks completed
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Recent Activity
              </CardTitle>
              <div className="p-2 rounded-md bg-blue-50">
                <Clock className="h-4 w-4 text-blue-600"/>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`/avatars/${activity.user.toLowerCase().replace(' ', '-')}.png`} />
                      <AvatarFallback className="text-xs">
                        {activity.user.split(" ").map((n: string) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>
                        {" "}{activity.action}{" "}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(activity.timestamp), "MMM d, h:mm a")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {summaryData && (
            <ProjectWrittenSummary
              project={summaryData.project}
              tasks={summaryData.tasks}
              assets={summaryData.assets}
              content={summaryData.content}
              team={summaryData.team}
            />
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <Button variant="default" size="xl">
              <Bot className="h-4 w-4" />
              Open editor
            </Button>
            <Button variant="outline" size="xl">
              <Sparkles className="h-4 w-4" />
              Analyze site
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="flex flex-col gap-6">
              {/* Tasks Card */}
              <StatCard
                title="Tasks"
                value={projectStats.tasks.total}
                subtitle={`${projectStats.tasks.completed} of ${projectStats.tasks.total} tasks completed`}
                progress={projectStats.tasks.progress}
                progressLabel="Progress"
                icon={CheckSquare}
                iconColor="bg-blue-50 text-blue-600"
                linkHref={`/app/projects/${project.id}?tab=tasks`}
                linkText="View Tasks"
              />

              {/* Assets Card */}
              <StatCard
                title="Assets"
                value={projectStats.assets.total}
                subtitle={`${formatFileSize(projectStats.assets.totalSize)} total size`}
                progress={projectStats.assets.storageProgress}
                progressLabel="Storage"
                icon={FileImage}
                iconColor="bg-purple-50 text-purple-600"
                linkHref={`/app/projects/${project.id}?tab=assets`}
                linkText="View Assets"
              />

              {/* Content Card */}
              <StatCard
                title="Content"
                value={projectStats.content.total}
                subtitle={`${projectStats.content.published} published, ${projectStats.content.drafts} drafts`}
                progress={projectStats.content.publishedProgress}
                progressLabel="Published"
                icon={FileText}
                iconColor="bg-green-50 text-green-600"
                linkHref={`/app/projects/${project.id}?tab=content`}
                linkText="View Content"
              />

              {/* Team Card */}
              <Card className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                  <div className="p-2 rounded-md bg-orange-50">
                    <Users className="h-4 w-4 text-orange-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">{projectStats.team.total}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Active members on this project
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Capacity</span>
                      <span className="font-medium">{projectStats.team.capacityProgress}%</span>
                    </div>
                    <Progress value={projectStats.team.capacityProgress} className="h-2" />
                  </div>
                  
                  {/* Team Member Avatars */}
                  <TeamAvatars 
                    assignedTo={project.assignedTo} 
                    getTeamMemberById={getTeamMemberById}
                  />
                  
                  {/* Action Button */}
                  <div className="mt-4">
                    <Link href={`/app/projects/${project.id}?tab=team`}>
                      <Button variant="outline" size="sm" className="w-full">
                        <Users className="h-4 w-4 mr-2" />
                        View Team
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}