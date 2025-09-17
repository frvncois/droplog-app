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
  Download,
  MoreVertical,
  Eye,
  Search,
  Filter,
  SortAsc,
  Grid,
  List,
  Edit,
  Copy,
  Trash2,
  Share,
  FolderOpen,
  FileImage,
  FileText,
  Video,
  File,
  User,
  HardDrive,
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
import { 
  Asset,
  assets,
  getProjectById,
  getTeamMemberById
} from "@/lib/utils/dummy-data";
import { formatRelativeTime } from "@/lib/utils";
import { AssetSheetModal } from "@/components/modals/asset-sheet-modal";
import { AssetCreateModal } from "@/components/modals/asset-create-modal";
import { AssetEditModal } from "@/components/modals/asset-edit-modal";

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    image: "bg-blue-100 text-blue-800",
    video: "bg-purple-100 text-purple-800",
    pdf: "bg-red-100 text-red-800",
    document: "bg-green-100 text-green-800",
    audio: "bg-yellow-100 text-yellow-800",
    other: "bg-gray-100 text-gray-800"
  };
  return colors[type] || "bg-gray-100 text-gray-800";
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "image":
      return <FileImage className="h-4 w-4 text-blue-500" />;
    case "video":
      return <Video className="h-4 w-4 text-purple-500" />;
    case "pdf":
      return <FileText className="h-4 w-4 text-red-500" />;
    case "document":
      return <FileText className="h-4 w-4 text-green-500" />;
    case "audio":
      return <File className="h-4 w-4 text-yellow-500" />;
    default:
      return <File className="h-4 w-4 text-gray-500" />;
  }
};

