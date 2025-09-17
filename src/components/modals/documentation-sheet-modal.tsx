// components/modals/documentation-sheet-modal.tsx

"use client";

import * as React from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookOpen,
  Calendar,
  Clock,
  Eye,
  Edit,
  Copy,
  Trash2,
  MoreVertical,
  Tag,
  User,
  FileText,
  ExternalLink
} from "lucide-react";
import { getTeamMemberById } from "@/lib/utils/dummy-data";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

// Documentation interface (matching the one in project-documentation.tsx)
interface Documentation {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  status: string;
  author: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  wordCount: number;
  readTime: number;
}

interface DocumentationSheetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Documentation | null;
  onEdit?: (document: Documentation) => void;
  onDelete?: (documentId: string) => void;
  onDuplicate?: (document: Documentation) => void;
  onView?: (document: Documentation) => void;
}

// Category icons
const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    API: "🔌",
    Design: "🎨",
    Setup: "🚀",
    Operations: "⚙️",
    Development: "💻",
    Security: "🔒"
  };
  return icons[category] || "📄";
};

// Status colors
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    published: "bg-green-100 text-green-800",
    draft: "bg-yellow-100 text-yellow-800",
    review: "bg-blue-100 text-blue-800",
    archived: "bg-gray-100 text-gray-800"
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

// Mock document content for preview
const getMockContent = (doc: Documentation) => {
  const baseContent = {
    "doc1": "# Project Setup Guide\n\nThis comprehensive guide will walk you through setting up the project environment from scratch.\n\n## Prerequisites\n\n- Node.js 18 or higher\n- npm or yarn package manager\n- Git version control\n\n## Installation Steps\n\n1. **Clone the repository**\n   ```bash\n   git clone https://github.com/company/project.git\n   cd project\n   ```\n\n2. **Install dependencies**\n   ```bash\n   npm install\n   ```\n\n3. **Environment configuration**\n   Copy the example environment file and configure your settings:\n   ```bash\n   cp .env.example .env\n   ```\n\n## Development Server\n\nStart the development server:\n\n```bash\nnpm run dev\n```\n\nYour application will be available at `http://localhost:3000`.\n\n## Next Steps\n\n- Review the API documentation\n- Check out the design system\n- Run the test suite\n\nFor additional help, reach out to the development team.",
    
    "doc2": "# API Documentation\n\n## Base URL\n```\nhttps://api.example.com/v1\n```\n\n## Authentication\n\nAll API requests require authentication using Bearer tokens:\n\n```bash\nAuthorization: Bearer YOUR_API_TOKEN\n```\n\n## Endpoints\n\n### Projects\n\n#### GET /projects\nRetrieve all projects\n\n**Response:**\n```json\n{\n  \"projects\": [\n    {\n      \"id\": \"p1\",\n      \"title\": \"Marketing Website\",\n      \"status\": \"active\"\n    }\n  ]\n}\n```\n\n#### POST /projects\nCreate a new project\n\n**Request Body:**\n```json\n{\n  \"title\": \"Project Name\",\n  \"description\": \"Project description\"\n}\n```\n\n### Tasks\n\n#### GET /projects/{id}/tasks\nRetrieve tasks for a specific project\n\n#### POST /projects/{id}/tasks\nCreate a new task in a project",
    
    "doc3": "# Design System\n\n## Brand Colors\n\n### Primary Colors\n- **Brand Blue**: #3B82F6\n- **Brand Green**: #10B981\n- **Brand Red**: #EF4444\n\n### Typography\n\n#### Headings\n- **H1**: 2.5rem (40px) - Inter Bold\n- **H2**: 2rem (32px) - Inter Semibold\n- **H3**: 1.5rem (24px) - Inter Medium\n\n#### Body Text\n- **Large**: 1.125rem (18px) - Inter Regular\n- **Base**: 1rem (16px) - Inter Regular\n- **Small**: 0.875rem (14px) - Inter Regular\n\n## Components\n\n### Buttons\n\n#### Primary Button\n```css\nbackground: #3B82F6;\ncolor: white;\npadding: 12px 24px;\nborder-radius: 8px;\n```\n\n#### Secondary Button\n```css\nbackground: transparent;\ncolor: #3B82F6;\nborder: 1px solid #3B82F6;\npadding: 12px 24px;\nborder-radius: 8px;\n```\n\n### Cards\n\nStandard card component with consistent spacing and shadows.",
  };
  
  return baseContent[doc.id as keyof typeof baseContent] || `# ${doc.title}\n\n${doc.description}\n\nThis is a placeholder content for the document. In a real application, this would contain the actual document content stored in your database or content management system.`;
};

