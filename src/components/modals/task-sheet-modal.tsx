"use client";

import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, Flag, Clock } from "lucide-react";
import { format } from "date-fns";
import { Task, getTeamMemberById, getProjectById } from "@/lib/utils/dummy-data";

interface TaskSheetModalProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed": return "bg-green-100 text-green-800";
    case "in_progress": return "bg-blue-100 text-blue-800";
    case "todo": return "bg-gray-100 text-gray-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent": return "bg-red-500 text-white";
    case "high": return "bg-orange-500 text-white";
    case "medium": return "bg-yellow-500 text-white";
    case "low": return "bg-green-500 text-white";
    default: return "bg-gray-500 text-white";
  }
};

export function TaskSheetModal({ task, open, onOpenChange }: TaskSheetModalProps) {
  if (!task) return null;

  const assignee = task.assignedTo ? getTeamMemberById(task.assignedTo) : null;
  const project = getProjectById(task.projectId);
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const today = new Date();
  const isOverdue = dueDate && dueDate < today && task.status !== "completed";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{task.title}</SheetTitle>
          <SheetDescription>
            {task.description || "No description available."}
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {/* Status and Priority */}
          <div className="flex items-center gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Status</p>
              <Badge className={getStatusColor(task.status)}>
                {task.status.replace("_", " ")}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Priority</p>
              <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                <Flag className="h-3 w-3 mr-1" />
                {task.priority}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Project */}
          {project && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Project</p>
              <Badge variant="outline">{project.title}</Badge>
            </div>
          )}

          {/* Assignee */}
          <div className="space-y-2">
            <p className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Assignee
            </p>
            {assignee ? (
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                  {assignee.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium">{assignee.name}</p>
                  <p className="text-xs text-muted-foreground">{assignee.role}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Unassigned</p>
            )}
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <p className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Due Date
            </p>
            {dueDate ? (
              <div className={`flex items-center space-x-2 ${isOverdue ? 'text-red-600' : ''}`}>
                <Clock className="h-4 w-4" />
                <span className="text-sm">
                  {format(dueDate, "MMM d, yyyy")}
                </span>
                {isOverdue && (
                  <Badge variant="destructive" className="text-xs">
                    Overdue
                  </Badge>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No due date set</p>
            )}
          </div>

          {/* Comments */}
          {task.comments && task.comments.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Comments</p>
              <div className="space-y-2">
                {task.comments.map((comment, index) => (
                  <div key={index} className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm">{comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <Separator />
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Created:</span>
              <span>{format(new Date(task.createdAt), "MMM d, yyyy")}</span>
            </div>
            <div className="flex justify-between">
              <span>Updated:</span>
              <span>{format(new Date(task.updatedAt), "MMM d, yyyy")}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" size="sm" className="flex-1">
              Edit Task
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              {task.status === "completed" ? "Mark Incomplete" : "Mark Complete"}
            </Button>
          </div>
          
          <Button variant="default" className="w-full" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}