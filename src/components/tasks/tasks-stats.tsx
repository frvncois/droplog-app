"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  CheckSquare, 
  Clock, 
  TrendingUp, 
  Users,
  AlertTriangle,
  Calendar,
  Target,
  Zap
} from "lucide-react";
import { 
  tasks, 
  team,
  projects
} from "@/lib/utils/dummy-data";

export function TasksStats() {
  // Calculate comprehensive task statistics
  const totalTasks = tasks.length;
  const todoTasks = tasks.filter(t => t.status === "todo");
  const inProgressTasks = tasks.filter(t => t.status === "in_progress");
  const completedTasks = tasks.filter(t => t.status === "completed");
  
  // Priority distribution
  const urgentTasks = tasks.filter(t => t.priority === "urgent");
  const highPriorityTasks = tasks.filter(t => t.priority === "high");
  
  // Due date analysis
  const today = new Date();
  const thisWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  const overdueTasks = tasks.filter(t => {
    if (!t.dueDate || t.status === "completed") return false;
    return new Date(t.dueDate) < today;
  });
  
  const dueSoonTasks = tasks.filter(t => {
    if (!t.dueDate || t.status === "completed") return false;
    const dueDate = new Date(t.dueDate);
    return dueDate >= today && dueDate <= thisWeek;
  });
  
  // Team productivity
  const assignedTasks = tasks.filter(t => t.assignedTo);
  const unassignedTasks = tasks.filter(t => !t.assignedTo);
  
  // Completion rate
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
  
  // Active projects with tasks
  const activeProjectsWithTasks = projects.filter(p => 
    p.status === "active" && tasks.some(t => t.projectId === p.id)
  ).length;

  const stats = [
    {
      title: "Task Completion",
      value: `${completionRate}%`,
      description: `${completedTasks.length} of ${totalTasks} tasks completed`,
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50",
      progress: completionRate,
      trend: "+12% from last week"
    },
    {
      title: "In Progress",
      value: inProgressTasks.length,
      description: "Tasks currently being worked on",
      icon: Zap,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      progress: totalTasks > 0 ? Math.round((inProgressTasks.length / totalTasks) * 100) : 0,
      trend: `${todoTasks.length} remaining in backlog`
    },
    {
      title: "High Priority",
      value: urgentTasks.length + highPriorityTasks.length,
      description: "Urgent and high priority tasks",
      icon: AlertTriangle,
      color: urgentTasks.length > 0 ? "text-red-600" : "text-orange-600",
      bgColor: urgentTasks.length > 0 ? "bg-red-50" : "bg-orange-50",
      progress: totalTasks > 0 ? Math.round(((urgentTasks.length + highPriorityTasks.length) / totalTasks) * 100) : 0,
      trend: urgentTasks.length > 0 ? `${urgentTasks.length} urgent` : "Manageable workload"
    },
    {
      title: "Due This Week",
      value: dueSoonTasks.length + overdueTasks.length,
      description: "Tasks due in the next 7 days",
      icon: Calendar,
      color: overdueTasks.length > 0 ? "text-red-600" : "text-orange-600",
      bgColor: overdueTasks.length > 0 ? "bg-red-50" : "bg-orange-50",
      progress: Math.min(((dueSoonTasks.length + overdueTasks.length) / 10) * 100, 100),
      trend: overdueTasks.length > 0 ? `${overdueTasks.length} overdue` : "On track"
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
                
                <div className="flex items-center mt-3">
                  <Badge variant="secondary" className="text-xs">
                    {stat.trend}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

  );
}