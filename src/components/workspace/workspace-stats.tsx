// components/workspace/workspace-stats.tsx

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FolderOpen, 
  CheckSquare, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  Target,
  Calendar,
  Users
} from "lucide-react";
import { 
  projects, 
  tasks, 
  getActiveProjects,
  getTasksByAssignee
} from "@/lib/utils/dummy-data";

export function WorkspaceStats() {
  // Mock current user ID (in real app, this would come from auth)
  const currentUserId = "u1";
  
  // Calculate user-specific stats
  const userProjects = projects.filter(p => 
    p.assignedTo?.includes(currentUserId)
  );
  const activeProjects = userProjects.filter(p => p.status === "active");
  const userTasks = getTasksByAssignee(currentUserId);
  
  // Task stats
  const completedTasks = userTasks.filter(t => t.status === "completed");
  const inProgressTasks = userTasks.filter(t => t.status === "in_progress");
  const todoTasks = userTasks.filter(t => t.status === "todo");
  const urgentTasks = userTasks.filter(t => t.priority === "urgent");
  
  // Overdue tasks
  const overdueTasks = userTasks.filter(t => {
    if (!t.dueDate || t.status === "completed") return false;
    const dueDate = new Date(t.dueDate);
    const today = new Date();
    return dueDate < today;
  });
  
  // This week's tasks
  const thisWeekTasks = userTasks.filter(t => {
    if (!t.dueDate) return false;
    const dueDate = new Date(t.dueDate);
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return dueDate >= today && dueDate <= weekFromNow;
  });
  
  // Completion rate
  const completionRate = userTasks.length > 0 
    ? Math.round((completedTasks.length / userTasks.length) * 100)
    : 0;

  const stats = [
    {
      title: "My Projects",
      value: activeProjects.length,
      total: userProjects.length,
      description: "Active projects",
      icon: FolderOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      progress: userProjects.length > 0 ? Math.round((activeProjects.length / userProjects.length) * 100) : 0,
      trend: `${userProjects.length - activeProjects.length} completed`
    },
    {
      title: "My Tasks",
      value: inProgressTasks.length + todoTasks.length,
      total: userTasks.length,
      description: "Tasks pending",
      icon: CheckSquare,
      color: "text-green-600",
      bgColor: "bg-green-50",
      progress: completionRate,
      trend: `${completedTasks.length} completed`
    },
    {
      title: "This Week",
      value: thisWeekTasks.length,
      total: null,
      description: "Tasks due this week",
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      progress: null,
      trend: thisWeekTasks.length > 0 ? "Plan ahead" : "All clear"
    },
    {
      title: "Urgent",
      value: urgentTasks.length,
      total: null,
      description: "High priority tasks",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      progress: null,
      trend: urgentTasks.length > 0 ? "Needs attention" : "Under control"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        
        return (
          <Card key={stat.title} className="relative overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-baseline space-x-2">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  {stat.total && (
                    <div className="text-sm text-muted-foreground">
                      of {stat.total}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                  
                  {stat.progress !== null && (
                    <div className="space-y-1">
                      <Progress value={stat.progress} className="h-1" />
                      <p className="text-xs text-muted-foreground">
                        {stat.progress}% completion
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        stat.title === "Urgent" && stat.value > 0 
                          ? "border-red-200 text-red-700"
                          : "border-muted text-muted-foreground"
                      }`}
                    >
                      {stat.trend}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}