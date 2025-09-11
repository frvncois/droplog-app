"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FolderOpen, 
  CheckSquare, 
  Clock, 
  TrendingUp,
  Users,
  AlertTriangle 
} from "lucide-react";
import { 
  projects, 
  tasks, 
  getActiveProjects, 
  getTasksByStatus,
  getTasksByAssignee 
} from "@/lib/utils/dummy-data";

export function WorkspaceOverview() {
  // Mock current user ID (in real app, this would come from auth)
  const currentUserId = "u1";
  
  // Calculate stats
  const activeProjects = getActiveProjects();
  const userProjects = projects.filter(p => 
    p.assignedTo?.includes(currentUserId)
  );
  const userTasks = getTasksByAssignee(currentUserId);
  const urgentTasks = tasks.filter(t => 
    t.assignedTo === currentUserId && t.priority === "urgent"
  );
  const completedTasks = getTasksByStatus("completed").filter(t => 
    t.assignedTo === currentUserId
  );
  const overdueTasks = tasks.filter(t => {
    if (!t.dueDate || t.assignedTo !== currentUserId) return false;
    const dueDate = new Date(t.dueDate);
    const today = new Date();
    return dueDate < today && t.status !== "completed";
  });

  const stats = [
    {
      title: "Active Projects",
      value: userProjects.length,
      description: "Projects you're part of",
      icon: FolderOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "+2 this month"
    },
    {
      title: "My Tasks",
      value: userTasks.length,
      description: "Tasks assigned to you",
      icon: CheckSquare,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: `${userTasks.filter(t => t.status === "completed").length} completed`
    },
    {
      title: "Urgent Tasks",
      value: urgentTasks.length,
      description: "High priority items",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      trend: urgentTasks.length > 0 ? "Needs attention" : "All clear"
    },
    {
      title: "Team Projects",
      value: activeProjects.length,
      description: "Total active projects",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: "Across all teams"
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