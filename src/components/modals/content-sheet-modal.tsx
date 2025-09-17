// components/modals/content-sheet-modal.tsx

"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Edit,
  Calendar,
  User,
  FileText,
  Globe,
  Mail,
  Share2,
  Wand2,
  Languages,
  Copy,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Content, getTeamMemberById } from "@/lib/utils/dummy-data";

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "draft":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "blog_post":
      return "bg-purple-100 text-purple-800";
    case "email":
      return "bg-blue-100 text-blue-800";
    case "social":
      return "bg-pink-100 text-pink-800";
    case "page":
      return "bg-green-100 text-green-800";
    case "other":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "blog_post":
      return <FileText className="h-4 w-4 text-purple-500" />;
    case "email":
      return <Mail className="h-4 w-4 text-blue-500" />;
    case "social":
      return <Share2 className="h-4 w-4 text-pink-500" />;
    case "page":
      return <Globe className="h-4 w-4 text-green-500" />;
    case "other":
      return <FileText className="h-4 w-4 text-gray-500" />;
    default:
      return <FileText className="h-4 w-4 text-gray-500" />;
  }
};

interface ContentSheetModalProps {
  content: Content | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContentSheetModal({ content, open, onOpenChange }: ContentSheetModalProps) {
  if (!content) return null;

  const assignee = content.assignedTo ? getTeamMemberById(content.assignedTo) : null;
  const createdDate = new Date(content.createdAt);
  const updatedDate = new Date(content.updatedAt);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-secondary">
              {getTypeIcon(content.type)}
            </div>
            <div className="flex-1">
              <SheetTitle className="text-xl">{content.title}</SheetTitle>
              <SheetDescription className="mt-1">
                Content details and information
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status and Type */}
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(content.status)}>
              {content.status}
            </Badge>
            <Badge className={getTypeColor(content.type)}>
              {content.type.replace("_", " ")}
            </Badge>
          </div>

          {/* Content Preview */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Content Preview</h3>
            <div className="p-3 rounded-md bg-muted/50 border">
              <p className="text-sm text-muted-foreground">
                {content.content || "No content available"}
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Details</h3>
            
            {/* Word Count */}
            {content.wordCount && (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{content.wordCount} words</span>
              </div>
            )}

            {/* Assignee */}
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              {assignee ? (
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={assignee.avatarUrl} />
                    <AvatarFallback className="text-xs">
                      {assignee.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{assignee.name}</span>
                  <span className="text-xs text-muted-foreground">({assignee.role})</span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Unassigned</span>
              )}
            </div>

            {/* Created Date */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Created {format(createdDate, "PPP 'at' p")}
              </span>
            </div>

            {/* Updated Date */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Updated {format(updatedDate, "PPP 'at' p")}
              </span>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => console.log('Edit content:', content.title)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => console.log('Duplicate content:', content.title)}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </Button>
              <Button variant="outline" size="sm" onClick={() => console.log('AI optimize:', content.title)}>
                <Wand2 className="h-4 w-4 mr-2" />
                AI Optimize
              </Button>
              <Button variant="outline" size="sm" onClick={() => console.log('Translate:', content.title)}>
                <Languages className="h-4 w-4 mr-2" />
                Translate
              </Button>
            </div>
          </div>

          {/* URL if it's a page */}
          {content.type === "page" && content.url && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">URL</h3>
              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50 border">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={content.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline truncate"
                >
                  {content.url}
                </a>
              </div>
            </div>
          )}

          <Separator />

          {/* Danger Zone */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-red-600">Danger Zone</h3>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => {
                if (confirm(`Are you sure you want to delete "${content.title}"?`)) {
                  console.log('Delete content:', content.title);
                  onOpenChange(false);
                }
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Content
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}