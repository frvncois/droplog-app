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
  FileText, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Copy,
  Trash2,
  Search,
  BookOpen,
  Mail,
  MessageSquare
} from "lucide-react";
import { 
  Project,
  Content,
  getContentByProjectId,
  getTeamMemberById 
} from "@/lib/utils/dummy-data";
import { format } from "date-fns";

interface ProjectContentListProps {
  project: Project;
}

export function ProjectContentList({ project }: ProjectContentListProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  
  const projectContent = getContentByProjectId(project.id);
  
  // Filter content
  const filteredContent = React.useMemo(() => {
    let filtered = projectContent;
    
    if (searchTerm) {
      filtered = filtered.filter(content => 
        content.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(content => content.status === statusFilter);
    }
    
    if (typeFilter !== "all") {
      filtered = filtered.filter(content => content.type === typeFilter);
    }
    
    return filtered;
  }, [projectContent, searchTerm, statusFilter, typeFilter]);

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "blog_post":
        return BookOpen;
      case "email":
        return Mail;
      case "social":
        return MessageSquare;
      case "page":
        return FileText;
      default:
        return FileText;
    }
  };

  // Content type stats
  const contentStats = projectContent.reduce((acc, content) => {
    acc[content.status] = (acc[content.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Content List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Project Content</CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Content
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="blog_post">Blog Post</SelectItem>
                <SelectItem value="page">Page</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content List */}
          {filteredContent.length > 0 ? (
            <div className="space-y-4">
              {filteredContent.map((content: Content) => {
                const assignedTo = content.assignedTo ? getTeamMemberById(content.assignedTo) : null;
                const TypeIcon = getTypeIcon(content.type);
                
                return (
                  <Card key={content.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="p-2 bg-muted rounded-lg">
                            <TypeIcon className="h-4 w-4" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium">{content.title}</h4>
                              <Badge variant="outline" className={getStatusColor(content.status)}>
                                {content.status}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {content.type.replace("_", " ")}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-2">
                              {content.content ? 
                                content.content.slice(0, 120) + (content.content.length > 120 ? "..." : "") :
                                "No content preview available"
                              }
                            </p>
                            
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              {assignedTo && (
                                <div className="flex items-center space-x-1">
                                  <Avatar className="h-4 w-4">
                                    <AvatarImage src={assignedTo.avatarUrl} />
                                    <AvatarFallback className="text-xs">
                                      {assignedTo.name.split(" ").map(n => n[0]).join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>{assignedTo.name}</span>
                                </div>
                              )}
                              
                              {content.wordCount && (
                                <span>{content.wordCount} words</span>
                              )}
                              
                              <span>
                                Updated {format(new Date(content.updatedAt), "MMM d, yyyy")}
                              </span>
                            </div>
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
                              View Content
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Content
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {content.status === "draft" && (
                              <DropdownMenuItem>
                                Submit for Review
                              </DropdownMenuItem>
                            )}
                            {content.status === "approved" && (
                              <DropdownMenuItem>
                                Publish Content
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No content found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all" || typeFilter !== "all" 
                  ? "No content matches your current filters." 
                  : "Create your first piece of content to get started."}
              </p>
              {(!searchTerm && statusFilter === "all" && typeFilter === "all") && (
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Content
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}