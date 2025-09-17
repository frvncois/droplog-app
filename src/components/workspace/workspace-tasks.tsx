// components/workspace/workspace-tasks.tsx

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckSquare,
  Clock,
  AlertTriangle,
  Calendar,
  ChevronRight,
  Plus
} from "lucide-react";
import { 
  tasks,
  getTasksByAssignee,
  getProjectById,
  getTeamMemberById
} from "@/lib/utils/dummy-data";
import { formatDistanceToNow, format } from "date-fns";
import Link from "next/link";

export function WorkspaceTasks() {
  // Mock current user ID (in real app, this would come from auth)
  const currentUserId = "u1";
  
  const userTasks = getTasksByAssignee(currentUserId);
  
  // Filter tasks by different criteria
  const todoTasks = userTasks.filter(t => t.status === "todo");
  const inProgressTasks = userTasks.filter(t => t.status === "in_progress");
  const urgentTasks = userTasks.filter(t => t.priority === "urgent" && t.status !== "completed");
  
  // This week's tasks
  const thisWeekTasks = userTasks.filter(t => {
    if (!t.dueDate || t.status === "completed") return false;
    const dueDate = new Date(t.dueDate);
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return dueDate >= today && dueDate <= weekFromNow;
  });
  
  // Overdue tasks
  const overdueTasks = userTasks.filter(t => {
    if (!t.dueDate || t.status === "completed") return false;
    const dueDate = new Date(t.dueDate);
    const today = new Date();
    return dueDate < today;
  });

  const TaskItem = ({ task, showProject = true }: { task: any, showProject?: boolean }) => {
    const project = getProjectById(task.projectId);
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "completed";
    
    const priorityColors = {
      urgent: "bg-red-100 text-red-800 border-red-200",
      high: "bg-orange-100 text-orange-800 border-orange-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      low: "bg-gray-100 text-gray-800 border-gray-200"
    };
    
    const statusColors = {
      todo: "bg-blue-100 text-blue-800 border-blue-200",
      in_progress: "bg-orange-100 text-orange-800 border-orange-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      blocked: "bg-red-100 text-red-800 border-red-200"
    };

    return (
      <Link 
        href={`/app/projects/${task.projectId}?tab=tasks&task=${task.id}`}
        className="block p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
              {task.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={`text-xs ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                {task.priority}
              </Badge>
              <Badge variant="outline" className={`text-xs ${statusColors[task.status as keyof typeof statusColors]}`}>
                {task.status.replace("_", " ")}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {task.dueDate && (
                <div className={`flex items-center space-x-1 ${isOverdue ? "text-red-600" : ""}`}>
                  <Calendar className="h-3 w-3" />
                  <span>{format(new Date(task.dueDate), "MMM d")}</span>
                </div>
              )}
            </div>
          </div>
          
          {showProject && project && (
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center space-x-2">
                <div className="text-xs text-muted-foreground">{project.title}</div>
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}
              </div>
            </div>
          )}
        </div>
      </Link>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckSquare className="h-5 w-5 text-muted-foreground" />
            <CardTitle>My Tasks</CardTitle>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/app/tasks">
              View All
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active" className="text-xs">
              Active ({inProgressTasks.length})
            </TabsTrigger>
            <TabsTrigger value="todo" className="text-xs">
              Todo ({todoTasks.length})
            </TabsTrigger>
            <TabsTrigger value="urgent" className="text-xs">
              Urgent ({urgentTasks.length})
            </TabsTrigger>
            <TabsTrigger value="week" className="text-xs">
              This Week ({thisWeekTasks.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-3 mt-4">
            {inProgressTasks.length > 0 ? (
              inProgressTasks.slice(0, 5).map((task) => (
                <TaskItem key={task.id} task={task} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No active tasks</p>
                <p className="text-xs">Great job staying on top of things!</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="todo" className="space-y-3 mt-4">
            {todoTasks.length > 0 ? (
              todoTasks.slice(0, 5).map((task) => (
                <TaskItem key={task.id} task={task} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No pending tasks</p>
                <p className="text-xs">Time to plan your next move</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="urgent" className="space-y-3 mt-4">
            {urgentTasks.length > 0 ? (
              urgentTasks.slice(0, 5).map((task) => (
                <TaskItem key={task.id} task={task} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No urgent tasks</p>
                <p className="text-xs">Everything is under control</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="week" className="space-y-3 mt-4">
            {thisWeekTasks.length > 0 ? (
              thisWeekTasks.slice(0, 5).map((task) => (
                <TaskItem key={task.id} task={task} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No tasks due this week</p>
                <p className="text-xs">Perfect time to plan ahead</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}