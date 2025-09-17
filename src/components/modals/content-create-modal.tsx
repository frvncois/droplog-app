// components/modals/content-create-modal.tsx

"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react";

// Import statement should use team instead of getTeamMembers
import { Content, team } from "@/lib/utils/dummy-data";

interface ContentCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onCreateContent: (content: Omit<Content, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

type ContentType = "blog_post" | "page" | "email" | "social" | "other";
type ContentStatus = "draft" | "pending" | "approved" | "published";

export function ContentCreateModal({ 
  open, 
  onOpenChange, 
  projectId, 
  onCreateContent 
}: ContentCreateModalProps) {
  const [formData, setFormData] = React.useState<{
    title: string;
    content: string;
    type: ContentType;
    status: ContentStatus;
    assignedTo: string;
    url: string;
    wordCount: number;
  }>({
    title: "",
    content: "",
    type: "blog_post",
    status: "draft",
    assignedTo: "unassigned",
    url: "",
    wordCount: 0,
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const teamMembers = team; // Use team instead of getTeamMembers()

  // Reset form when modal closes
  React.useEffect(() => {
    if (!open) {
      setFormData({
        title: "",
        content: "",
        type: "blog_post",
        status: "draft",
        assignedTo: "unassigned",
        url: "",
        wordCount: 0,
      });
    }
  }, [open]);

  // Auto-calculate word count
  React.useEffect(() => {
    if (formData.content) {
      const words = formData.content.trim().split(/\s+/).filter(word => word.length > 0);
      setFormData(prev => ({ ...prev, wordCount: words.length }));
    } else {
      setFormData(prev => ({ ...prev, wordCount: 0 }));
    }
  }, [formData.content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert("Please enter a title");
      return;
    }

    setIsSubmitting(true);

    try {
      const newContent: Omit<Content, 'id' | 'createdAt' | 'updatedAt'> = {
        projectId,
        title: formData.title.trim(),
        content: formData.content.trim() || undefined,
        type: formData.type,
        status: formData.status,
        assignedTo: formData.assignedTo === "unassigned" ? undefined : formData.assignedTo,
        url: formData.url.trim() || undefined,
        wordCount: formData.wordCount > 0 ? formData.wordCount : undefined,
      };

      onCreateContent(newContent);
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating content:", error);
      alert("Failed to create content. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedMember = (memberId: string) => {
    return teamMembers.find((member: any) => member.id === memberId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Content</DialogTitle>
          <DialogDescription>
            Add new content to your project. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter content title..."
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          {/* Type and Status Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Content Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: ContentType) => 
                  setFormData(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
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

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: ContentStatus) => 
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assignee */}
          <div className="space-y-2">
            <Label htmlFor="assignee">Assign To</Label>
            <Select 
              value={formData.assignedTo} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, assignedTo: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select team member (optional)">
                  {formData.assignedTo && (
                    <div className="flex items-center gap-2">
                      {(() => {
                        const member = getSelectedMember(formData.assignedTo);
                        return member ? (
                          <>
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={member.avatarUrl} />
                              <AvatarFallback className="text-xs">
                                {member.name.split(" ").map((n: string) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span>{member.name}</span>
                          </>
                        ) : null;
                      })()}
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {teamMembers.map((member: any) => (
                  <SelectItem key={member.id} value={member.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={member.avatarUrl} />
                        <AvatarFallback className="text-xs">
                          {member.name.split(" ").map((n: string) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span>{member.name}</span>
                      <span className="text-xs text-muted-foreground">({member.role})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* URL (only for pages) */}
          {formData.type === "page" && (
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                placeholder="https://example.com/page-url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                type="url"
              />
            </div>
          )}

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Enter your content here..."
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={6}
              className="resize-none"
            />
            {formData.wordCount > 0 && (
              <div className="text-xs text-muted-foreground text-right">
                {formData.wordCount} word{formData.wordCount !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                "Creating..."
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Content
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}