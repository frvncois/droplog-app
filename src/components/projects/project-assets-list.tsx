"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FileImage, 
  Plus, 
  MoreHorizontal, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Upload,
  Search,
  Filter
} from "lucide-react";
import { 
  Project,
  getAssetsByProjectId,
  getTeamMemberById 
} from "@/lib/utils/dummy-data";
import { format } from "date-fns";

interface ProjectAssetsListProps {
  project: Project;
}

export function ProjectAssetsList({ project }: ProjectAssetsListProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  
  const projectAssets = getAssetsByProjectId(project.id);
  
  // Filter assets
  const filteredAssets = React.useMemo(() => {
    let filtered = projectAssets;
    
    if (searchTerm) {
      filtered = filtered.filter(asset => 
        asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.filename.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (typeFilter !== "all") {
      filtered = filtered.filter(asset => asset.type === typeFilter);
    }
    
    return filtered;
  }, [projectAssets, searchTerm, typeFilter]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return "🖼️";
      case "video":
        return "🎥";
      case "pdf":
        return "📄";
      case "document":
        return "📝";
      default:
        return "📁";
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Asset type stats
  const assetTypes = projectAssets.reduce((acc, asset) => {
    acc[asset.type] = (acc[asset.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-0">

          {/* Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="pdf">PDFs</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assets Grid */}
          {filteredAssets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAssets.map((asset) => {
                const addedBy = getTeamMemberById(asset.addedBy);
                const assignedTo = asset.assignedTo ? getTeamMemberById(asset.assignedTo) : null;
                
                return (
                  <Card key={asset.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{getFileIcon(asset.type)}</span>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{asset.title}</h4>
                            <p className="text-sm text-muted-foreground truncate">
                              {asset.filename}
                            </p>
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {asset.type}
                          </Badge>
                          <span className="text-muted-foreground">
                            {formatFileSize(asset.fileSize)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <span className="text-muted-foreground">Added by:</span>
                            {addedBy && (
                              <div className="flex items-center space-x-1">
                                <Avatar className="h-4 w-4">
                                  <AvatarImage src={addedBy.avatarUrl} />
                                  <AvatarFallback className="text-xs">
                                    {addedBy.name.split(" ").map(n => n[0]).join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs">{addedBy.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {assignedTo && (
                          <div className="flex items-center space-x-1">
                            <span className="text-muted-foreground">Assigned to:</span>
                            <div className="flex items-center space-x-1">
                              <Avatar className="h-4 w-4">
                                <AvatarImage src={assignedTo.avatarUrl} />
                                <AvatarFallback className="text-xs">
                                  {assignedTo.name.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs">{assignedTo.name}</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(asset.updatedAt), "MMM d, yyyy")}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileImage className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No assets found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || typeFilter !== "all" 
                  ? "No assets match your current filters." 
                  : "Upload your first asset to get started."}
              </p>
              {(!searchTerm && typeFilter === "all") && (
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload First Asset
                </Button>
              )}
            </div>
          )}
    </div>
  );
}