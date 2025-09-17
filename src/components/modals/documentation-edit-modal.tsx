// components/modals/documentation-edit-modal.tsx

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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  BookOpen,
  Save,
  X,
  Tag,
  Eye,
  Edit,
  Settings,
  FileText
} from "lucide-react";
import { getTeamMemberById, team } from "@/lib/utils/dummy-data";

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

interface DocumentationEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Documentation | null;
  onSave?: (document: Documentation) => void;
  projectId: string;
}

// Category options
const categoryOptions = [
  { value: "Setup", label: "Setup", icon: "🚀" },
  { value: "API", label: "API", icon: "🔌" },
  { value: "Design", label: "Design", icon: "🎨" },
  { value: "Operations", label: "Operations", icon: "⚙️" },
  { value: "Development", label: "Development", icon: "💻" },
  { value: "Security", label: "Security", icon: "🔒" },
];

// Type options
const typeOptions = [
  { value: "Guide", label: "Guide" },
  { value: "Reference", label: "Reference" },
  { value: "Guidelines", label: "Guidelines" },
  { value: "Checklist", label: "Checklist" },
  { value: "Tutorial", label: "Tutorial" },
  { value: "FAQ", label: "FAQ" },
];

// Status options
const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "review", label: "Under Review" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

// Mock content for editing
const getMockContent = (doc: Documentation) => {
  const baseContent = {
    "doc1": "# Project Setup Guide\n\nThis comprehensive guide will walk you through setting up the project environment from scratch.\n\n## Prerequisites\n\n- Node.js 18 or higher\n- npm or yarn package manager\n- Git version control\n\n## Installation Steps\n\n1. **Clone the repository**\n   ```bash\n   git clone https://github.com/company/project.git\n   cd project\n   ```\n\n2. **Install dependencies**\n   ```bash\n   npm install\n   ```\n\n3. **Environment configuration**\n   Copy the example environment file and configure your settings:\n   ```bash\n   cp .env.example .env\n   ```\n\n## Development Server\n\nStart the development server:\n\n```bash\nnpm run dev\n```\n\nYour application will be available at `http://localhost:3000`.\n\n## Next Steps\n\n- Review the API documentation\n- Check out the design system\n- Run the test suite\n\nFor additional help, reach out to the development team.",
    
    "doc2": "# API Documentation\n\n## Base URL\n```\nhttps://api.example.com/v1\n```\n\n## Authentication\n\nAll API requests require authentication using Bearer tokens:\n\n```bash\nAuthorization: Bearer YOUR_API_TOKEN\n```\n\n## Endpoints\n\n### Projects\n\n#### GET /projects\nRetrieve all projects\n\n**Response:**\n```json\n{\n  \"projects\": [\n    {\n      \"id\": \"p1\",\n      \"title\": \"Marketing Website\",\n      \"status\": \"active\"\n    }\n  ]\n}\n```\n\n#### POST /projects\nCreate a new project\n\n**Request Body:**\n```json\n{\n  \"title\": \"Project Name\",\n  \"description\": \"Project description\"\n}\n```\n\n### Tasks\n\n#### GET /projects/{id}/tasks\nRetrieve tasks for a specific project\n\n#### POST /projects/{id}/tasks\nCreate a new task in a project",
    
    "doc3": "# Design System\n\n## Brand Colors\n\n### Primary Colors\n- **Brand Blue**: #3B82F6\n- **Brand Green**: #10B981\n- **Brand Red**: #EF4444\n\n### Typography\n\n#### Headings\n- **H1**: 2.5rem (40px) - Inter Bold\n- **H2**: 2rem (32px) - Inter Semibold\n- **H3**: 1.5rem (24px) - Inter Medium\n\n#### Body Text\n- **Large**: 1.125rem (18px) - Inter Regular\n- **Base**: 1rem (16px) - Inter Regular\n- **Small**: 0.875rem (14px) - Inter Regular\n\n## Components\n\n### Buttons\n\n#### Primary Button\n```css\nbackground: #3B82F6;\ncolor: white;\npadding: 12px 24px;\nborder-radius: 8px;\n```\n\n#### Secondary Button\n```css\nbackground: transparent;\ncolor: #3B82F6;\nborder: 1px solid #3B82F6;\npadding: 12px 24px;\nborder-radius: 8px;\n```\n\n### Cards\n\nStandard card component with consistent spacing and shadows.",
  };
  
  return baseContent[doc.id as keyof typeof baseContent] || `# ${doc.title}\n\n${doc.description}\n\nThis is a placeholder content for the document. Edit this content to add your documentation.`;
};

export function DocumentationEditModal({
  open,
  onOpenChange,
  document,
  onSave,
  projectId
}: DocumentationEditModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [newTag, setNewTag] = React.useState("");

  // Form state
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    category: "",
    type: "",
    status: "",
    author: "",
    tags: [] as string[],
    content: ""
  });

  // Initialize form data when document changes
  React.useEffect(() => {
    if (document) {
      setFormData({
        title: document.title,
        description: document.description,
        category: document.category,
        type: document.type,
        status: document.status,
        author: document.author,
        tags: [...document.tags],
        content: getMockContent(document)
      });
    } else {
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        type: "",
        status: "draft",
        author: "u1", // Default to first user
        tags: [],
        content: ""
      });
    }
  }, [document, open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
    const wordCount = content.trim().split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200)); // Assuming 200 words per minute
    return { wordCount, readTime };
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    
    const stats = calculateStats(formData.content);
    
    const updatedDocument: Documentation = {
      id: document?.id || `doc-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      type: formData.type,
      status: formData.status,
      author: formData.author,
      projectId: projectId,
      createdAt: document?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: formData.tags,
      wordCount: stats.wordCount,
      readTime: stats.readTime
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSave?.(updatedDocument);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const currentStats = React.useMemo(() => {
    return calculateStats(formData.content);
  }, [formData.content]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Edit className="h-5 w-5 mr-2" />
            {document ? 'Edit Documentation' : 'Create Documentation'}
          </DialogTitle>
          <DialogDescription>
            {document ? 'Update the documentation details and content.' : 'Create a new document for this project.'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">
              <Settings className="h-4 w-4 mr-2" />
              Details
            </TabsTrigger>
            <TabsTrigger value="content">
              <FileText className="h-4 w-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 overflow-y-auto max-h-[60vh]">
            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter document title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of the document"
                  rows={3}
                />
              </div>
            </div>

            {/* Category, Type, Status */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center">
                          <span className="mr-2">{option.icon}</span>
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Author */}
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
                        {member.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Input
                    id="tags"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a tag and press Enter"
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
          </TabsContent>

          <TabsContent value="content" className="space-y-4 overflow-y-auto max-h-[60vh]">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="content">Content</Label>
                <div className="text-xs text-muted-foreground">
                  {currentStats.wordCount} words • {currentStats.readTime}m read
                </div>
              </div>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Enter your documentation content here. You can use Markdown formatting."
                rows={20}
                className="font-mono text-sm"
              />
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4 overflow-y-auto max-h-[60vh]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Preview</h3>
                <div className="text-xs text-muted-foreground">
                  {currentStats.wordCount} words • {currentStats.readTime}m read
                </div>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 min-h-[400px]">
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-sm font-mono text-muted-foreground leading-relaxed">
                    {formData.content || "No content to preview"}
                  </pre>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
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
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {document ? 'Update Document' : 'Create Document'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}