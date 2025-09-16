// components/projects/projects-stats.tsx

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FolderOpen, 
  Clock, 
  TrendingUp,
  Users
} from "lucide-react";
import { Project, projects as defaultProjects } from "@/lib/utils/dummy-data";

interface ProjectsStatsProps {
  projects?: Project[];
}

export function ProjectsStats({ projects = defaultProjects }: ProjectsStatsProps) {
  // Calculate statistics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === "active").length;
  const completedProjects = projects.filter(p => p.status === "completed").length;
  const archivedProjects = projects.filter(p => p.status === "archived").length;
  
  // Calculate total tasks across all projects
  const totalTasks = projects.reduce((sum, project) => sum + project.tasksCount, 0);
  
  // Calculate unique team members assigned across all projects
  const allAssignedMembers = projects.flatMap(p => p.assignedTo || []);
  const uniqueMembers = new Set(allAssignedMembers).size;
  
  // Calculate completion rate
  const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

  const stats = [
    {
      title: "Total Projects",
      value: totalProjects,
      description: "All projects in workspace",
      icon: FolderOpen,
      trend: null,
    },
    {
      title: "Active Projects",
      value: activeProjects,
      description: "Currently in progress",
      icon: Clock,
      trend: null,
    },
    {
      title: "Total Tasks",
      value: totalTasks,
      description: "Across all projects",
      icon: TrendingUp,
      trend: null,
    },
    {
      title: "Team Members",
      value: uniqueMembers,
      description: "Currently assigned",
      icon: Users,
      trend: null,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
                {stat.trend === "up" && (
                  <Badge variant="secondary" className="text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Good
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}