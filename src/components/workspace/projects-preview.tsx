"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  FolderOpen, 
  Plus, 
  Users,
  Calendar,
  ExternalLink,
  Circle 
} from "lucide-react";
import { 
  projects, 
  getTasksByProjectId,
  getTeamMemberById 
} from "@/lib/utils/dummy-data";
import { format } from "date-fns";

export function ProjectsPreview() {
  const currentUserId = "u1"; // Mock current user
  
  // Get user's projects (created by or team member of)
  const userProjects = projects
    .filter(p => p.assignedTo?.includes(currentUserId))
    .slice(0, 4); // Show max 4 projects

  const getProjectProgress = (projectId: string) => {
    const projectTasks = getTasksByProjectId(projectId);
    if (projectTasks.length === 0) return 0;
    
    const completedTasks = projectTasks.filter(t => t.status === "completed");
    return Math.round((completedTasks.length / projectTasks.length) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-500";
      case "completed":
        return "text-blue-500";
      case "archived":
        return "text-gray-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FolderOpen className="h-5 w-5" />
            <CardTitle>My Projects</CardTitle>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Quick Create
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {userProjects.length > 0 ? (
            userProjects.map((project) => {
              const progress = getProjectProgress(project.id);
              const projectTasks = getTasksByProjectId(project.id);
              const activeTasks = projectTasks.filter(t => t.status !== "completed");
              
              return (
                <div
                  key={project.id}
                  className="p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Circle className={`h-2 w-2 fill-current ${getStatusColor(project.status)}`} />
                        <h4 className="font-medium">{project.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {project.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description || "No description available"}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/app/projects/${project.id}`}>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Project Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {format(new Date(project.updatedAt), "MMM d")}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-muted-foreground">{projectTasks.length} tasks</span>
                        {activeTasks.length > 0 && (
                          <>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-orange-600">{activeTasks.length} active</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Team Members */}
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <div className="flex -space-x-1">
                        {project.assignedTo?.slice(0, 3).map((memberId) => {
                          const member = getTeamMemberById(memberId);
                          if (!member) return null;
                          
                          return (
                            <Avatar key={memberId} className="h-5 w-5 border border-background">
                              <AvatarImage src={member.avatarUrl} />
                              <AvatarFallback className="text-xs">
                                {member.name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                          );
                        })}
                        {project.assignedTo && project.assignedTo.length > 3 && (
                          <div className="h-5 w-5 rounded-full bg-muted border border-background flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">
                              +{project.assignedTo.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <FolderOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No projects found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create your first project to get started
              </p>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <Link href="/app/projects">
            <Button variant="outline">
              View All Your Projects
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <Link href="/app/projects/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Quick Create Project
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}