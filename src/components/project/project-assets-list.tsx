// components/project/project-assets-list.tsx

"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { 
  Upload,
  Download,
  MoreVertical,
  Eye,
  Search,
  Filter,
  SortAsc,
  Grid,
  List,
  Plus,
  Edit,
  Trash2,
  Share,
  FileImage,
  FileText,
  Video,
  File,
  User,
  HardDrive,
  Image,
  FileX
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
import { Project, Asset } from "@/lib/types";
import { useAssets } from "@/hooks/use-assets";
import { useTeam } from "@/hooks/use-team";
import { useProject } from "@/hooks/use-projects";
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

const typeOptions = [
  { value: "all", label: "All Types" },
  { value: "image", label: "Images" },
  { value: "video", label: "Videos" },
  { value: "pdf", label: "PDFs" },
  { value: "document", label: "Documents" },
  { value: "audio", label: "Audio" },
  { value: "other", label: "Other" },
];

const sortOptions = [
  { value: "updatedAt", label: "Last Updated" },
  { value: "createdAt", label: "Created Date" },
  { value: "title", label: "Name A-Z" },
  { value: "fileSize", label: "File Size" },
  { value: "type", label: "File Type" },
];

interface ProjectAssetsListProps {
  projectId: string;
}

export function ProjectAssetsList({ projectId }: ProjectAssetsListProps) {
  const { project } = useProject(projectId);
  const { assets } = useAssets({ projectId });
  const { getTeamMemberById } = useTeam();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [assigneeFilter, setAssigneeFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("updatedAt");
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('list');

  const [selectedAsset, setSelectedAsset] = React.useState<Asset | null>(null);
  const [isAssetSheetOpen, setIsAssetSheetOpen] = React.useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editingAsset, setEditingAsset] = React.useState<Asset | null>(null);

  const projectAssets = React.useMemo(() => {
    if (!project) return [];
    return assets.filter(asset => asset.projectId === project.id);
  }, [assets, project]);

  const teamMemberMap = React.useMemo(() => {
    const map = new Map();
    projectAssets.forEach(asset => {
      if (asset.addedBy && !map.has(asset.addedBy)) {
        const member = getTeamMemberById(asset.addedBy);
        if (member) {
          map.set(asset.addedBy, member);
        }
      }
    });
    return map;
  }, [projectAssets, getTeamMemberById]);

  const uniqueAssignees = React.useMemo(() => {
    const assignees = projectAssets
      .map(asset => asset.addedBy)
      .filter((assignee): assignee is string => assignee !== undefined)
      .filter((assignee, index, array) => array.indexOf(assignee) === index);
    
    return assignees.map(assigneeId => {
      const member = teamMemberMap.get(assigneeId);
      return member ? { value: assigneeId, label: member.name } : null;
    }).filter((item): item is { value: string; label: string } => item !== null);
  }, [projectAssets, teamMemberMap]);

  const assetStats = React.useMemo(() => {
    const totalAssets = projectAssets.length;
    const totalSize = projectAssets.reduce((sum, asset) => sum + (asset.fileSize || asset.size || 0), 0);
    const imageCount = projectAssets.filter(a => a.type === "image").length;
    const videoCount = projectAssets.filter(a => a.type === "video").length;
    const documentCount = projectAssets.filter(a => a.type === "document" || a.type === "pdf").length;
    const audioCount = projectAssets.filter(a => a.type === "audio").length;
    const recentAssets = projectAssets.filter(asset => {
      const createdDate = new Date(asset.createdAt);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return createdDate > weekAgo;
    });
    
    return {
      totalAssets,
      totalSize,
      imageCount,
      videoCount,
      documentCount,
      audioCount,
      recentCount: recentAssets.length
    };
  }, [projectAssets]);

  const filteredAndSortedAssets = React.useMemo(() => {
    let filtered = projectAssets;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(asset =>
        asset.title.toLowerCase().includes(searchLower) ||
        (asset.filename?.toLowerCase().includes(searchLower) ?? false) ||
        (asset.fileName?.toLowerCase().includes(searchLower) ?? false) ||
        (asset.description?.toLowerCase().includes(searchLower) ?? false)
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(asset => asset.type === typeFilter);
    }

    if (assigneeFilter !== "all") {
      filtered = filtered.filter(asset => asset.addedBy === assigneeFilter);
    }

    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "createdAt":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "updatedAt":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case "fileSize":
          return (b.fileSize || b.size || 0) - (a.fileSize || a.size || 0);
        case "type":
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return filtered;
  }, [projectAssets, searchTerm, typeFilter, assigneeFilter, sortBy]);

  const openAssetSheet = React.useCallback((asset: Asset) => {
    setSelectedAsset(asset);
    setIsAssetSheetOpen(true);
  }, []);

  const openEditModal = React.useCallback((asset: Asset) => {
    setEditingAsset(asset);
    setIsEditModalOpen(true);
  }, []);

  const handleCreateAsset = React.useCallback((newAssetData: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log('Created new asset:', newAssetData);
  }, []);

  const handleUpdateAsset = React.useCallback((updatedAsset: Asset) => {
    console.log('Updated asset:', updatedAsset);
  }, []);

  const handleDeleteAsset = React.useCallback((asset: Asset) => {
    if (confirm(`Are you sure you want to delete "${asset.title}"?`)) {
      console.log('Deleted asset:', asset.title);
    }
  }, []);

  const handleDuplicateAsset = React.useCallback((asset: Asset) => {
    console.log('Duplicated asset:', asset);
  }, []);

  const assetColumns: ColumnDef<Asset>[] = React.useMemo(() => [
    {
      id: "typeIcon",
      header: () => '',
      cell: ({ row }) => {
        const type = row.original.type;
        return (
          <div className={`p-2 rounded-md flex flex-col items-center ${getTypeColor(type)}`}>
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
              {asset.filename || asset.fileName || asset.description || "No description"}
            </div>
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
        const fileSize = asset.fileSize || asset.size || 0;
        return (
          <div className="flex items-center gap-1">
            <HardDrive className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs">
              {fileSize ? formatFileSize(fileSize) : "Unknown"}
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
        
        const member = teamMemberMap.get(addedBy);
        if (!member) {
          return <div className="text-muted-foreground">Unknown</div>;
        }
        
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6 border border-background">
              <AvatarImage src={member.avatarUrl} />
              <AvatarFallback className="text-xs">
                {member.name.split(" ").map((n: string) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="text-xs">{member.name}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Last updated",
      cell: ({ row }) => {
        const updatedAt = row.getValue("updatedAt") as string;
        return <div className="text-xs">{formatRelativeTime(updatedAt)}</div>;
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
                <FileX className="h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500" onClick={() => handleDeleteAsset(asset)}>
                <Trash2 className="h-4 w-4 text-red-500" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [teamMemberMap, openAssetSheet, openEditModal, handleDuplicateAsset, handleDeleteAsset]);

  const table = useReactTable({
    data: filteredAndSortedAssets,
    columns: assetColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.id,
  });

  if (!project) {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium tracking-tight">Assets</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Asset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <div className="p-2 rounded-md bg-secondary">
              <File className="h-4 w-4 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assetStats.totalAssets}</div>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(assetStats.totalSize)} total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Images</CardTitle>
            <div className="p-2 rounded-md bg-secondary">
              <Image className="h-4 w-4 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assetStats.imageCount}</div>
            <p className="text-xs text-foreground">
              {assetStats.videoCount} videos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <div className="p-2 rounded-md bg-secondary">
              <FileText className="h-4 w-4 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assetStats.documentCount}</div>
            <p className="text-xs text-foreground">
              {assetStats.audioCount} audio files
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recent</CardTitle>
            <div className="p-2 rounded-md bg-secondary">
              <Upload className="h-4 w-4 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assetStats.recentCount}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-4">
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

      {viewMode === 'list' ? (
        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/50">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={assetColumns.length} className="h-24 text-center">
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
              const addedBy = asset.addedBy ? teamMemberMap.get(asset.addedBy) : null;
              
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
                        </div>
                        <div className="mt-2">
                          <Badge className={getTypeColor(asset.type)}>
                            {asset.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-6 line-clamp-2">
                          {asset.description || asset.fileName || asset.filename || "No description"}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm text-muted-foreground">
                          {asset.fileSize || asset.size ? formatFileSize(asset.fileSize || asset.size || 0) : "Unknown size"}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-2">
                          {addedBy ? (
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6 border border-background">
                                <AvatarImage src={addedBy.avatarUrl} />
                                <AvatarFallback className="text-xs">
                                  {addedBy.name.split(" ").map((n: string) => n[0]).join("")}
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
                        <div className="text-sm text-muted-foreground">
                          {formatRelativeTime(asset.updatedAt)}
                        </div>
                      </div>

                      <Button 
                        variant="default"
                        className="w-full mt-2" 
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
            <div className="col-span-full text-center py-8 text-muted-foreground">
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

      <AssetSheetModal
        asset={selectedAsset}
        open={isAssetSheetOpen}
        onOpenChange={setIsAssetSheetOpen}
      />

      <AssetCreateModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        projectId={project.id}
        onCreateAsset={handleCreateAsset}
      />

      <AssetEditModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        asset={editingAsset}
        onUpdateAsset={handleUpdateAsset}
      />
    </div>
  );
}