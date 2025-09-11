"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  CheckSquare, 
  CalendarIcon, 
  Loader2,
  AlertTriangle,
  Circle
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { projects, team } from "@/lib/utils/dummy-data";

interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
  trigger?: React.ReactNode;
}

type TaskPriority = "urgent" | "high" | "medium" | "low";
type TaskStatus = "todo" | "in_progress" | "completed";

export function CreateTaskModal({ open, onOpenChange, projectId, trigger }: CreateTaskModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: projectId || "",
    assignedTo: "",
    priority: "medium" as TaskPriority,
    status: "todo" as TaskStatus,
    dueDate: undefined as Date | undefined,
  });
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      projectId: projectId || "",
      assignedTo: "",
      priority: "medium",
      status: "todo",
      dueDate: undefined,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically make an API call to create the task
      console.log("Creating task:", formData);
      
      // Close modal and reset form
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "urgent":
        return "text-red-600";
      case "high":
        return "text-orange-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getPriorityIcon = (priority: TaskPriority) => {
    switch (priority) {
      case "urgent":
        return AlertTriangle;
      case "high":
        return AlertTriangle;
      default:
        return Circle;
    }
  };

  const priorities: { value: TaskPriority; label: string }[] = [
    { value: "urgent", label: "Urgent" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  const statuses: { value: TaskStatus; label: string }[] = [
    { value: "todo", label: "To Do" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            <CheckSquare className="h-5 w-5" />
            Create New Task
          </DialogTitle>
          <DialogDescription>
            Add a new task to track work and assign to team members.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                placeholder="Enter task title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what needs to be done"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Project and Assignment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Project *</Label>
              <Select
                value={formData.projectId}
                onValueChange={(value) => handleInputChange("projectId", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex items-center gap-4">
                        <Circle className={`h-2 w-2 fill-current ${
                          project.status === 'active' ? 'text-green-500' : 'text-orange-500'
                        }`} />
                        <span>{project.title}</span>
                        <Badge variant="outline" className="text-xs">
                          {project.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Assign to</Label>
              <Select
                value={formData.assignedTo}
                onValueChange={(value) => handleInputChange("assignedTo", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {team.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={member.avatarUrl} />
                          <AvatarFallback className="text-xs">
                            {member.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-xs text-muted-foreground capitalize">
                            {member.role.replace("_", " ")}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: TaskPriority) => handleInputChange("priority", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => {
                    const Icon = getPriorityIcon(priority.value);
                    return (
                      <SelectItem key={priority.value} value={priority.value}>
                        <div className="flex items-center gap-4">
                          <Icon className={`h-3 w-3 ${getPriorityColor(priority.value)}`} />
                          <span className="capitalize">{priority.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: TaskStatus) => handleInputChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dueDate ? (
                    format(formData.dueDate, "PPP")
                  ) : (
                    <span>Pick a due date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.dueDate}
                  onSelect={(date) => handleInputChange("dueDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Task Preview */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm">Task Preview</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <Badge className={`text-xs ${
                  formData.priority === "urgent" ? "bg-red-500" :
                  formData.priority === "high" ? "bg-orange-500" :
                  formData.priority === "medium" ? "bg-yellow-500" : "bg-green-500"
                } text-white`}>
                  {formData.priority}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {formData.status.replace("_", " ")}
                </Badge>
                {formData.dueDate && (
                  <Badge variant="secondary" className="text-xs">
                    Due {format(formData.dueDate, "MMM d")}
                  </Badge>
                )}
              </div>
              {formData.assignedTo && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Assigned to:</span>
                  {(() => {
                    const assignee = team.find(m => m.id === formData.assignedTo);
                    return assignee ? (
                      <div className="flex items-center gap-1">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={assignee.avatarUrl} />
                          <AvatarFallback className="text-xs">
                            {assignee.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span>{assignee.name}</span>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.title.trim() || !formData.projectId}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}