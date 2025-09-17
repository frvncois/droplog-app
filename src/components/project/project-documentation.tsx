// components/projects/project-documentation.tsx - CLEANED

"use client";

import * as React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  Plus,
  MoreVertical,
  Eye,
  Search,
  SortAsc,
  GripVertical,
  Edit,
  Copy,
  Trash2,
  BookOpen,
  Calendar
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Project,
  getTeamMemberById 
} from "@/lib/utils/dummy-data";
import { formatRelativeTime } from "@/lib/utils";
import { DocumentCreateModal } from "@/components/modals/document-create-modal";

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

// Mock project documentation data
const getProjectDocumentation = (projectId: string): Documentation[] => [
  {
    id: "doc1",
    title: "Project Setup Guide",
    description: "Complete guide for setting up this project with all necessary configurations and dependencies.",
    category: "Setup",
    type: "Guide",
    status: "published",
    author: "u1",
    projectId: projectId,
    createdAt: "2025-09-01T10:00:00Z",
    updatedAt: "2025-09-10T14:30:00Z",
    tags: ["setup", "getting-started", "configuration"],
    wordCount: 1250,
    readTime: 5
  },
  {
    id: "doc2",
    title: "API Documentation",
    description: "Comprehensive RESTful API endpoints documentation with examples and response formats.",
    category: "API",
    type: "Reference",
    status: "published",
    author: "u2",
    projectId: projectId,
    createdAt: "2025-08-15T09:00:00Z",
    updatedAt: "2025-09-08T16:45:00Z",
    tags: ["api", "endpoints", "integration"],
    wordCount: 3200,
    readTime: 12
  },
  {
    id: "doc3",
    title: "Design System",
    description: "Brand guidelines, color palettes, typography, and component library specifications.",
    category: "Design",
    type: "Guidelines",
    status: "draft",
    author: "u3",
    projectId: projectId,
    createdAt: "2025-09-05T11:20:00Z",
    updatedAt: "2025-09-11T10:15:00Z",
    tags: ["design", "branding", "components"],
    wordCount: 890,
    readTime: 4
  },
  {
    id: "doc4",
    title: "Deployment Guide",
    description: "Step-by-step deployment procedures for production and staging environments.",
    category: "Operations",
    type: "Guide",
    status: "review",
    author: "u2",
    projectId: projectId,
    createdAt: "2025-09-07T13:30:00Z",
    updatedAt: "2025-09-09T09:20:00Z",
    tags: ["deployment", "operations", "production"],
    wordCount: 1800,
    readTime: 7
  },
  {
    id: "doc5",
    title: "Testing Guidelines",
    description: "Best practices for unit testing, integration testing, and end-to-end testing strategies.",
    category: "Development",
    type: "Guidelines",
    status: "published",
    author: "u1",
    projectId: projectId,
    createdAt: "2025-08-20T14:00:00Z",
    updatedAt: "2025-09-05T11:30:00Z",
    tags: ["testing", "quality", "automation"],
    wordCount: 2100,
    readTime: 8
  },
  {
    id: "doc6",
    title: "Security Checklist",
    description: "Essential security measures and compliance requirements for the application.",
    category: "Security",
    type: "Checklist",
    status: "review",
    author: "u3",
    projectId: projectId,
    createdAt: "2025-09-03T16:45:00Z",
    updatedAt: "2025-09-08T09:15:00Z",
    tags: ["security", "compliance", "audit"],
    wordCount: 950,
    readTime: 4
  }
];

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

// Category filter options
const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "Setup", label: "Setup" },
  { value: "API", label: "API" },
  { value: "Design", label: "Design" },
  { value: "Operations", label: "Operations" },
  { value: "Development", label: "Development" },
  { value: "Security", label: "Security" },
];

// Sort options
const sortOptions = [
  { value: "updatedAt", label: "Last Updated" },
  { value: "createdAt", label: "Created Date" },
  { value: "title", label: "Title A-Z" },
  { value: "wordCount", label: "Word Count" },
  { value: "readTime", label: "Read Time" },
];

