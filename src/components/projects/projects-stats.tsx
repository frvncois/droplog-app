"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Target,
  CheckCircle,
  Clock
} from "lucide-react";
import { 
  projects, 
  tasks, 
  getActiveProjects,
  getTasksByProjectId 
} from "@/lib/utils/dummy-data";

export function ProjectsStats() {
  const activeProjects = getActiveProjects();
  const completedProjects = projects.filter(p => p.status === "completed");
  
  // Calculate overall progress
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Calculate team utilization
  const totalTeamMembers = new Set(
    projects.flatMap(p => p.assignedTo || [])
  ).size;
  
  // Calculate upcoming deadlines
  const upcomingDeadlines = tasks.filter(t => {
    if (!t.dueDate) return false;
    const dueDate = new Date(t.dueDate);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return dueDate <= nextWeek && t.status !== "completed";
  }).length;

  const stats = [
    {
      title: "Overall Progress",
      value: `${overallProgress}%`,
      description: `${completedTasks} of ${totalTasks} tasks completed`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      progress: overallProgress,
      trend: "+5% from last week"
    },
    {
      title: "Active Projects",
      value: activeProjects.length,
      description: "Projects currently in progress",
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      progress: Math.round((activeProjects.length / projects.length) * 100),
      trend: `${completedProjects.length} completed`
    },
    {
      title: "Team Utilization",
      value: totalTeamMembers,
      description: "Team members across projects",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      progress: 85,
      trend: "85% capacity"
    },
    {
      title: "Upcoming Deadlines",
      value: upcomingDeadlines,
      description: "Tasks due in the next 7 days",
      icon: Calendar,
      color: upcomingDeadlines > 5 ? "text-red-600" : "text-orange-600",
      bgColor: upcomingDeadlines > 5 ? "bg-red-50" : "bg-orange-50",
      progress: Math.min((upcomingDeadlines / 10) * 100, 100),
      trend: upcomingDeadlines > 5 ? "High priority" : "Manageable"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
              
              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{stat.progress}%</span>
                </div>
                <Progress value={stat.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}