const formatFileSize = (bytes: number) => {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 B';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

// Type filter options
const typeOptions = [
  { value: "all", label: "All Types" },
  { value: "image", label: "Images" },
  { value: "video", label: "Videos" },
  { value: "pdf", label: "PDFs" },
  { value: "document", label: "Documents" },
  { value: "audio", label: "Audio" },
  { value: "other", label: "Other" },
];

// Sort options
const sortOptions = [
  { value: "updatedAt", label: "Last Updated" },
  { value: "createdAt", label: "Created Date" },
  { value: "title", label: "Name A-Z" },
  { value: "fileSize", label: "File Size" },
  { value: "type", label: "File Type" },
];

export function AssetsDataTable() {
  // Get all assets
  const [data, setData] = React.useState(() => assets);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  
  // Filter states
  const [searchTerm, setSearchTerm] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [assigneeFilter, setAssigneeFilter] = React.useState("all");
  const [projectFilter, setProjectFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("updatedAt");
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('list');

  // Modal states
  const [selectedAsset, setSelectedAsset] = React.useState<Asset | null>(null);
  const [isAssetSheetOpen, setIsAssetSheetOpen] = React.useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editingAsset, setEditingAsset] = React.useState<Asset | null>(null);

  // Function to open asset sheet modal
  const openAssetSheet = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsAssetSheetOpen(true);
  };

  // Function to open edit modal
  const openEditModal = (asset: Asset) => {
    setEditingAsset(asset);
    setIsEditModalOpen(true);
  };

  // Function to handle asset creation
  const handleCreateAsset = (newAssetData: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAsset: Asset = {
      ...newAssetData,
      id: `a${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setData(prev => [newAsset, ...prev]);
    console.log('Created new asset:', newAsset);
  };

  // Function to handle asset update
  const handleUpdateAsset = (updatedAsset: Asset) => {
    setData(prev => prev.map(a => a.id === updatedAsset.id ? updatedAsset : a));
    console.log('Updated asset:', updatedAsset);
  };

  // Function to handle asset deletion
  const handleDeleteAsset = (asset: Asset) => {
    if (confirm(`Are you sure you want to delete "${asset.title}"?`)) {
      setData(prev => prev.filter(a => a.id !== asset.id));
      console.log('Deleted asset:', asset.title);
    }
  };

  // Function to handle asset duplication
  const handleDuplicateAsset = (asset: Asset) => {
    const duplicatedAsset: Asset = {
      ...asset,
      id: `a${Date.now()}`,
      title: `${asset.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setData(prev => [duplicatedAsset, ...prev]);
    console.log('Duplicated asset:', duplicatedAsset);
  };

  // Get unique assignees for filter
  const uniqueAssignees = React.useMemo(() => {
    const assignees = data
      .map(asset => asset.addedBy)
      .filter((assignee): assignee is string => assignee !== undefined)
      .filter((assignee, index, array) => array.indexOf(assignee) === index);
    
    return assignees.map(assigneeId => {
      const member = getTeamMemberById(assigneeId);
      return member ? { value: assigneeId, label: member.name } : null;
    }).filter((item): item is { value: string; label: string } => item !== null);
  }, [data]);

  // Get unique projects for filter
  const uniqueProjects = React.useMemo(() => {
    const projectIds = [...new Set(data.map(asset => asset.projectId))];
    return projectIds.map(id => {
      const project = getProjectById(id);
      return project ? { value: id, label: project.title } : null;
    }).filter((item): item is { value: string; label: string } => item !== null);
  }, [data]);

  // Filter and sort assets
  const filteredAndSortedAssets = React.useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(asset =>
        asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (asset.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (asset.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      );
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(asset => asset.type === typeFilter);
    }

    // Apply assignee filter
    if (assigneeFilter !== "all") {
      filtered = filtered.filter(asset => asset.addedBy === assigneeFilter);
    }

    // Apply project filter
    if (projectFilter !== "all") {
      filtered = filtered.filter(asset => asset.projectId === projectFilter);
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
        case "fileSize":
          return (b.fileSize || 0) - (a.fileSize || 0);
        case "type":
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return filtered;
  }, [data, searchTerm, typeFilter, assigneeFilter, projectFilter, sortBy]);

  const assetColumns: ColumnDef<Asset>[] = [
    {
      id: "typeIcon",
      header: () => '',
      cell: ({ row }) => {
        const type = row.original.type;
        return (
          <div className="p-2 rounded-md flex items-center justify-center bg-muted">
            {getTypeIcon(type)}
          </div>
        );
      },
      size: 50,
      enableSorting: false,
    },
    {
      accessorKey: "title",
      header: "Asset",
      cell: ({ row }) => {
        const asset = row.original;
        
        return (
          <div className="flex flex-col p-2">
            <Button 
              variant="link" 
              className="p-0 h-auto font-medium hover:text-primary transition-colors cursor-pointer text-left justify-start"
              onClick={() => openAssetSheet(asset)}
            >
              {asset.title}
            </Button>
            <div className="text-xs text-muted-foreground line-clamp-1">
              {asset.filename || asset.description || "No description"}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "projectId",
      header: "Project",
      cell: ({ row }) => {
        const projectId = row.getValue("projectId") as string;
        const project = getProjectById(projectId);
        
        return (
          <div className="flex flex-col">
            {project ? (
              <>
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-medium">{project.title}</span>
                </div>
              </>
            ) : (
              <span className="text-muted-foreground text-sm">Unknown Project</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        return (
          <Badge className={getTypeColor(type)}>
            {type}
          </Badge>
        );
      },
    },
    {
      accessorKey: "fileSize",
      header: "Size",
      cell: ({ row }) => {
        const asset = row.original;
        // Simulate file size based on type for demo
        let simulatedSize = 0;
        switch (asset.type) {
          case "image":
            simulatedSize = Math.floor(Math.random() * 5000000); // 0-5MB
            break;
          case "video":
            simulatedSize = Math.floor(Math.random() * 100000000); // 0-100MB
            break;
          case "document":
          case "pdf":
            simulatedSize = Math.floor(Math.random() * 10000000); // 0-10MB
            break;
          case "audio":
            simulatedSize = Math.floor(Math.random() * 20000000); // 0-20MB
            break;
          default:
            simulatedSize = Math.floor(Math.random() * 1000000); // 0-1MB
        }
        
        return (
          <div className="flex items-center gap-1">
            <HardDrive className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">
              {formatFileSize(asset.fileSize || simulatedSize)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "addedBy",
      header: "Added By",
      cell: ({ row }) => {
        const addedBy = row.getValue("addedBy") as string | undefined;
        
        if (!addedBy) {
          return <div className="text-muted-foreground">Unknown</div>;
        }
        
        const member = getTeamMemberById(addedBy);
        if (!member) {
          return <div className="text-muted-foreground">Unknown</div>;
        }
        
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6 border border-background">
              <AvatarImage src={member.avatarUrl} />
              <AvatarFallback className="text-xs">
                {member.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="text-xs">{member.name}</div>
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
        const asset = row.original;

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
              <DropdownMenuItem onClick={() => openAssetSheet(asset)}>
                <Eye className="h-4 w-4" />
                Asset details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openEditModal(asset)}>
                <Edit className="h-4 w-4" />
                Edit asset
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('Download asset:', asset.title)}>
                <Download className="h-4 w-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDuplicateAsset(asset)}>
                <Copy className="h-4 w-4" />
                Duplicate asset
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('Share asset:', asset.title)}>
                <Share className="h-4 w-4" />
                Share asset
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500" onClick={() => handleDeleteAsset(asset)}>
                <Trash2 className="h-4 w-4 text-red-500" />
                Delete asset
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredAndSortedAssets,
    columns: assetColumns,
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

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
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

          {/* Project Filter */}
          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-[180px]">
              <FolderOpen className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {uniqueProjects.map((project) => (
                <SelectItem key={project.value} value={project.value}>
                  {project.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Assignee Filter */}
          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="w-[200px]">
              <User className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
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
                    colSpan={assetColumns.length}
                    className="h-24 text-center"
                  >
                    No assets found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedAssets.length > 0 ? (
            filteredAndSortedAssets.map((asset) => {
              const addedBy = asset.addedBy ? getTeamMemberById(asset.addedBy) : null;
              const project = getProjectById(asset.projectId);
              
              // Simulate file size based on type for demo
              let simulatedSize = 0;
              switch (asset.type) {
                case "image":
                  simulatedSize = Math.floor(Math.random() * 5000000); // 0-5MB
                  break;
                case "video":
                  simulatedSize = Math.floor(Math.random() * 100000000); // 0-100MB
                  break;
                case "document":
                case "pdf":
                  simulatedSize = Math.floor(Math.random() * 10000000); // 0-10MB
                  break;
                case "audio":
                  simulatedSize = Math.floor(Math.random() * 20000000); // 0-20MB
                  break;
                default:
                  simulatedSize = Math.floor(Math.random() * 1000000); // 0-1MB
              }
              
              return (
                <Card key={asset.id} className="group hover:shadow-sm transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="p-2 rounded-md bg-muted">
                              {getTypeIcon(asset.type)}
                            </div>
                            <Button 
                              variant="link" 
                              className="p-0 h-auto text-left justify-start"
                              onClick={() => openAssetSheet(asset)}
                            >
                              <CardTitle className="text-lg hover:text-primary transition-colors">
                                {asset.title}
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
                              <DropdownMenuItem onClick={() => openAssetSheet(asset)}>
                                <Eye className="h-4 w-4" />
                                Asset details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditModal(asset)}>
                                <Edit className="h-4 w-4" />
                                Edit asset
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => console.log('Download asset:', asset.title)}>
                                <Download className="h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDuplicateAsset(asset)}>
                                <Copy className="h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-500" onClick={() => handleDeleteAsset(asset)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="mt-2">
                          <Badge className={getTypeColor(asset.type)}>
                            {asset.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-6 line-clamp-2">
                          {asset.description || asset.filename || "No description"}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-col justify-between gap-2">
                      {/* Project Info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FolderOpen className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            {project ? project.title : "Unknown Project"}
                          </div>
                        </div>
                      </div>

                      {/* File Size */}
                      <div className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm text-muted-foreground">
                          {formatFileSize(asset.fileSize || simulatedSize)}
                        </div>
                      </div>

                      {/* Meta Information */}
                      <div className="space-y-2 border-t pt-3">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                          <div className="flex items-center gap-2">
                            {addedBy ? (
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-6 w-6 border border-background">
                                  <AvatarImage src={addedBy.avatarUrl} />
                                  <AvatarFallback className="text-xs">
                                    {addedBy.name.split(" ").map(n => n[0]).join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="text-sm text-muted-foreground">
                                  {addedBy.name}
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground">Unknown</div>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="text-muted-foreground">
                              {formatRelativeTime(asset.updatedAt)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Open Asset Button */}
                      <Button 
                        variant="default"
                        className="w-full" 
                        onClick={() => openAssetSheet(asset)}
                      >
                        View Asset
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-sm flex items-center border rounded-xl justify-center h-50 bg-card text-muted-foreground">
              <p>No assets found.</p>
            </div>
          )}
        </div>
      )}
      
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          Showing {table.getRowModel().rows.length} of {filteredAndSortedAssets.length} assets.
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

      {/* Asset Sheet Modal */}
      <AssetSheetModal
        asset={selectedAsset}
        open={isAssetSheetOpen}
        onOpenChange={setIsAssetSheetOpen}
      />

      {/* Asset Create Modal */}
      <AssetCreateModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        projectId="" // For global asset creation, project selection handled in modal
        onCreateAsset={handleCreateAsset}
      />

      {/* Asset Edit Modal */}
      <AssetEditModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        asset={editingAsset}
        onUpdateAsset={handleUpdateAsset}
      />
    </div>
  );
}