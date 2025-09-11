"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
  ExternalLink
} from "lucide-react";
import { 
  Project,
  Asset,
  TeamMember,
  getTasksByProjectId,
  getAssetsByProjectId,
  getContentByProjectId,
  getTeamMemberById,
  team
} from "@/lib/utils/dummy-data";
import { format } from "date-fns";
import Link from "next/link";

interface ProjectOverviewProps {
  project: Project;
}

// Utility function to format file sizes
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function ProjectOverview({ project }: ProjectOverviewProps) {
  const projectTasks = getTasksByProjectId(project.id);
  const projectAssets = getAssetsByProjectId(project.id);
  const projectContent = getContentByProjectId(project.id);
  
  const completedTasks = projectTasks.filter(t => t.status === "completed");
  const inProgressTasks = projectTasks.filter(t => t.status === "in_progress");
  const todoTasks = projectTasks.filter(t => t.status === "todo");
  
  const progress = projectTasks.length > 0 ? Math.round((completedTasks.length / projectTasks.length) * 100) : 0;
  
  // Recent activity items (mock data for demonstration)
  const recentActivities = [
    {
      id: "1",
      user: "Alice Johnson",
      action: "completed task",
      target: "Fix homepage header",
      timestamp: "2025-09-11T08:30:00Z"
    },
    {
      id: "2",
      user: "Bob Smith",
      action: "uploaded asset",
      target: "Hero Banner Image",
      timestamp: "2025-09-10T16:45:00Z"
    },
    {
      id: "3",
      user: "Carol Davis",
      action: "created content",
      target: "Blog Post Draft",
      timestamp: "2025-09-10T14:20:00Z"
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Progress Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Overall Progress</span>
                <span className="text-2xl font-bold">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
              <p className="text-sm text-muted-foreground">
                {completedTasks.length} of {projectTasks.length} tasks completed
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-600">{todoTasks.length}</div>
                <div className="text-sm text-muted-foreground">To Do</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">{inProgressTasks.length}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">{completedTasks.length}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Recent Activity</span>
              </div>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`/avatars/${activity.user.toLowerCase().replace(' ', '-')}.png`} />
                    <AvatarFallback className="text-xs">
                      {activity.user.split(" ").map(n => n[0]).join("")}
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
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Project Description */}
        <Card>
          <CardHeader>
            <CardTitle>Project Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {project.description || "No description available for this project. Click edit to add a detailed description of the project goals, requirements, and objectives."}
              </p>
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm">
                Edit Description
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="space-y-4">
          
          <div className="flex flex-col gap-6">
            {/* Tasks Card */}
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tasks
                </CardTitle>
                <div className="p-2 rounded-md bg-blue-50">
                  <CheckSquare className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{projectTasks.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {projectTasks.filter(t => t.status === 'completed').length} of {projectTasks.length} tasks completed
                </p>
                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {Math.round((projectTasks.filter(t => t.status === 'completed').length / Math.max(projectTasks.length, 1)) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={Math.round((projectTasks.filter(t => t.status === 'completed').length / Math.max(projectTasks.length, 1)) * 100)} 
                    className="h-2" 
                  />
                </div>
                {/* Action Button */}
                <div className="mt-4">
                  <Link href={`/app/projects/${project.id}?tab=tasks`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <CheckSquare className="h-4 w-4 mr-2" />
                      View Tasks
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Assets Card */}
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Assets
                </CardTitle>
                <div className="p-2 rounded-md bg-purple-50">
                  <FileImage className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{projectAssets.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatFileSize(projectAssets.reduce((acc: number, asset: Asset) => {
                    const mockSize = Math.floor(Math.random() * 10000000) + 100000;
                    return acc + mockSize;
                  }, 0))} total size
                </p>
                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Storage</span>
                    <span className="font-medium">
                      {Math.min(Math.round((projectAssets.length / 20) * 100), 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(Math.round((projectAssets.length / 20) * 100), 100)} 
                    className="h-2" 
                  />
                </div>
                {/* Action Button */}
                <div className="mt-4">
                  <Link href={`/app/projects/${project.id}?tab=assets`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <FileImage className="h-4 w-4 mr-2" />
                      View Assets
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Content Card */}
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Content
                </CardTitle>
                <div className="p-2 rounded-md bg-green-50">
                  <FileText className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{projectContent.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {projectContent.filter(c => c.status === 'published').length} published, {projectContent.filter(c => c.status === 'draft').length} drafts
                </p>
                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Published</span>
                    <span className="font-medium">
                      {Math.round((projectContent.filter(c => c.status === 'published').length / Math.max(projectContent.length, 1)) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={Math.round((projectContent.filter(c => c.status === 'published').length / Math.max(projectContent.length, 1)) * 100)} 
                    className="h-2" 
                  />
                </div>
                {/* Action Button */}
                <div className="mt-4">
                  <Link href={`/app/projects/${project.id}?tab=content`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      View Content
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Team Card */}
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Team Members
                </CardTitle>
                <div className="p-2 rounded-md bg-orange-50">
                  <Users className="h-4 w-4 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{project.assignedTo?.length || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Active members on this project
                </p>
                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Capacity</span>
                    <span className="font-medium">
                      {Math.min(Math.round(((project.assignedTo?.length || 0) / 10) * 100), 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(Math.round(((project.assignedTo?.length || 0) / 10) * 100), 100)} 
                    className="h-2" 
                  />
                </div>
                
                {/* Team Member Avatars */}
                {project.assignedTo && project.assignedTo.length > 0 && (
                  <div className="mt-3 flex items-center space-x-1">
                    {project.assignedTo.slice(0, 4).map((memberId: string, index: number) => {
                      const member = team.find((t: TeamMember) => t.id === memberId);
                      return (
                        <Avatar key={memberId} className="w-6 h-6 border-2 border-background">
                          <AvatarImage src={member?.avatarUrl} />
                          <AvatarFallback className="text-xs">
                            {member?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      );
                    })}
                    {(project.assignedTo?.length || 0) > 4 && (
                      <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                        +{(project.assignedTo?.length || 0) - 4}
                      </div>
                    )}
                  </div>
                )}
                
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
  );
}