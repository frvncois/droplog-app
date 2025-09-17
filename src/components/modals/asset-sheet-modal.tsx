
"use client";

import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  User, 
  HardDrive, 
  FileImage,
  FileText,
  Video,
  File,
  Download,
  Share,
  Edit,
  Trash2,
  Copy,
  ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import { Asset, getTeamMemberById, getProjectById } from "@/lib/utils/dummy-data";

interface AssetSheetModalProps {
  asset: Asset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    image: "bg-blue-100 text-blue-800",
    video: "bg-purple-100 text-purple-800",
    pdf: "bg-red-100 text-red-800",
    document: "bg-green-100 text-green-800",
    audio: "bg-yellow-100 text-yellow-800",
    other: "bg-gray-100 text-gray-800"
  };
  return colors[type] || "bg-gray-100 text-gray-800";
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "image":
      return <FileImage className="h-5 w-5 text-blue-500" />;
    case "video":
      return <Video className="h-5 w-5 text-purple-500" />;
    case "pdf":
      return <FileText className="h-5 w-5 text-red-500" />;
    case "document":
      return <FileText className="h-5 w-5 text-green-500" />;
    case "audio":
      return <File className="h-5 w-5 text-yellow-500" />;
    default:
      return <File className="h-5 w-5 text-gray-500" />;
  }
};

const formatFileSize = (bytes: number) => {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 B';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

export function AssetSheetModal({ asset, open, onOpenChange }: AssetSheetModalProps) {
  if (!asset) return null;

  const addedBy = asset.addedBy ? getTeamMemberById(asset.addedBy) : null;
  const project = getProjectById(asset.projectId);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            {getTypeIcon(asset.type)}
            {asset.title}
          </SheetTitle>
          <SheetDescription>
            {asset.filename || asset.description || "Asset details and information"}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Asset Type and Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Type & Size</p>
              <div className="flex items-center gap-2">
                <Badge className={getTypeColor(asset.type)}>
                  {asset.type}
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <HardDrive className="h-4 w-4" />
              <span>
                {asset.fileSize ? formatFileSize(asset.fileSize) : "Unknown size"}
              </span>
            </div>
          </div>

          <Separator />

          {/* Project */}
          {project && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Project</p>
              <div className="flex items-center space-x-2">
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{project.title}</p>
                  <p className="text-xs text-muted-foreground">{project.status}</p>
                </div>
              </div>
            </div>
          )}

          {/* Added By */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Added By</p>
            {addedBy ? (
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={addedBy.avatarUrl} />
                  <AvatarFallback>
                    {addedBy.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{addedBy.name}</p>
                  <p className="text-xs text-muted-foreground">{addedBy.role}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Unknown user</p>
            )}
          </div>

          {/* File URL */}
          {asset.fileUrl && (
            <div className="space-y-2">
              <p className="text-sm font-medium">File Location</p>
              <div className="flex items-center space-x-2">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={asset.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 underline truncate"
                >
                  {asset.fileUrl}
                </a>
              </div>
            </div>
          )}

          <Separator />

          {/* Timestamps */}
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Created:</span>
              <span>{format(new Date(asset.createdAt), "MMM d, yyyy 'at' h:mm a")}</span>
            </div>
            <div className="flex justify-between">
              <span>Updated:</span>
              <span>{format(new Date(asset.updatedAt), "MMM d, yyyy 'at' h:mm a")}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Share className="h-4 w-4" />
                Share
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Copy className="h-4 w-4" />
                Duplicate
              </Button>
            </div>
            <Button variant="destructive" size="sm" className="w-full flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Delete Asset
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