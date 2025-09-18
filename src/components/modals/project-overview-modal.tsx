// components/modals/project-overview-modal.tsx
"use client";

import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ExternalLink, 
  Users, 
  CheckSquare,
  FileText,
  Image as ImageIcon,
  Globe,
  Info
} from "lucide-react";
import { format } from "date-fns";
import { Project } from "@/lib/types";
import { useTasks } from "@/hooks/use-tasks";
import { useAssets } from "@/hooks/use-assets";
import { useTeam } from "@/hooks/use-team";
import { formatRelativeTime } from "@/lib/utils";

interface ProjectOverviewModalProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-green-100 text-green-800";
    case "completed": return "bg-blue-100 text-blue-800";
    case "archived": return "bg-gray-100 text-gray-800";
    case "on_hold": return "bg-yellow-100 text-yellow-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

// Memoized team member component
const TeamMember = React.memo(function TeamMember({ 
  memberId, 
  getTeamMemberById 
}: { 
  memberId: string;
  getTeamMemberById: (id: string) => any;
}) {
  const member = getTeamMemberById(memberId);
  
  if (!member) return null;
  
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={member.avatarUrl} />
        <AvatarFallback className="text-sm">
          {member.name.split(" ").map((n: string) => n[0]).join("")}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="font-medium text-sm">{member.name}</div>
        <div className="text-xs text-muted-foreground">{member.role}</div>
      </div>
    </div>
  );
});

// Memoized asset item component
const AssetItem = React.memo(function AssetItem({ 
  asset 
}: { 
  asset: { id: string; title: string } 
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="w-2 h-2 bg-blue-500 rounded-full" />
      <span className="truncate">{asset.title}</span>
    </div>
  );
});

// Memoized content item component
const ContentItem = React.memo(function ContentItem({ 
  content 
}: { 
  content: { id: string; title: string; status: string } 
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="truncate">{content.title}</span>
      <Badge variant="outline" className="text-xs">
        {content.status}
      </Badge>
    </div>
  );
});

export function ProjectOverviewModal({ project, open, onOpenChange }: ProjectOverviewModalProps) {
  // Only fetch data when modal is open and project exists
  const { tasks } = useTasks(open && project ? { projectId: project.id } : {});
  const { assets } = useAssets(open && project ? { projectId: project.id } : {});
  const { getTeamMemberById } = useTeam();

  // Memoize expensive calculations
  const projectStats = React.useMemo(() => {
    if (!project || !open) return null;

    const projectTasks = tasks.filter(task => task.projectId === project.id);
    const completedTasks = projectTasks.filter(task => task.status === "completed");
    const activeTasks = projectTasks.filter(task => task.status !== "completed");
    const progressPercentage = projectTasks.length > 0 ? 
      Math.round((completedTasks.length / projectTasks.length) * 100) : 0;

    return {
      totalTasks: projectTasks.length,
      completedTasks: completedTasks.length,
      activeTasks: activeTasks.length,
      progressPercentage
    };
  }, [project, tasks, open]);

  // Memoize project assets
  const projectAssets = React.useMemo(() => {
    if (!project || !open) return [];
    return assets.filter(asset => asset.projectId === project.id);
  }, [project, assets, open]);

  // Early return if no project
  if (!project) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-blue-50">
              <Info className="h-5 w-5 text-blue-600" />
            </div>
            {project.title}
          </SheetTitle>
          <SheetDescription>
            Project overview and details
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Project Status and Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Project Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <div className="mt-1 text-sm">{formatRelativeTime(project.updatedAt)}</div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <div className="mt-1 text-sm">{format(new Date(project.createdAt), "PPP")}</div>
              </div>

              {project.url && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Project URL</label>
                  <div className="mt-1">
                    <Button variant="link" className="h-auto p-0" asChild>
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                        {project.url}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              {project.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <div className="mt-1 text-sm leading-relaxed">
                    {project.description}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress Overview */}
          {projectStats && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckSquare className="h-5 w-5" />
                  Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{projectStats.totalTasks}</div>
                      <div className="text-sm text-muted-foreground">Total Tasks</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{projectStats.completedTasks}</div>
                      <div className="text-sm text-muted-foreground">Completed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">{projectStats.activeTasks}</div>
                      <div className="text-sm text-muted-foreground">Active</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{projectStats.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${projectStats.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Team Members */}
          {project.assignedTo && project.assignedTo.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Members ({project.assignedTo.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.assignedTo.map((memberId) => (
                    <TeamMember 
                      key={memberId} 
                      memberId={memberId} 
                      getTeamMemberById={getTeamMemberById}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assets Summary */}
          {projectAssets.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Assets ({projectAssets.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {projectAssets.slice(0, 4).map((asset) => (
                    <AssetItem key={asset.id} asset={asset} />
                  ))}
                  {projectAssets.length > 4 && (
                    <div className="text-sm text-muted-foreground">
                      +{projectAssets.length - 4} more assets
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button className="flex-1" asChild>
              <a href={`/app/projects/${project.id}`}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Project
              </a>
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <a href={`/app/projects/${project.id}/tasks`}>
                <FileText className="h-4 w-4 mr-2" />
                View Tasks
              </a>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}