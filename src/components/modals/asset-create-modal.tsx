// components/modals/asset-create-modal.tsx

"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
import { Upload, FileImage, FileText, Video, File } from "lucide-react";
import { Asset, team } from "@/lib/utils/dummy-data";

interface AssetCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onCreateAsset: (asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function AssetCreateModal({ 
  open, 
  onOpenChange, 
  projectId, 
  onCreateAsset 
}: AssetCreateModalProps) {
  const [title, setTitle] = React.useState("");
  const [filename, setFilename] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [type, setType] = React.useState<Asset['type']>("other");
  const [fileSize, setFileSize] = React.useState("");
  const [fileUrl, setFileUrl] = React.useState("");
  const [addedBy, setAddedBy] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const resetForm = () => {
    setTitle("");
    setFilename("");
    setDescription("");
    setType("other");
    setFileSize("");
    setFileUrl("");
    setAddedBy("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    
    try {
      const assetData: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'> = {
        projectId,
        title: title.trim(),
        filename: filename.trim() || undefined,
        description: description.trim() || undefined,
        type,
        fileSize: fileSize ? parseInt(fileSize) : undefined,
        fileUrl: fileUrl.trim() || undefined,
        addedBy: addedBy || team[0].id, // Default to first team member
      };

      onCreateAsset(assetData);
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error creating asset:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return <FileImage className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "pdf":
      case "document":
        return <FileText className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Add New Asset
          </DialogTitle>
          <DialogDescription>
            Upload a new file or asset to this project. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Asset Name *</Label>
            <Input
              id="title"
              placeholder="Enter asset name..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Filename */}
          <div className="space-y-2">
            <Label htmlFor="filename">Filename</Label>
            <Input
              id="filename"
              placeholder="e.g. hero-banner.jpg"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the asset..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          {/* File Type */}
          <div className="space-y-2">
            <Label htmlFor="type">File Type</Label>
            <Select value={type} onValueChange={(value) => setType(value as Asset['type'])}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  {getTypeIcon(type)}
                  <SelectValue placeholder="Select file type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image">
                  <div className="flex items-center gap-2">
                    <FileImage className="h-4 w-4" />
                    Image
                  </div>
                </SelectItem>
                <SelectItem value="video">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Video
                  </div>
                </SelectItem>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    PDF
                  </div>
                </SelectItem>
                <SelectItem value="document">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Document
                  </div>
                </SelectItem>
                <SelectItem value="audio">
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4" />
                    Audio
                  </div>
                </SelectItem>
                <SelectItem value="other">
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4" />
                    Other
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File Size */}
          <div className="space-y-2">
            <Label htmlFor="fileSize">File Size (bytes)</Label>
            <Input
              id="fileSize"
              type="number"
              placeholder="e.g. 1024000"
              value={fileSize}
              onChange={(e) => setFileSize(e.target.value)}
            />
          </div>

          {/* File URL */}
          <div className="space-y-2">
            <Label htmlFor="fileUrl">File URL</Label>
            <Input
              id="fileUrl"
              placeholder="https://example.com/file.jpg"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
            />
          </div>

          {/* Added By */}
          <div className="space-y-2">
            <Label htmlFor="addedBy">Added By</Label>
            <Select value={addedBy} onValueChange={setAddedBy}>
              <SelectTrigger>
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                {team.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={member.avatarUrl} />
                        <AvatarFallback className="text-xs">
                          {member.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{member.name}</span>
                        <span className="text-xs text-muted-foreground">{member.role}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
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
              disabled={!title.trim() || isLoading}
              className="flex-1"
            >
              {isLoading ? "Creating..." : "Create Asset"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}