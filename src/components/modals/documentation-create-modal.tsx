// components/modals/documentation-create-modal.tsx

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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  Save,
  X,
  Tag,
  BookOpen,
  FileText,
  Sparkles
} from "lucide-react";
import { team } from "@/lib/utils/dummy-data";

// Documentation interface
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

interface DocumentationCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDocumentCreated?: (document: Documentation) => void;
  projectId: string;
}

// Category options
const categoryOptions = [
  { value: "Setup", label: "Setup", icon: "🚀", description: "Installation and configuration guides" },
  { value: "API", label: "API", icon: "🔌", description: "API documentation and references" },
  { value: "Design", label: "Design", icon: "🎨", description: "Design systems and brand guidelines" },
  { value: "Operations", label: "Operations", icon: "⚙️", description: "Deployment and operational procedures" },
  { value: "Development", label: "Development", icon: "💻", description: "Development guidelines and best practices" },
  { value: "Security", label: "Security", icon: "🔒", description: "Security policies and compliance docs" },
];

// Type options
const typeOptions = [
  { value: "Guide", label: "Guide", description: "Step-by-step instructions" },
  { value: "Reference", label: "Reference", description: "Quick reference materials" },
  { value: "Guidelines", label: "Guidelines", description: "Standards and best practices" },
  { value: "Checklist", label: "Checklist", description: "Task lists and verification items" },
  { value: "Tutorial", label: "Tutorial", description: "Learning-focused walkthroughs" },
  { value: "FAQ", label: "FAQ", description: "Frequently asked questions" },
];

// Document templates
const documentTemplates = {
  "Setup-Guide": {
    title: "Project Setup Guide",
    description: "Complete guide for setting up the project environment",
    content: `# Project Setup Guide

## Prerequisites

List the required software, tools, and dependencies needed before starting.

- Node.js 18 or higher
- npm or yarn package manager
- Git version control

## Installation Steps

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/your-org/project.git
cd project
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Configuration
Copy the example environment file and configure your settings:
\`\`\`bash
cp .env.example .env
\`\`\`

## Development Server

Start the development server:
\`\`\`bash
npm run dev
\`\`\`

Your application will be available at \`http://localhost:3000\`.

## Next Steps

- Review the API documentation
- Check out the design system
- Run the test suite

## Troubleshooting

Common issues and their solutions:

### Issue 1: Port already in use
Solution: Change the port in your environment configuration or stop the process using the port.

### Issue 2: Dependencies not found
Solution: Delete node_modules and package-lock.json, then run npm install again.

## Support

For additional help, reach out to the development team or check our FAQ section.`,
    tags: ["setup", "getting-started", "installation"]
  },
  "API-Reference": {
    title: "API Reference",
    description: "Complete API documentation with endpoints and examples",
    content: `# API Reference

## Base URL
\`\`\`
https://api.example.com/v1
\`\`\`

## Authentication

All API requests require authentication using Bearer tokens:

\`\`\`bash
Authorization: Bearer YOUR_API_TOKEN
\`\`\`

## Rate Limiting

- 1000 requests per hour for authenticated users
- 100 requests per hour for unauthenticated requests

## Response Format

All responses are returned in JSON format:

\`\`\`json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "timestamp": "2025-01-01T00:00:00Z"
}
\`\`\`

## Error Codes

| Code | Description |
|------|-------------|
| 400  | Bad Request |
| 401  | Unauthorized |
| 403  | Forbidden |
| 404  | Not Found |
| 500  | Internal Server Error |

## Endpoints

### Projects

#### GET /projects
Retrieve all projects

**Parameters:**
- \`limit\` (optional): Number of projects to return (default: 10)
- \`offset\` (optional): Number of projects to skip (default: 0)

**Response:**
\`\`\`json
{
  "projects": [
    {
      "id": "p1",
      "title": "Marketing Website",
      "status": "active",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 25,
  "limit": 10,
  "offset": 0
}
\`\`\`

#### POST /projects
Create a new project

**Request Body:**
\`\`\`json
{
  "title": "Project Name",
  "description": "Project description",
  "status": "active"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "p2",
    "title": "Project Name",
    "status": "active",
    "created_at": "2025-01-01T00:00:00Z"
  }
}
\`\`\`

## SDKs and Libraries

We provide official SDKs for popular programming languages:

- [JavaScript/Node.js SDK](https://github.com/company/js-sdk)
- [Python SDK](https://github.com/company/python-sdk)
- [PHP SDK](https://github.com/company/php-sdk)`,
    tags: ["api", "endpoints", "reference", "authentication"]
  },
  "Design-Guidelines": {
    title: "Design System",
    description: "Brand guidelines and design system documentation",
    content: `# Design System

## Brand Identity

### Logo Usage

Guidelines for using the company logo across different mediums and contexts.

### Color Palette

#### Primary Colors
- **Brand Blue**: #3B82F6 (RGB: 59, 130, 246)
- **Brand Green**: #10B981 (RGB: 16, 185, 129)
- **Brand Red**: #EF4444 (RGB: 239, 68, 68)

#### Secondary Colors
- **Gray 50**: #F9FAFB
- **Gray 100**: #F3F4F6
- **Gray 500**: #6B7280
- **Gray 900**: #111827

### Typography

#### Fonts
- **Primary Font**: Inter (Headings and UI)
- **Secondary Font**: Source Code Pro (Code blocks)

#### Font Sizes
- **H1**: 2.5rem (40px) - Inter Bold
- **H2**: 2rem (32px) - Inter Semibold
- **H3**: 1.5rem (24px) - Inter Medium
- **H4**: 1.25rem (20px) - Inter Medium
- **Body Large**: 1.125rem (18px) - Inter Regular
- **Body**: 1rem (16px) - Inter Regular
- **Body Small**: 0.875rem (14px) - Inter Regular

## Components

### Buttons

#### Primary Button
\`\`\`css
background: #3B82F6;
color: white;
padding: 12px 24px;
border-radius: 8px;
font-weight: 500;
font-size: 14px;
\`\`\`

#### Secondary Button
\`\`\`css
background: transparent;
color: #3B82F6;
border: 1px solid #3B82F6;
padding: 12px 24px;
border-radius: 8px;
font-weight: 500;
font-size: 14px;
\`\`\`

#### Button States
- **Hover**: Darken background by 10%
- **Active**: Darken background by 15%
- **Disabled**: 50% opacity
- **Focus**: Blue outline with 2px offset

### Cards

Standard card component specifications:
- **Background**: White (#FFFFFF)
- **Border**: 1px solid #E5E7EB
- **Border Radius**: 8px
- **Shadow**: 0 1px 3px rgba(0, 0, 0, 0.1)
- **Padding**: 24px

### Forms

#### Input Fields
\`\`\`css
border: 1px solid #D1D5DB;
border-radius: 6px;
padding: 10px 12px;
font-size: 14px;
background: white;
\`\`\`

#### Input States
- **Focus**: Blue border (#3B82F6)
- **Error**: Red border (#EF4444)
- **Disabled**: Gray background (#F3F4F6)

## Spacing

Use the 8-point grid system:
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px

## Accessibility

- Maintain WCAG 2.1 AA compliance
- Minimum contrast ratio of 4.5:1 for text
- Use semantic HTML elements
- Provide alt text for images
- Ensure keyboard navigation`,
    tags: ["design", "branding", "components", "accessibility"]
  }
};