export function DocumentationSheetModal({
  open,
  onOpenChange,
  document,
  onEdit,
  onDelete,
  onDuplicate,
  onView
}: DocumentationSheetModalProps) {
  if (!document) return null;

  const author = getTeamMemberById(document.author);
  const createdDate = parseISO(document.createdAt);
  const updatedDate = parseISO(document.updatedAt);
  const mockContent = getMockContent(document);

  const handleAction = (action: string) => {
    switch (action) {
      case 'edit':
        onEdit?.(document);
        break;
      case 'delete':
        onDelete?.(document.id);
        break;
      case 'duplicate':
        onDuplicate?.(document);
        break;
      case 'view':
        onView?.(document);
        break;
      case 'copy':
        navigator.clipboard.writeText(`${window.location.origin}/docs/${document.id}`);
        break;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:w-[800px] max-w-[90vw] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <div className="text-3xl mt-1">{getCategoryIcon(document.category)}</div>
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-xl line-height-tight pr-4">
                  {document.title}
                </SheetTitle>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="secondary" className={cn("text-xs", getStatusColor(document.status))}>
                    {document.status}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {document.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {document.type}
                  </Badge>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleAction('view')}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open in full view
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction('edit')}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit document
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction('copy')}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction('duplicate')}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600" 
                  onClick={() => handleAction('delete')}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {document.description && (
            <SheetDescription className="text-left mt-3">
              {document.description}
            </SheetDescription>
          )}
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Document Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-sm font-medium">{document.wordCount}</div>
              <div className="text-xs text-muted-foreground">Words</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-sm font-medium">{document.readTime}m</div>
              <div className="text-xs text-muted-foreground">Read time</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Eye className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-sm font-medium">{Math.floor(Math.random() * 50) + 10}</div>
              <div className="text-xs text-muted-foreground">Views</div>
            </div>
          </div>

          <Separator />

          {/* Author and Dates */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Document Info</h3>
            
            <div className="space-y-3">
              {/* Author */}
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-gray-400" />
                <div className="flex items-center space-x-2">
                  {author && (
                    <>
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={author.avatarUrl} />
                        <AvatarFallback className="text-xs">
                          {author.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{author.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {author.role}
                      </Badge>
                    </>
                  )}
                </div>
              </div>

              {/* Created Date */}
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm">Created {format(createdDate, "MMMM d, yyyy 'at' h:mm a")}</p>
                </div>
              </div>

              {/* Updated Date */}
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm">Last updated {format(updatedDate, "MMMM d, yyyy 'at' h:mm a")}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Tags */}
          {document.tags.length > 0 && (
            <>
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900 flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {document.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Content Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Content Preview
              </h3>
              <Button variant="outline" size="sm" onClick={() => handleAction('view')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Full View
              </Button>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-4 max-h-96 overflow-y-auto">
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm font-mono text-muted-foreground leading-relaxed">
                  {mockContent}
                </pre>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 pt-4 border-t">
            <Button onClick={() => handleAction('edit')} className="flex-1">
              <Edit className="h-4 w-4 mr-2" />
              Edit Document
            </Button>
            <Button variant="outline" onClick={() => handleAction('view')}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Full View
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}