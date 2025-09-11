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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FolderOpen, 
  Plus, 
  Loader2,
  Users,
  ExternalLink
} from "lucide-react";
import { team } from "@/lib/utils/dummy-data";

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function CreateProjectModal({ open, onOpenChange, trigger }: CreateProjectModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    status: "active" as const,
    assignedTo: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      url: "",
      status: "active",
      assignedTo: [],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically make an API call to create the project
      console.log("Creating project:", formData);
      
      // Close modal and reset form
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleTeamMember = (memberId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(memberId)
        ? prev.assignedTo.filter(id => id !== memberId)
        : [...prev.assignedTo, memberId]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            <FolderOpen className="h-5 w-5" />
            Create New Project
          </DialogTitle>
          <DialogDescription>
            Set up a new project to organize your team's work and track progress.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
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

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your project goals, requirements, and objectives"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  onValueChange={(value) => handleInputChange("status", value)}
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
          </div>

          {/* Team Assignment */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Assign Team Members</Label>
              <Badge variant="secondary">
                {formData.assignedTo.length} selected
              </Badge>
            </div>
            
            <div className="border rounded-lg p-4 max-h-48 overflow-y-auto">
              <div className="space-y-3">
                {team.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={`member-${member.id}`}
                      checked={formData.assignedTo.includes(member.id)}
                      onCheckedChange={() => toggleTeamMember(member.id)}
                    />
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatarUrl} />
                      <AvatarFallback className="text-xs">
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {member.role.replace("_", " ")}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {member.role.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Project Settings Preview */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm">Project Settings</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Visibility:</span>
                <span>Team Members</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Comments:</span>
                <span>Enabled</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Notifications:</span>
                <span>Email + In-app</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Auto-archive:</span>
                <span>Disabled</span>
              </div>
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