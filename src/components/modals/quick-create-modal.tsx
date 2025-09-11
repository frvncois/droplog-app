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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, FolderOpen, CheckSquare, FileText, Calendar as CalendarIconLucide } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { projects, team } from "@/lib/utils/dummy-data";

interface QuickCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "project" | "task" | "event" | "content";
}

export function QuickCreateModal({ open, onOpenChange, type }: QuickCreateModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    assignedTo: "",
    priority: "",
    dueDate: undefined as Date | undefined,
    status: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      projectId: "",
      assignedTo: "",
      priority: "",
      dueDate: undefined,
      status: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically make an API call to create the item
      console.log(`Creating ${type}:`, formData);
      
      // Close modal and reset form
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error(`Error creating ${type}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getModalConfig = () => {
    switch (type) {
      case "project":
        return {
          title: "Create New Project",
          description: "Add a new project to organize your work",
          icon: FolderOpen,
          submitText: "Create Project",
        };
      case "task":
        return {
          title: "Create New Task",
          description: "Add a new task to track your progress",
          icon: CheckSquare,
          submitText: "Create Task",
        };
      case "event":
        return {
          title: "Create New Event",
          description: "Schedule a new event or meeting",
          icon: CalendarIconLucide,
          submitText: "Create Event",
        };
      case "content":
        return {
          title: "Create New Content",
          description: "Start working on new content",
          icon: FileText,
          submitText: "Create Content",
        };
      default:
        return {
          title: "Create New Item",
          description: "Add a new item",
          icon: FolderOpen,
          submitText: "Create",
        };
    }
  };

  const config = getModalConfig();
  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            <Icon className="h-5 w-5" />
            {config.title}
          </DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder={`Enter ${type} title`}
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder={`Describe your ${type}`}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />
          </div>

          {/* Project selection for tasks, events, and content */}
          {type !== "project" && (
            <div className="space-y-2">
              <Label>Project</Label>
              <Select
                value={formData.projectId}
                onValueChange={(value) => handleInputChange("projectId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="text-xs">
                          {project.status}
                        </Badge>
                        {project.title}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Task-specific fields */}
          {type === "task" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => handleInputChange("priority", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {/* Content-specific fields */}
          {type === "content" && (
            <div className="space-y-2">
              <Label>Content Type</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog_post">Blog Post</SelectItem>
                  <SelectItem value="page">Page</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Assignment and Due Date */}
          <div className="grid grid-cols-2 gap-4">
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
                          <div className="text-xs text-muted-foreground">{member.role}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
                      <span>Pick a date</span>
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
            <Button type="submit" disabled={isLoading}>
              {isLoading && <div className="mr-2 h-4 w-4 animate-spin" />}
              {config.submitText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}