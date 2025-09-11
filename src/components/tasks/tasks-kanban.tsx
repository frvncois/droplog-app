"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  MoreHorizontal, 
  Calendar,
  AlertTriangle,
  Circle,
  ExternalLink
} from "lucide-react";
import { 
  Task,
  tasks,
  getProjectById,
  getTeamMemberById 
} from "@/lib/utils/dummy-data";
import { format } from "date-fns";
import Link from "next/link";

type TaskStatus = "todo" | "in_progress" | "completed";

interface KanbanColumn {
  id: TaskStatus;
  title: string;
  color: string;
  bgColor: string;
}

const columns: KanbanColumn[] = [
  {
    id: "todo",
    title: "To Do",
    color: "text-gray-600",
    bgColor: "bg-gray-50"
  },
  {
    id: "in_progress",
    title: "In Progress",
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    id: "completed",
    title: "Completed",
    color: "text-green-600",
    bgColor: "bg-green-50"
  }
];

export function TasksKanban() {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== newStatus) {
      // In a real app, this would make an API call to update the task status
      console.log(`Moving task ${draggedTask.id} from ${draggedTask.status} to ${newStatus}`);
    }
    setDraggedTask(null);
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const project = getProjectById(task.projectId);
    const assignee = task.assignedTo ? getTeamMemberById(task.assignedTo) : null;
    const today = new Date();
    const isOverdue = task.dueDate && new Date(task.dueDate) < today && task.status !== "completed";

    return (
      <Card 
        className="mb-3 cursor-move hover:shadow-md transition-shadow"
        draggable
        onDragStart={(e) => handleDragStart(e, task)}
      >
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header with priority and actions */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                <Badge variant="outline" className="text-xs">
                  {task.priority}
                </Badge>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href={`/app/projects/${task.projectId}?task=${task.id}`}>
                      <ExternalLink className="mr-2 h-3 w-3" />
                      View Task
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Edit Task</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Task title and description */}
            <div>
              <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
              {task.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>

            {/* Project */}
            <div className="flex items-center space-x-1">
              <Circle className="h-2 w-2 fill-current text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{project?.title}</span>
            </div>

            {/* Due date */}
            {task.dueDate && (
              <div className={`flex items-center space-x-1 ${isOverdue ? 'text-red-600' : 'text-muted-foreground'}`}>
                <Calendar className="h-3 w-3" />
                <span className="text-xs">
                  {format(new Date(task.dueDate), "MMM d")}
                </span>
                {isOverdue && (
                  <Badge variant="destructive" className="text-xs">
                    Overdue
                  </Badge>
                )}
              </div>
            )}

            {/* Comments count */}
            {task.comments && task.comments.length > 0 && (
              <div className="flex items-center space-x-1 text-muted-foreground">
                <span className="text-xs">{task.comments.length} comments</span>
              </div>
            )}

            {/* Assignee */}
            {assignee && (
              <div className="flex items-center space-x-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={assignee.avatarUrl} />
                  <AvatarFallback className="text-xs">
                    {assignee.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">{assignee.name}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          
          return (
            <div
              key={column.id}
              className="space-y-4"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <Card className={column.bgColor}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CardTitle className={`text-sm font-medium ${column.color}`}>
                        {column.title}
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {columnTasks.length}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              {/* Column Tasks */}
              <div className="space-y-0 min-h-[200px]">
                {columnTasks.length > 0 ? (
                  columnTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))
                ) : (
                  <div className="flex items-center justify-center h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">No tasks</p>
                      <Button variant="ghost" size="sm" className="text-xs">
                        <Plus className="h-3 w-3 mr-1" />
                        Add task
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Kanban Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Drag tasks between columns to update status</span>
              <span>•</span>
              <span>{tasks.length} total tasks</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Column
              </Button>
              <Button variant="outline" size="sm">
                Auto-arrange
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}