export function DocumentationCreateModal({
  open,
  onOpenChange,
  onDocumentCreated,
  projectId
}: DocumentationCreateModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [newTag, setNewTag] = React.useState("");
  const [selectedTemplate, setSelectedTemplate] = React.useState<string>("");

  // Form state
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    category: "",
    type: "",
    status: "draft",
    author: "u1", // Default to first user
    tags: [] as string[],
    content: ""
  });

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (open) {
      setFormData({
        title: "",
        description: "",
        category: "",
        type: "",
        status: "draft",
        author: "u1",
        tags: [],
        content: ""
      });
      setSelectedTemplate("");
    }
  }, [open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTemplateSelect = (templateKey: string) => {
    const template = documentTemplates[templateKey as keyof typeof documentTemplates];
    if (template) {
      setFormData(prev => ({
        ...prev,
        title: template.title,
        description: template.description,
        content: template.content,
        tags: template.tags
      }));
      setSelectedTemplate(templateKey);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const calculateStats = (content: string) => {
    const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200)); // Assuming 200 words per minute
    return { wordCount, readTime };
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.category || !formData.type) return;

    setIsSubmitting(true);
    
    const stats = calculateStats(formData.content);
    
    const newDocument: Documentation = {
      id: `doc-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      type: formData.type,
      status: formData.status,
      author: formData.author,
      projectId: projectId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: formData.tags,
      wordCount: stats.wordCount,
      readTime: stats.readTime
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onDocumentCreated?.(newDocument);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const availableTemplates = React.useMemo(() => {
    if (!formData.category || !formData.type) return [];
    
    return Object.entries(documentTemplates).filter(([key]) => {
      const [category, type] = key.split('-');
      return category === formData.category && type === formData.type;
    });
  }, [formData.category, formData.type]);

  const currentStats = React.useMemo(() => {
    return calculateStats(formData.content);
  }, [formData.content]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Create New Documentation
          </DialogTitle>
          <DialogDescription>
            Create a new document for this project. You can start from scratch or use a template.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Document Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter a descriptive title for your document"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of what this document covers"
                rows={2}
              />
            </div>
          </div>

          {/* Category and Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-start space-x-2">
                        <span className="text-base">{option.icon}</span>
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-muted-foreground">{option.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Document Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Template Selection */}
          {availableTemplates.length > 0 && (
            <div className="space-y-3">
              <Label>Quick Start Template</Label>
              <div className="grid gap-2">
                {availableTemplates.map(([key, template]) => (
                  <Button
                    key={key}
                    type="button"
                    variant={selectedTemplate === key ? "default" : "outline"}
                    className="justify-start h-auto p-3"
                    onClick={() => handleTemplateSelect(key)}
                  >
                    <div className="flex items-center space-x-3">
                      <Sparkles className="h-4 w-4" />
                      <div className="text-left">
                        <div className="font-medium">{template.title}</div>
                        <div className="text-xs opacity-80">{template.description}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Author and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Select value={formData.author} onValueChange={(value) => handleInputChange('author', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select author" />
                </SelectTrigger>
                <SelectContent>
                  {team.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center">
                        <Avatar className="h-5 w-5 mr-2">
                          <AvatarImage src={member.avatarUrl} />
                          <AvatarFallback className="text-xs">
                            {member.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-xs text-muted-foreground">{member.role}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Initial Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="review">Under Review</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (Optional)</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Input
                  id="tags"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add tags to help organize your document"
                />
                <Button type="button" onClick={handleAddTag} variant="outline" size="sm">
                  <Tag className="h-4 w-4" />
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="content">Initial Content (Optional)</Label>
              <div className="text-xs text-muted-foreground">
                {currentStats.wordCount} words • {currentStats.readTime}m read
              </div>
            </div>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="You can add initial content here or leave empty to start with a blank document. Markdown formatting is supported."
              rows={8}
              className="font-mono text-sm"
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!formData.title.trim() || !formData.category || !formData.type || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                Creating...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Create Document
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}