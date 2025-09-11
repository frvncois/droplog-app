"use client";

import { useState, useRef } from "react";
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
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileImage, 
  Loader2,
  X,
  File,
  Image,
  Video,
  FileText
} from "lucide-react";
import { projects, team } from "@/lib/utils/dummy-data";

interface UploadAssetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
  trigger?: React.ReactNode;
}

interface FileUpload {
  file: File;
  title: string;
  description: string;
  type: "image" | "video" | "pdf" | "document" | "other";
}

export function UploadAssetModal({ open, onOpenChange, projectId, trigger }: UploadAssetModalProps) {
  const [formData, setFormData] = useState({
    projectId: projectId || "",
    assignedTo: "",
  });
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setFormData({
      projectId: projectId || "",
      assignedTo: "",
    });
    setUploads([]);
    setUploadProgress(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploads.length === 0) return;

    setIsLoading(true);
    setUploadProgress(0);

    try {
      // Simulate file upload with progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Here you would typically upload files to your storage service
      console.log("Uploading assets:", { formData, uploads });
      
      // Close modal and reset form
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Error uploading assets:", error);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const detectFileType = (file: File): FileUpload["type"] => {
    const mimeType = file.type;
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType === "application/pdf") return "pdf";
    if (mimeType.includes("document") || mimeType.includes("text") || 
        mimeType.includes("word") || mimeType.includes("sheet")) return "document";
    return "other";
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newUploads: FileUpload[] = files.map(file => ({
      file,
      title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
      description: "",
      type: detectFileType(file),
    }));
    
    setUploads(prev => [...prev, ...newUploads]);
  };

  const updateUpload = (index: number, field: keyof Omit<FileUpload, "file">, value: string) => {
    setUploads(prev => prev.map((upload, i) => 
      i === index ? { ...upload, [field]: value } : upload
    ));
  };

  const removeUpload = (index: number) => {
    setUploads(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (type: FileUpload["type"]) => {
    switch (type) {
      case "image":
        return Image;
      case "video":
        return Video;
      case "pdf":
      case "document":
        return FileText;
      default:
        return File;
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            <FileImage className="h-5 w-5" />
            Upload Assets
          </DialogTitle>
          <DialogDescription>
            Upload files and organize them for your project team.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          {/* File Upload Area */}
          <div className="space-y-4">
            <Label>Upload Files</Label>
            <div 
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
              <div className="space-y-2">
                <p className="text-sm font-medium">Click to upload files</p>
                <p className="text-xs text-muted-foreground">
                  Support for images, videos, PDFs, and documents
                </p>
                <p className="text-xs text-muted-foreground">
                  Maximum file size: 50MB per file
                </p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx,.txt,.md"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Uploaded Files List */}
          {uploads.length > 0 && (
            <div className="space-y-4">
              <Label>Files to Upload ({uploads.length})</Label>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {uploads.map((upload, index) => {
                  const Icon = getFileIcon(upload.type);
                  return (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-muted rounded-lg">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{upload.file.name}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <Badge variant="outline" className="text-xs">
                                {upload.type}
                              </Badge>
                              <span>{formatFileSize(upload.file.size)}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeUpload(index)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Asset Title</Label>
                          <Input
                            placeholder="Enter asset title"
                            value={upload.title}
                            onChange={(e) => updateUpload(index, "title", e.target.value)}
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Type</Label>
                          <Select
                            value={upload.type}
                            onValueChange={(value) => updateUpload(index, "type", value as FileUpload["type"])}
                          >
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="image">Image</SelectItem>
                              <SelectItem value="video">Video</SelectItem>
                              <SelectItem value="pdf">PDF</SelectItem>
                              <SelectItem value="document">Document</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <Label className="text-xs">Description</Label>
                        <Textarea
                          placeholder="Optional description"
                          value={upload.description}
                          onChange={(e) => updateUpload(index, "description", e.target.value)}
                          rows={2}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {isLoading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading files...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Upload Summary */}
          {uploads.length > 0 && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-sm">Upload Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total files:</span>
                  <span>{uploads.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total size:</span>
                  <span>{formatFileSize(uploads.reduce((sum, upload) => sum + upload.file.size, 0))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Images:</span>
                  <span>{uploads.filter(u => u.type === "image").length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Documents:</span>
                  <span>{uploads.filter(u => u.type === "pdf" || u.type === "document").length}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || uploads.length === 0 || !formData.projectId}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upload {uploads.length} {uploads.length === 1 ? "File" : "Files"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}