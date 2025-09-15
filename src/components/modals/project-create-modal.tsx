// components/modals/project-create-modal.tsx

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
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FolderOpen,
  Loader2,
  ExternalLink,
  Users
} from "lucide-react";
import { Project, team, getTeamMemberById } from "@/lib/utils/dummy-data";

interface ProjectCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject?: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'tasksCount'>) => void;
}

interface FormData {
  title: string;
  description: string;
  url: string;
  status: "active" | "completed" | "archived";
  assignedTo: string[];
}

export function ProjectCreateModal({ open, onOpenChange, onCreateProject }: ProjectCreateModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    url: "",
    status: "active",
    assignedTo: []
  });

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTeamMemberToggle = (memberId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(memberId)
        ? prev.assignedTo.filter(id => id !== memberId)
        : [...prev.assignedTo, memberId]
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      url: "",
      status: "active",
      assignedTo: []
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

      const newProject: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'tasksCount'> = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        url: formData.url.trim() || undefined,
        status: formData.status,
        assignedTo: formData.assignedTo
      };

      onCreateProject?.(newProject);
      resetForm();
      onOpenChange(false);
      
      // Show success message (you could use toast here)
      console.log('Project created successfully:', newProject);
      
    } catch (error) {
      console.error('Error creating project:', error);
      // Handle error (show toast notification)
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Create New Project
          </DialogTitle>
          <DialogDescription>
            Set up a new project to organize your work and track progress.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="title">Project Name *</Label>
            <Input
              id="title"
              placeholder="Enter project name"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your project (optional)"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />
          </div>

          {/* URL and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="url">Project URL</Label>
              <div className="relative">
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  value={formData.url}
                  onChange={(e) => handleInputChange("url", e.target.value)}
                />
                {formData.url && (
                  <ExternalLink className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Project Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "completed" | "archived") => handleInputChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Team Assignment */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Assign Team Members
            </Label>
            <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
              {team.map((member) => (
                <div key={member.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`member-${member.id}`}
                    checked={formData.assignedTo.includes(member.id)}
                    onCheckedChange={() => handleTeamMemberToggle(member.id)}
                  />
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatarUrl} />
                    <AvatarFallback className="text-xs">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <label
                      htmlFor={`member-${member.id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {member.name}
                    </label>
                    <div className="text-xs text-muted-foreground">
                      {member.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {formData.assignedTo.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {formData.assignedTo.length} team member{formData.assignedTo.length !== 1 ? 's' : ''} selected
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.title.trim()}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}