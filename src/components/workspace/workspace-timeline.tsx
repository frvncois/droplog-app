// components/workspace/workspace-timeline.tsx

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Columns2,
  Calendar,
  Clock,
  CheckSquare,
  AlertTriangle,
  User,
  ChevronRight
} from "lucide-react";
import { 
  tasks,
  getTasksByAssignee,
  getProjectById,
  getTeamMemberById,
  projects
} from "@/lib/utils/dummy-data";
import { format, isToday, isTomorrow, isThisWeek, parseISO } from "date-fns";
import Link from "next/link";

export function WorkspaceTimeline() {
  // Mock current user ID (in real app, this would come from auth)
  const currentUserId = "u1";
  
  // Get user's projects
  const userProjects = projects.filter(p => 
    p.assignedTo?.includes(currentUserId)
  );
  
  // Get all tasks from user's projects
  const userProjectTasks = tasks.filter(t => 
    userProjects.some(p => p.id === t.projectId)
  );
  
  // Create timeline events from tasks and projects
  const timelineEvents = [
    // Upcoming tasks with due dates
    ...userProjectTasks
      .filter(task => {
        if (!task.dueDate || task.status === "completed") return false;
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        const twoWeeksFromNow = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
        return dueDate >= today && dueDate <= twoWeeksFromNow;
      })
      .map(task => ({
        id: task.id,
        type: "task" as const,
        title: task.title,
        description: `${task.priority} priority task`,
        date: task.dueDate!,
        status: task.status,
        priority: task.priority,
        projectId: task.projectId,
        assignedTo: task.assignedTo,
        href: `/app/projects/${task.projectId}?tab=tasks&task=${task.id}`
      })),
    // Recent project updates
    ...userProjects
      .filter(project => {
        const updatedAt = new Date(project.updatedAt);
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return updatedAt >= sevenDaysAgo;
      })
      .map(project => ({
        id: project.id,
        type: "project_update" as const,
        title: `${project.title} updated`,
        description: `Project status: ${project.status}`,
        date: project.updatedAt,
        status: project.status,
        projectId: project.id,
        href: `/app/projects/${project.id}`
      }))
  ]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 8);

  const getEventIcon = (event: typeof timelineEvents[0]) => {
    switch (event.type) {
      case "task":
        return event.priority === "urgent" ? AlertTriangle : CheckSquare;
      case "project_update":
        return Columns2;
      default:
        return Calendar;
    }
  };

  const getEventColor = (event: typeof timelineEvents[0]) => {
    if (event.type === "task") {
      switch (event.priority) {
        case "urgent":
          return "text-red-600 bg-red-50 border-red-200";
        case "high":
          return "text-orange-600 bg-orange-50 border-orange-200";
        case "medium":
          return "text-blue-600 bg-blue-50 border-blue-200";
        default:
          return "text-gray-600 bg-gray-50 border-gray-200";
      }
    }
    return "text-green-600 bg-green-50 border-green-200";
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isThisWeek(date)) return format(date, "EEEE");
    return format(date, "MMM d");
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Columns2 className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Upcoming Events</CardTitle>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/app/tasks?view=calendar">
              View Calendar
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {timelineEvents.length > 0 ? (
          <div className="space-y-4">
            {timelineEvents.map((event, index) => {
              const Icon = getEventIcon(event);
              const project = getProjectById(event.projectId);
              const isOverdue = event.type === "task" && new Date(event.date) < new Date();
              
              return (
                <div key={event.id} className="relative">
                  {/* Timeline connector */}
                  {index < timelineEvents.length - 1 && (
                    <div className="absolute left-4 top-8 w-px h-12 bg-border" />
                  )}
                  
                  <Link 
                    href={event.href}
                    className="flex items-start space-x-4 p-3 rounded-lg hover:bg-accent/50 transition-colors group"
                  >
                    {/* Event Icon */}
                    <div className={`p-2 rounded-full border ${getEventColor(event)}`}>
                      <Icon className="h-3 w-3" />
                    </div>
                    
                    {/* Event Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <h4 className="font-medium text-sm leading-tight">
                            {event.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {event.description}
                          </p>
                          {project && (
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {project.title}
                              </Badge>
                              {event.type === "task" && event.assignedTo && (
                                <div className="flex items-center space-x-1">
                                  <User className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    {getTeamMemberById(event.assignedTo)?.name || "Unassigned"}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-2">
                          <div className={`text-xs font-medium ${isOverdue ? "text-red-600" : "text-muted-foreground"}`}>
                            {formatEventDate(event.date)}
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      
                      {/* Time */}
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{format(new Date(event.date), "h:mm a")}</span>
                        {isOverdue && (
                          <Badge variant="destructive" className="text-xs ml-2">
                            Overdue
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No upcoming events</p>
            <p className="text-xs">Your schedule looks clear</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}