// Draggable card component
function DraggableCard({ doc, onAction }: { doc: Documentation; onAction: (action: string, doc: Documentation) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: doc.id,
  });

  const author = getTeamMemberById(doc.author);

  return (
    <Card 
      ref={setNodeRef}
      className={`group hover:shadow-sm transition-all duration-200 ${isDragging ? 'opacity-50' : ''}`}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {/* Drag Handle */}
      <div 
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10"
      >
        <div className="p-1 rounded bg-background/80 backdrop-blur-sm border">
          <GripVertical className="h-3 w-3 text-muted-foreground" />
        </div>
      </div>

      <CardHeader className="pb-3 pl-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="text-2xl">{getCategoryIcon(doc.category)}</div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                {doc.title}
              </CardTitle>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onAction('view', doc)}>
                <Eye className="mr-2 h-4 w-4" />
                Open document
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('edit', doc)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit document
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('copy', doc)}>
                <Copy className="mr-2 h-4 w-4" />
                Copy link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500" onClick={() => onAction('delete', doc)}>
                <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {doc.description}
        </p>
        
        {/* Meta Information */}
        <div className="space-y-2 border-t pt-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              {author ? (
                <div className="flex items-center space-x-1">
                  <Avatar className="h-4 w-4">
                    <AvatarImage src={author.avatarUrl} />
                    <AvatarFallback className="text-[8px]">
                      {author.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span>{author.name}</span>
                </div>
              ) : (
                <span>Unknown</span>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatRelativeTime(doc.updatedAt)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ProjectDocumentationProps {
  project: Project;
  documentation?: Documentation[];
}

export function ProjectDocumentation({ project, documentation: externalDocumentation }: ProjectDocumentationProps) {
  const originalDocumentation = React.useMemo(() => getProjectDocumentation(project.id), [project.id]);
  const [data, setData] = React.useState(() => externalDocumentation || originalDocumentation);

  // Update data when external documentation changes
  React.useEffect(() => {
    if (externalDocumentation) {
      setData(externalDocumentation);
    } else {
      setData(originalDocumentation);
    }
  }, [externalDocumentation, originalDocumentation]);

  // Filter states
  const [searchTerm, setSearchTerm] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("updatedAt");
  const [createModalOpen, setCreateModalOpen] = React.useState(false);

  // Drag and drop setup
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  );

  // Handle drag end
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  // Filter and sort documentation
  const filteredAndSortedDocumentation = React.useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(doc => doc.category === categoryFilter);
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "createdAt":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "updatedAt":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case "wordCount":
          return b.wordCount - a.wordCount;
        case "readTime":
          return b.readTime - a.readTime;
        default:
          return 0;
      }
    });

    return filtered;
  }, [data, searchTerm, categoryFilter, sortBy]);

  const handleDocumentAction = (action: string, document: Documentation) => {
    console.log(`${action} document:`, document.id);
  };

  const handleDocumentCreate = (newDocument: any) => {
    console.log('Document created for project:', project.id, newDocument);
    setCreateModalOpen(false);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium tracking-tight">Documentation</h2>
          <p className="text-muted-foreground text-sm">
            Project guides, references, and knowledge base for {project.title}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Document
          </Button>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search documentation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px]">
              <BookOpen className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Documentation Grid */}
      {filteredAndSortedDocumentation.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {data.length === 0 ? 'No documentation yet' : 'No documentation matches your search'}
            </h3>
            <p className="text-gray-500 mb-4">
              {data.length === 0 
                ? 'Create your first document to get started'
                : 'Try adjusting your search or filters'
              }
            </p>
            {data.length === 0 && (
              <Button onClick={() => setCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Document
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          sensors={sensors}
          id={sortableId}
        >
          <SortableContext
            items={dataIds}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAndSortedDocumentation.map((doc) => (
                <DraggableCard
                  key={doc.id}
                  doc={doc}
                  onAction={handleDocumentAction}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Create Document Modal */}
      <DocumentCreateModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onDocumentCreated={handleDocumentCreate}
      />
    </div>
  );
}