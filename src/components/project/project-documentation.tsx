// components/projects/project-documentation.tsx

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

// Import standardized hooks and types
import { useDocumentation } from "@/hooks/use-documentation";
import { useTeam } from "@/hooks/use-team";
import type { 
  Project, 
  Documentation,
  TeamMember
} from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";

// Import the modal components
import { DocumentationCreateModal } from "@/components/modals/documentation-create-modal";
import { DocumentationEditModal } from "@/components/modals/documentation-edit-modal";
import { DocumentationSheetModal } from "@/components/modals/documentation-sheet-modal";

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

// Draggable card component
function DraggableCard({ 
  doc, 
  onAction, 
  getTeamMemberById 
}: { 
  doc: Documentation; 
  onAction: (action: string, doc: Documentation) => void;
  getTeamMemberById: (id: string) => TeamMember | undefined;
}) {
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
              <CardTitle 
                className="text-lg line-clamp-2 hover:text-primary transition-colors cursor-pointer"
                onClick={() => onAction('view', doc)}
              >
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
              <DropdownMenuItem onClick={() => onAction('duplicate', doc)}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
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
                      {author.name.split(" ").map((n: string) => n[0]).join("")}
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
}

export function ProjectDocumentation({ project }: ProjectDocumentationProps) {
  // Use standardized hooks
  const { documentation, isLoading, error, refetch } = useDocumentation({ projectId: project.id });
  const { getTeamMemberById } = useTeam();

  // Modal states
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [viewModalOpen, setViewModalOpen] = React.useState(false);
  const [selectedDocument, setSelectedDocument] = React.useState<Documentation | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");

  // Drag and drop setup
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => documentation?.map(({ id }) => id) || [],
    [documentation]
  );

  // Handle drag end
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      // TODO: Replace with actual API call to update order
      console.log('Reorder documentation:', { active: active.id, over: over.id });
      refetch(); // Refresh data after reorder
    }
  }

  // Filter documentation - optimized with useMemo
  const filteredDocumentation = React.useMemo(() => {
    let filtered = documentation;

    // Apply search filter
    if (searchTerm) {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((doc: Documentation) =>
        doc.title.toLowerCase().includes(lowercaseSearchTerm) ||
        doc.description.toLowerCase().includes(lowercaseSearchTerm) ||
        doc.tags.some((tag: string) => tag.toLowerCase().includes(lowercaseSearchTerm))
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((doc: Documentation) => doc.category === categoryFilter);
    }

    return filtered;
  }, [documentation, searchTerm, categoryFilter]);

  // Handle document actions
  const handleDocumentAction = (action: string, document: Documentation) => {
    switch (action) {
      case 'view':
        setSelectedDocument(document);
        setViewModalOpen(true);
        break;
      case 'edit':
        setSelectedDocument(document);
        setEditModalOpen(true);
        break;
      case 'copy':
        navigator.clipboard.writeText(`${window.location.origin}/docs/${document.id}`);
        // You could add a toast notification here
        break;
      case 'duplicate':
        // TODO: Replace with actual API call
        console.log('Duplicate document:', document.title);
        refetch(); // Refresh data after duplication
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete "${document.title}"?`)) {
          // TODO: Replace with actual API call
          console.log('Delete document:', document.title);
          refetch(); // Refresh data after deletion
        }
        break;
    }
  };

  // Handle document creation
  const handleDocumentCreate = (newDocument: Omit<Documentation, 'id' | 'createdAt' | 'updatedAt'>) => {
    // TODO: Replace with actual API call
    console.log('Create document:', newDocument);
    setCreateModalOpen(false);
    refetch(); // Refresh data after creation
  };

  // Handle document update
  const handleDocumentUpdate = (updatedDocument: Documentation) => {
    // TODO: Replace with actual API call
    console.log('Update document:', updatedDocument);
    setEditModalOpen(false);
    setSelectedDocument(null);
    refetch(); // Refresh data after update
  };

  // Handle modal actions from view modal
  const handleViewModalAction = (action: string, document: Documentation) => {
    switch (action) {
      case 'edit':
        setViewModalOpen(false);
        setSelectedDocument(document);
        setEditModalOpen(true);
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete "${document.title}"?`)) {
          // TODO: Replace with actual API call
          console.log('Delete document from view modal:', document.title);
          setViewModalOpen(false);
          setSelectedDocument(null);
          refetch(); // Refresh data after deletion
        }
        break;
      case 'duplicate':
        // TODO: Replace with actual API call
        console.log('Duplicate document from view modal:', document.title);
        setViewModalOpen(false);
        refetch(); // Refresh data after duplication
        break;
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium tracking-tight">Documentation</h2>
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
        </div>
      </div>

      {/* Documentation Grid */}
      {filteredDocumentation.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {documentation.length === 0 ? 'No documentation yet' : 'No documentation matches your search'}
            </h3>
            <p className="text-gray-500 mb-4">
              {documentation.length === 0 
                ? 'Create your first document to get started'
                : 'Try adjusting your search or filters'
              }
            </p>
            {documentation.length === 0 && (
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
              {filteredDocumentation.map((doc) => (
                <DraggableCard
                  key={doc.id}
                  doc={doc}
                  onAction={handleDocumentAction}
                  getTeamMemberById={getTeamMemberById}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Modal Components */}
      <DocumentationCreateModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onDocumentCreated={handleDocumentCreate}
        projectId={project.id}
      />

      <DocumentationEditModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        document={selectedDocument}
        onSave={handleDocumentUpdate}
        projectId={project.id}
      />

      <DocumentationSheetModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        document={selectedDocument}
        onEdit={(doc: Documentation) => handleViewModalAction('edit', doc)}
        onDelete={(docId: string) => handleViewModalAction('delete', selectedDocument!)}
        onDuplicate={(doc: Documentation) => handleViewModalAction('duplicate', doc)}
      />
    </div>
  );
}