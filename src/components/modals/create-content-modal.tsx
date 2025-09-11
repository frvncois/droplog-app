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
import { 
  FileText, 
  Loader2,
  BookOpen,
  Mail,
  MessageSquare,
  Globe
} from "lucide-react";
import { projects, team } from "@/lib/utils/dummy-data";

interface CreateContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
  trigger?: React.ReactNode;
}

export function CreateContentModal({ open, onOpenChange, projectId, trigger }: CreateContentModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    projectId: projectId || "",
    assignedTo: "",
    type: "blog_post" as const,
    status: "draft" as const,
  });
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      projectId: projectId || "",
      assignedTo: "",
      type: "blog_post",
      status: "draft",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically make an API call to create the content
      console.log("Creating content:", formData);
      
      // Close modal and reset form
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Error creating content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "blog_post":
        return BookOpen;
      case "email":
        return Mail;
      case "social":
        return MessageSquare;
      case "page":
        return Globe;
      default:
        return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "published":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const contentTemplates = {
    blog_post: "# Blog Post Title\n\n## Introduction\n\nWrite your introduction here...\n\n## Main Content\n\nAdd your main content here...\n\n## Conclusion\n\nWrap up your thoughts...",
    email: "Subject: [Your Subject Here]\n\nHi [Name],\n\nYour email content goes here...\n\nBest regards,\n[Your Name]",
    social: "🚀 Exciting news! \n\n[Your social media content here]\n\n#hashtag #social #content",
    page: "# Page Title\n\n## Overview\n\nPage content description...\n\n## Sections\n\n- Section 1\n- Section 2\n- Section 3",
    other: "Content goes here..."
  };

  const handleTemplateInsert = () => {
    const template = contentTemplates[formData.type as keyof typeof contentTemplates];
    setFormData(prev => ({ ...prev, content: template }));
  };

  const wordCount = formData.content.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            <FileText className="h-5 w-5" />
            Create New Content
          </DialogTitle>
          <DialogDescription>
            Create and manage content for your projects.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Content Title *</Label>
              <Input
                id="title"
                placeholder="Enter content title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Content Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      { value: "blog_post", label: "Blog Post", icon: BookOpen },
                      { value: "page", label: "Page", icon: Globe },
                      { value: "email", label: "Email", icon: Mail },
                      { value: "social", label: "Social Media", icon: MessageSquare },
                      { value: "other", label: "Other", icon: FileText },
                    ].map((type) => {
                      const Icon = type.icon;
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-4">
                            <Icon className="h-4 w-4" />
                            <span>{type.label}</span>
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
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Project *</Label>
                <Select
                  value={formData.projectId}
                  onValueChange={(value) => handleInputChange("projectId", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="text-xs">
                            {project.status}
                          </Badge>
                          <span>{project.title}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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

          {/* Content Editor */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="content">Content</Label>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="text-xs">
                  {wordCount} words
                </Badge>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleTemplateInsert}
                >
                  Insert Template
                </Button>
              </div>
            </div>
            <Textarea
              id="content"
              placeholder="Start writing your content..."
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              rows={12}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Supports Markdown formatting. Use templates for common content structures.
            </p>
          </div>

          {/* Content Preview */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-4">
              Content Preview
              {(() => {
                const TypeIcon = getTypeIcon(formData.type);
                return <TypeIcon className="h-4 w-4" />;
              })()}
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className={getStatusColor(formData.status)}>
                  {formData.status}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {formData.type.replace("_", " ")}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {wordCount} words
                </Badge>
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
              <div className="text-sm text-muted-foreground">
                Content preview: {formData.content.slice(0, 100)}{formData.content.length > 100 ? "..." : ""}
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
            <Button type="submit" disabled={isLoading || !formData.title.trim() || !formData.projectId}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Content
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}