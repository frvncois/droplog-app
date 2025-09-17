// src/components/timeline/timeline-stats.tsx

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Target,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";
import { 
  tasks,
  projects,
  getActiveProjects,
  getTasksByStatus
} from "@/lib/utils/dummy-data";
import { format, isToday, isTomorrow, isThisWeek, parseISO, isPast, isFuture } from "date-fns";

export function TimelineStats() {
  // Get all tasks with due dates for timeline analysis
  const tasksWithDueDates = tasks.filter(task => task.dueDate);
  const activeProjects = getActiveProjects();
  
  // Time-based categorization
  const today = new Date();
  
  const todayEvents = tasksWithDueDates.filter(task => 
    task.dueDate && isToday(parseISO(task.dueDate))
  );
  
  const tomorrowEvents = tasksWithDueDates.filter(task =>
    task.dueDate && isTomorrow(parseISO(task.dueDate))
  );
  
  const thisWeekEvents = tasksWithDueDates.filter(task =>
    task.dueDate && isThisWeek(parseISO(task.dueDate), { weekStartsOn: 0 })
  );
  
  const upcomingEvents = tasksWithDueDates.filter(task =>
    task.dueDate && isFuture(parseISO(task.dueDate))
  );
  
  const overdueEvents = tasksWithDueDates.filter(task =>
    task.dueDate && isPast(parseISO(task.dueDate)) && task.status !== 'completed'
  );
  
  const completedEvents = tasksWithDueDates.filter(task =>
    task.status === 'completed'
  );

  // Priority analysis
  const highPriorityEvents = tasksWithDueDates.filter(task =>
    task.priority === 'high' || task.priority === 'urgent'
  );

  // Project activity
  const projectsWithEvents = activeProjects.filter(project =>
    tasksWithDueDates.some(task => task.projectId === project.id)
  );

  const completionRate = tasksWithDueDates.length > 0 
    ? Math.round((completedEvents.length / tasksWithDueDates.length) * 100) 
    : 0;

  const stats = [
    {
      title: "Today's Events",
      value: todayEvents.length,
      description: `${todayEvents.filter(e => e.status === 'completed').length} completed`,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      progress: todayEvents.length > 0 
        ? Math.round((todayEvents.filter(e => e.status === 'completed').length / todayEvents.length) * 100) 
        : 0,
      trend: tomorrowEvents.length > 0 ? `${tomorrowEvents.length} tomorrow` : "No events tomorrow"
    },
    {
      title: "This Week",
      value: thisWeekEvents.length,
      description: "Events scheduled this week",
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-50",
      progress: thisWeekEvents.length > 0 
        ? Math.round((thisWeekEvents.filter(e => e.status === 'completed').length / thisWeekEvents.length) * 100) 
        : 0,
      trend: `${thisWeekEvents.filter(e => e.status === 'completed').length} completed`
    },
    {
      title: "Overdue",
      value: overdueEvents.length,
      description: "Past due events requiring attention",
      icon: AlertTriangle,
      color: overdueEvents.length > 0 ? "text-red-600" : "text-green-600",
      bgColor: overdueEvents.length > 0 ? "bg-red-50" : "bg-green-50",
      progress: 0,
      trend: overdueEvents.length === 0 ? "All caught up!" : "Needs attention"
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      description: `${completedEvents.length} of ${tasksWithDueDates.length} events completed`,
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      progress: completionRate,
      trend: highPriorityEvents.length > 0 
        ? `${highPriorityEvents.length} high priority` 
        : "No high priority events"
    },
    {
      title: "Active Projects",
      value: projectsWithEvents.length,
      description: "Projects with scheduled events",
      icon: Zap,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      progress: activeProjects.length > 0 
        ? Math.round((projectsWithEvents.length / activeProjects.length) * 100) 
        : 0,
      trend: `${upcomingEvents.length} upcoming events`
    },
    {
      title: "Team Activity",
      value: new Set(tasksWithDueDates.filter(t => t.assignedTo).map(t => t.assignedTo)).size,
      description: "Team members with events",
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      progress: 75, // Mock engagement percentage
      trend: "High engagement"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                {stat.progress > 0 && (
                  <div className="text-xs text-muted-foreground">
                    {stat.progress}%
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold">
                    {stat.value}
                  </CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">
                  {stat.description}
                </p>
                {stat.progress > 0 && (
                  <div className="space-y-1">
                    <Progress value={stat.progress} className="h-2" />
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{stat.trend}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}