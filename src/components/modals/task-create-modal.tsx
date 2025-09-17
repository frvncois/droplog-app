"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  Flag, 
  User, 
  X,
  Plus
} from "lucide-react";
import { Task, team, getTeamMemberById } from "@/lib/utils/dummy-data";

interface TaskCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onCreateTask?: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

interface FormData {
  title: string;
  description: string;
  status: "todo" | "in_progress" | "completed";
  priority: "urgent" | "high" | "medium" | "low";
  assignedTo?: string;
  dueDate?: string;
}

const statusOptions = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const priorityOptions = [
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const getPriorityConfig = (priority: string) => {
  switch (priority) {
    case "urgent": 
      return { 
        color: "text-red-600", 
        bg: "bg-red-50 border-red-200",
        label: "Urgent"
      };
    case "high": 
      return { 
        color: "text-orange-600", 
        bg: "bg-orange-50 border-orange-200",
        label: "High"
      };
    case "medium": 
      return { 
        color: "text-amber-600", 
        bg: "bg-amber-50 border-amber-200",
        label: "Medium"
      };
    case "low": 
      return { 
        color: "text-emerald-600", 
        bg: "bg-emerald-50 border-emerald-200",
        label: "Low"
      };
    default: 
      return { 
        color: "text-slate-600", 
        bg: "bg-slate-50 border-slate-200",
        label: "Medium"
      };
  }
};

export function TaskCreateModal({ open, onOpenChange, projectId, onCreateTask }: TaskCreateModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    assignedTo: undefined,
    dueDate: undefined,
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value === "" ? undefined : value
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      assignedTo: undefined,
      dueDate: undefined,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
        projectId,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        status: formData.status,
        priority: formData.priority,
        assignedTo: formData.assignedTo,
        dueDate: formData.dueDate,
        comments: []
      };

      onCreateTask?.(newTask);
      console.log('Created task:', newTask);
      
      // Close modal and reset form
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedAssignee = formData.assignedTo ? getTeamMemberById(formData.assignedTo) : null;
  const priorityConfig = getPriorityConfig(formData.priority);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-0 pb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-md bg-primary/10">
                  <Plus className="h-4 w-4 text-primary" />
                </div>
                <DialogTitle className="text-xl">
                  Create New Task
                </DialogTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                Add a new task to track progress and assign to team members
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onOpenChange(false)}
              className="ml-2 h-8 w-8 p-0 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              placeholder="Enter task title..."
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add task description..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Status & Priority Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => {
                    const config = getPriorityConfig(option.value);
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Flag className={`h-3 w-3 ${config.color}`} />
                          {option.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assignee */}
          <div className="space-y-2">
            <Label>Assignee</Label>
            <Select value={formData.assignedTo || ""} onValueChange={(value) => handleInputChange('assignedTo', value)}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  {selectedAssignee ? (
                    <>

                      <SelectValue />
                    </>
                  ) : (
                    <>
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Select assignee...</span>
                    </>
                  )}
                </div>
              </SelectTrigger>
              <SelectContent >
                <SelectItem value="unassigned">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Unassigned
                  </div>
                </SelectItem>
                {team.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={member.avatarUrl} />
                        <AvatarFallback className="text-xs">
                          {member.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col text-left">
                        <span className="text-xs">{member.name}</span>
                        <span className="text-xs text-muted-foreground">{member.role}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate || ""}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!formData.title.trim() || isLoading}
              className="flex-1"
            >
              {isLoading ? 'Creating...' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}