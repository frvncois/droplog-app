// components/workspace/workspace-projects.tsx

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  FolderOpen,
  Users,
  Calendar,
  CheckSquare,
  Clock,
  ExternalLink,
  Plus
} from "lucide-react";
import { 
  projects,
  tasks,
  getTeamMemberById
} from "@/lib/utils/dummy-data";
import { format, formatDistanceToNow } from "date-fns";
import Link from "next/link";

export function WorkspaceProjects() {
  // Mock current user ID (in real app, this would come from auth)
  const currentUserId = "u1";
  
  // Get user's projects
  const userProjects = projects.filter(p => 
    p.assignedTo?.includes(currentUserId)
  );

  // Get project stats
  const getProjectStats = (projectId: string) => {
    const projectTasks = tasks.filter(t => t.projectId === projectId);
    const completedTasks = projectTasks.filter(t => t.status === "completed");
    const activeTasks = projectTasks.filter(t => t.status === "in_progress" || t.status === "todo");
    const progress = projectTasks.length > 0 ? Math.round((completedTasks.length / projectTasks.length) * 100) : 0;
    
    return {
      totalTasks: projectTasks.length,
      completedTasks: completedTasks.length,
      activeTasks: activeTasks.length,
      progress
    };
  };

  const statusColors = {
    active: "bg-green-100 text-green-800 border-green-200",
    completed: "bg-blue-100 text-blue-800 border-blue-200",
    archived: "bg-gray-100 text-gray-800 border-gray-200"
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FolderOpen className="h-5 w-5 text-muted-foreground" />
            <CardTitle>My Projects</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/app/projects">
                View All
              </Link>
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {userProjects.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {userProjects.map((project) => {
              const stats = getProjectStats(project.id);
              
              return (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="space-y-4">
                      {/* Project Header */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-lg leading-tight">
                              {project.title}
                            </h3>
                            {project.url && (
                              <Button variant="ghost" size="sm" className="h-auto p-1" asChild>
                                <a href={project.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </Button>
                            )}
                          </div>
                          {project.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {project.description}
                            </p>
                          )}
                        </div>
                        
                        <Badge 
                          variant="outline" 
                          className={statusColors[project.status as keyof typeof statusColors]}
                        >
                          {project.status}
                        </Badge>
                      </div>

                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{stats.progress}%</span>
                        </div>
                        <Progress value={stats.progress} className="h-2" />
                      </div>

                      {/* Team Members */}
                      {project.assignedTo && project.assignedTo.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Team</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex -space-x-1">
                              {project.assignedTo.slice(0, 4).map((memberId) => {
                                const member = getTeamMemberById(memberId);
                                if (!member) return null;
                                
                                return (
                                  <Avatar key={memberId} className="h-7 w-7 border-2 border-background">
                                    <AvatarImage src={member.avatarUrl} />
                                    <AvatarFallback className="text-xs">
                                      {member.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                );
                              })}
                              {project.assignedTo.length > 4 && (
                                <div className="h-7 w-7 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                                  <span className="text-xs text-muted-foreground">
                                    +{project.assignedTo.length - 4}
                                  </span>
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {project.assignedTo.length} member{project.assignedTo.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Project Stats */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <CheckSquare className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {stats.totalTasks} tasks
                            </span>
                          </div>
                          {stats.activeTasks > 0 && (
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3 text-orange-500" />
                              <span className="text-orange-600">
                                {stats.activeTasks} active
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <Button asChild className="w-full">
                        <Link href={`/app/projects/${project.id}`}>
                          Open Project
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
            <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
              Create your first project to start organizing your work and collaborating with your team.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}