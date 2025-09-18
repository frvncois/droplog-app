// components/projects/project-content-list.tsx

"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { 
  MoreVertical,
  Eye,
  Search,
  Filter,
  SortAsc,
  Grid,
  List,
  Plus,
  Edit,
  Copy,
  Trash2,
  FileText,
  User,
  Calendar,
  Check,
  Clock,
  Wand2,
  Languages,
  TrendingUp,
  Target,
  Mail,
  Share2,
  Globe,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import standardized hooks and types
import { useContent } from "@/hooks/use-content";
import { useTeam } from "@/hooks/use-team";
import type { 
  Project, 
  Content,
  TeamMember
} from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";
import { ContentCreateModal } from "../modals/content-create-modal";
import { ContentSheetModal } from "../modals/content-sheet-modal";
import { ContentEditModal } from "../modals/content-edit-modal";

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "draft":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "blog_post":
      return <FileText className="h-4 w-4 text-purple-500" />;
    case "email":
      return <Mail className="h-4 w-4 text-blue-500" />;
    case "social":
      return <Share2 className="h-4 w-4 text-pink-500" />;
    case "page":
      return <Globe className="h-4 w-4 text-green-500" />;
    case "other":
      return <FileText className="h-4 w-4 text-gray-500" />;
    default:
      return <FileText className="h-4 w-4 text-gray-500" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "blog_post":
      return "bg-purple-100 text-purple-800";
    case "email":
      return "bg-blue-100 text-blue-800";
    case "social":
      return "bg-pink-100 text-pink-800";
    case "page":
      return "bg-green-100 text-green-800";
    case "other":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Status filter options
const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
];

// Type filter options
const typeOptions = [
  { value: "all", label: "All Types" },
  { value: "blog_post", label: "Blog Post" },
  { value: "page", label: "Page" },
  { value: "email", label: "Email" },
  { value: "social", label: "Social Media" },
  { value: "other", label: "Other" },
];

// Sort options
const sortOptions = [
  { value: "updatedAt", label: "Last Updated" },
  { value: "createdAt", label: "Created Date" },
  { value: "title", label: "Title A-Z" },
  { value: "status", label: "Status" },
  { value: "wordCount", label: "Word Count" },
];

interface ProjectContentListProps {
  project: Project;
}

export function ProjectContentList({ project }: ProjectContentListProps) {
  // Use standardized hooks
  const { content, isLoading, error, refetch } = useContent({ projectId: project.id });
  const { team, getTeamMemberById } = useTeam();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  
  // Filter states
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [assigneeFilter, setAssigneeFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("updatedAt");
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('list');

  // Modal states
  const [selectedContent, setSelectedContent] = React.useState<Content | null>(null);
  const [isContentSheetOpen, setIsContentSheetOpen] = React.useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editingContent, setEditingContent] = React.useState<Content | null>(null);

  // Function to open content sheet modal
  const openContentSheet = (content: Content) => {
    setSelectedContent(content);
    setIsContentSheetOpen(true);
  };

  // Function to open edit modal
  const openEditModal = (content: Content) => {
    setEditingContent(content);
    setIsEditModalOpen(true);
  };

  // Function to handle content status change
  const handleStatusChange = (contentItem: Content, newStatus: "draft" | "pending" | "approved") => {
    // TODO: Replace with actual API call
    console.log(`Content "${contentItem.title}" status changed to:`, newStatus);
    refetch(); // Refresh data after change
  };

  // Function to handle content creation
  const handleCreateContent = (newContentData: Omit<Content, 'id' | 'createdAt' | 'updatedAt'>) => {
    // TODO: Replace with actual API call
    console.log('Created new content:', newContentData);
    refetch(); // Refresh data after creation
  };

  // Function to handle content update
  const handleUpdateContent = (updatedContent: Content) => {
    // TODO: Replace with actual API call
    console.log('Updated content:', updatedContent);
    refetch(); // Refresh data after update
  };

  // Function to handle content deletion
  const handleDeleteContent = (contentItem: Content) => {
    if (confirm(`Are you sure you want to delete "${contentItem.title}"?`)) {
      // TODO: Replace with actual API call
      console.log('Deleted content:', contentItem.title);
      refetch(); // Refresh data after deletion
    }
  };

  // Function to handle content duplication
  const handleDuplicateContent = (contentItem: Content) => {
    // TODO: Replace with actual API call
    console.log('Duplicated content:', contentItem);
    refetch(); // Refresh data after duplication
  };

  // Get unique assignees for filter - optimized with useMemo
  const uniqueAssignees = React.useMemo(() => {
    const assignees = content
      .map((contentItem: Content) => contentItem.assignedTo)
      .filter((assignee: string | undefined): assignee is string => assignee !== undefined)
      .filter((assignee: string, index: number, array: string[]) => array.indexOf(assignee) === index);
    
    return assignees.map((assigneeId: string) => {
      const member = getTeamMemberById(assigneeId);
      return member ? { value: assigneeId, label: member.name } : null;
    }).filter((item: { value: string; label: string } | null): item is { value: string; label: string } => item !== null);
  }, [content, getTeamMemberById]);

  // Content statistics - optimized with useMemo and single pass calculation
  const contentStats = React.useMemo(() => {
    if (!content.length) {
      return {
        totalContent: 0,
        draftContent: 0,
        pendingContent: 0,
        approvedContent: 0,
        blogPosts: 0,
        recentContent: 0,
        approvalRate: 0
      };
    }

    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Single pass calculation for better performance
    const stats = content.reduce((acc: {
      draftContent: number;
      pendingContent: number;
      approvedContent: number;
      blogPosts: number;
      recentContent: number;
    }, c: Content) => {
      // Status counts
      if (c.status === "draft") acc.draftContent++;
      else if (c.status === "pending") acc.pendingContent++;
      else if (c.status === "approved") acc.approvedContent++;

      // Type counts
      if (c.type === "blog_post" || c.type === "page") acc.blogPosts++;

      // Recent content
      if (new Date(c.updatedAt) > weekAgo) acc.recentContent++;

      return acc;
    }, {
      draftContent: 0,
      pendingContent: 0,
      approvedContent: 0,
      blogPosts: 0,
      recentContent: 0
    });

    const totalContent = content.length;
    const approvalRate = totalContent > 0 ? Math.round((stats.approvedContent / totalContent) * 100) : 0;
    
    return {
      totalContent,
      ...stats,
      approvalRate
    };
  }, [content]);

  // Filter and sort content - optimized
  const filteredAndSortedContent = React.useMemo(() => {
    let filtered = content;

    // Apply search filter
    if (searchTerm) {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((contentItem: Content) =>
        contentItem.title.toLowerCase().includes(lowercaseSearchTerm) ||
        (contentItem.content?.toLowerCase().includes(lowercaseSearchTerm) ?? false)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((contentItem: Content) => contentItem.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((contentItem: Content) => contentItem.type === typeFilter);
    }

    // Apply assignee filter
    if (assigneeFilter !== "all") {
      filtered = filtered.filter((contentItem: Content) => contentItem.assignedTo === assigneeFilter);
    }

    // Apply sorting
    filtered = [...filtered].sort((a: Content, b: Content) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "createdAt":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "updatedAt":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case "wordCount":
          return (b.wordCount || 0) - (a.wordCount || 0);
        case "status":
          const statusOrder = { approved: 3, pending: 2, draft: 1 };
          return (statusOrder[b.status as keyof typeof statusOrder] || 0) - 
                 (statusOrder[a.status as keyof typeof statusOrder] || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [content, searchTerm, statusFilter, typeFilter, assigneeFilter, sortBy]);

  const contentColumns: ColumnDef<Content>[] = [
    {
      accessorKey: "type",
      header: () => null,
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        return (
          <div className={`p-2 rounded-md flex flex-col items-center ${getTypeColor(type)}`}>
            {getTypeIcon(type)}
          </div>
        );
      },
      size: 50,
    },
    {
      accessorKey: "title",
      header: "Content",
      cell: ({ row }) => {
        const contentItem = row.original;
        
        return (
          <div className="flex flex-col p-2">
            <Button 
              variant="link" 
              className="p-0 h-auto font-medium hover:text-primary transition-colors cursor-pointer text-left justify-start"
              onClick={() => openContentSheet(contentItem)}
            >
              {contentItem.title}
            </Button>
            <div className="text-xs text-muted-foreground line-clamp-1">
              {contentItem.content ? `${contentItem.content.slice(0, 60)}...` : "No content"}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge className={getStatusColor(status)}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "contentType",
      header: "Type",
      cell: ({ row }) => {
        const type = row.original.type;
        return (
          <Badge className={getTypeColor(type)}>
            {type.replace("_", " ")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "assignedTo",
      header: "Assigned To",
      cell: ({ row }) => {
        const assignedToId = row.getValue("assignedTo") as string | undefined;
        
        if (!assignedToId) {
          return <div className="text-muted-foreground">Unassigned</div>;
        }
        
        const assignedTo = getTeamMemberById(assignedToId);
        if (!assignedTo) {
          return <div className="text-muted-foreground">Unknown</div>;
        }
        
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6 border border-background">
              <AvatarImage src={assignedTo.avatarUrl} />
              <AvatarFallback className="text-xs">
                {assignedTo.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="text-xs">{assignedTo.name}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Last updated",
      cell: ({ row }) => {
        const updatedAt = row.getValue("updatedAt") as string;
        
        return (
          <div className="flex flex-col">
            <div className="text-xs">{formatRelativeTime(updatedAt)}</div>
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const contentItem = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openContentSheet(contentItem)}>
                <Eye className="h-4 w-4" />
                Content details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openEditModal(contentItem)}>
                <Edit className="h-4 w-4" />
                Edit content
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {contentItem.status !== "approved" && (
                <DropdownMenuItem onClick={() => handleStatusChange(contentItem, "approved")}>
                  <Check className="h-4 w-4" />
                  Mark approved
                </DropdownMenuItem>
              )}
              {contentItem.status !== "pending" && (
                <DropdownMenuItem onClick={() => handleStatusChange(contentItem, "pending")}>
                  <Clock className="h-4 w-4" />
                  Mark pending
                </DropdownMenuItem>
              )}
              {contentItem.status !== "draft" && (
                <DropdownMenuItem onClick={() => handleStatusChange(contentItem, "draft")}>
                  <Edit className="h-4 w-4" />
                  Mark draft
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => console.log('AI optimize:', contentItem.title)}>
                <Wand2 className="h-4 w-4" />
                AI optimize
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('Translate:', contentItem.title)}>
                <Languages className="h-4 w-4" />
                Translate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDuplicateContent(contentItem)}>
                <Copy className="h-4 w-4" />
                Duplicate content
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500" onClick={() => handleDeleteContent(contentItem)}>
                <Trash2 className="h-4 w-4 text-red-500" />
                Delete content
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredAndSortedContent,
    columns: contentColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getRowId: (row) => row.id,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium tracking-tight">Content</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Content
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Content Progress</CardTitle>
            <div className="p-2 rounded-md bg-secondary">
              <Target className="h-4 w-4 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contentStats.approvalRate}%</div>
            <p className="text-xs text-muted-foreground">
              {contentStats.approvedContent} of {contentStats.totalContent} approved
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <div className="p-2 rounded-md bg-secondary">
              <TrendingUp className="h-4 w-4 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contentStats.pendingContent}</div>
            <p className="text-xs text-muted-foreground">
              {contentStats.draftContent} drafts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog & Pages</CardTitle>
            <div className="p-2 rounded-md bg-secondary"> 
              <FileText className="h-4 w-4 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contentStats.blogPosts}</div>
            <p className="text-xs text-muted-foreground">
              Published content
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent</CardTitle>
            <div className="p-2 rounded-md bg-secondary"> 
              <Calendar className="h-4 w-4 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contentStats.recentContent}</div>
            <p className="text-xs text-muted-foreground">
              This week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[200px]">
              <FileText className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Assignee Filter */}
          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="w-[200px]">
              <User className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Assignees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignees</SelectItem>
              {uniqueAssignees.map((assignee) => (
                <SelectItem key={assignee.value} value={assignee.value}>
                  {assignee.label}
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

          {/* View Mode Toggle */}
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Conditional rendering based on view mode */}
      {viewMode === 'list' ? (
        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-muted/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={contentColumns.length}
                    className="h-24 text-center"
                  >
                    No content found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedContent.length > 0 ? (
            filteredAndSortedContent.map((contentItem: Content) => {
              const assignee: TeamMember | undefined = contentItem.assignedTo ? getTeamMemberById(contentItem.assignedTo) : undefined;
              
              return (
                <Card key={contentItem.id} className="group justify-between hover:shadow-sm transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="link" 
                              className="p-0 h-auto text-left justify-start"
                              onClick={() => openContentSheet(contentItem)}
                            >
                              <CardTitle className="text-lg hover:text-primary transition-colors">
                                {contentItem.title}
                              </CardTitle>
                            </Button>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => openContentSheet(contentItem)}>
                                <Eye className="h-4 w-4" />
                                Content details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditModal(contentItem)}>
                                <Edit className="h-4 w-4" />
                                Edit content
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {contentItem.status !== "approved" && (
                                <DropdownMenuItem onClick={() => handleStatusChange(contentItem, "approved")}>
                                  <Check className="h-4 w-4" />
                                  Mark approved
                                </DropdownMenuItem>
                              )}
                              {contentItem.status !== "pending" && (
                                <DropdownMenuItem onClick={() => handleStatusChange(contentItem, "pending")}>
                                  <Clock className="h-4 w-4" />
                                  Mark pending
                                </DropdownMenuItem>
                              )}
                              {contentItem.status !== "draft" && (
                                <DropdownMenuItem onClick={() => handleStatusChange(contentItem, "draft")}>
                                  <Edit className="h-4 w-4" />
                                  Mark draft
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => console.log('AI optimize:', contentItem.title)}>
                                <Wand2 className="h-4 w-4" />
                                AI optimize
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => console.log('Translate:', contentItem.title)}>
                                <Languages className="h-4 w-4" />
                                Translate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDuplicateContent(contentItem)}>
                                <Copy className="h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-500" onClick={() => handleDeleteContent(contentItem)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge className={getStatusColor(contentItem.status)}>
                            {contentItem.status}
                          </Badge>
                          <Badge className={getTypeColor(contentItem.type)}>
                            {contentItem.type.replace("_", " ")}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-6 line-clamp-2">
                          {contentItem.content ? `${contentItem.content.slice(0, 100)}...` : "No content"}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-col justify-between gap-2">
                      {/* Word Count */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm text-muted-foreground">
                            {contentItem.wordCount ? `${contentItem.wordCount} words` : "No word count"}
                          </div>
                        </div>
                      </div>

                      {/* Meta Information */}
                      <div className="space-y-2 border-t pt-3">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                          <div className="flex items-center gap-2">
                            {assignee ? (
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-6 w-6 border border-background">
                                  <AvatarImage src={assignee.avatarUrl} />
                                  <AvatarFallback className="text-xs">
                                    {assignee.name.split(" ").map((n: string) => n[0]).join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="text-sm text-muted-foreground">
                                  {assignee.name}
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground">Unassigned</div>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="text-muted-foreground">
                              {formatRelativeTime(contentItem.updatedAt)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Open Content Button */}
                      <Button 
                        variant="default"
                        className="w-full" 
                        onClick={() => openContentSheet(contentItem)}
                      >
                        View Content
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-sm flex items-center border rounded-xl justify-center h-50 bg-card text-muted-foreground">
              <p>No content found.</p>
            </div>
          )}
        </div>
      )}
      
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          Showing {table.getRowModel().rows.length} of {filteredAndSortedContent.length} content items.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <ContentSheetModal
        content={selectedContent}
        open={isContentSheetOpen}
        onOpenChange={setIsContentSheetOpen}
      />

      <ContentCreateModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        projectId={project.id}
        onCreateContent={handleCreateContent}
      />

      <ContentEditModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        content={editingContent}
        onUpdateContent={handleUpdateContent}
      />
    </div>
  );
}