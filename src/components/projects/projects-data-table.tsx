// components/projects/projects-data-table.tsx

"use client";

import * as React from "react";
import Link from "next/link";
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
  Row,
} from "@tanstack/react-table";
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
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  ExternalLink, 
  Users, 
  Settings, 
  Archive, 
  MoreVertical,
  Eye,
  Search,
  Filter,
  SortAsc,
  Grid,
  List,
  GripVertical,
  Info
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
import { Project } from "@/lib/types";
import { useTasks } from "@/hooks/use-tasks";
import { useTeam } from "@/hooks/use-team";
import { formatRelativeTime } from "@/lib/utils";
import { ProjectOverviewModal } from "@/components/modals/project-overview-modal";

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    case "archived":
      return "bg-gray-100 text-gray-800";
    case "on_hold":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Status filter options
const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
  { value: "on_hold", label: "On Hold" },
];

// Sort options
const sortOptions = [
  { value: "updatedAt", label: "Last Updated" },
  { value: "createdAt", label: "Created Date" },
  { value: "title", label: "Name A-Z" },
  { value: "tasksCount", label: "Task Count" },
];

// Drag handle component following Shadcn pattern
function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <div
      {...attributes}
      {...listeners}
      className="flex items-center justify-center cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors p-1"
    >
      <GripVertical className="h-3 w-3" />
      <span className="sr-only">Drag to reorder</span>
    </div>
  );
}

// Draggable row component following Shadcn pattern
function DraggableRow({ row }: { row: Row<Project> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80 hover:bg-muted/50"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

interface ProjectsDataTableProps {
  projects: Project[];
}

export function ProjectsDataTable({ projects }: ProjectsDataTableProps) {
  const [data, setData] = React.useState(() => projects);
  
  React.useEffect(() => {
    setData(projects);
  }, [projects]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  
  // Filter states
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("updatedAt");
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('list');

  // Project Overview Modal state
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);
  const [isOverviewModalOpen, setIsOverviewModalOpen] = React.useState(false);

  // Hooks for data
  const { tasks } = useTasks();
  const { team, getTeamMemberById } = useTeam();

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

  // Function to open project overview modal
  const openProjectOverview = (project: Project) => {
    setSelectedProject(project);
    setIsOverviewModalOpen(true);
  };

  // Memoize project tasks calculation
  const projectTasksMap = React.useMemo(() => {
    const map = new Map<string, { total: number; active: number }>();
    
    data.forEach(project => {
      const projectTasks = tasks.filter(task => task.projectId === project.id);
      const activeTasks = projectTasks.filter(task => task.status !== "completed");
      
      map.set(project.id, {
        total: projectTasks.length,
        active: activeTasks.length
      });
    });
    
    return map;
  }, [data, tasks]);

  // Filter and sort projects (optimized)
  const filteredAndSortedProjects = React.useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchLower) ||
        (project.description?.toLowerCase().includes(searchLower) ?? false)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(project => project.status === statusFilter);
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
        case "tasksCount":
          return b.tasksCount - a.tasksCount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [data, searchTerm, statusFilter, sortBy]);

  const projectColumns: ColumnDef<Project>[] = React.useMemo(() => [
    {
      id: "drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={row.original.id} />,
      enableSorting: false,
      enableHiding: false,
      size: 24,
    },
    {
      accessorKey: "title",
      header: "Project",
      cell: ({ row }) => {
        const project = row.original;
        
        return (
          <div className="flex flex-col space-y-0 p-2">
            <Link 
              href={`/app/projects/${project.id}`}
              className="font-medium hover:text-primary transition-colors cursor-pointer"
            >
              {project.title}
            </Link>
            <div className="text-sm text-muted-foreground line-clamp-1">
              {project.description || "No description"}
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
      accessorKey: "assignedTo",
      header: "Team",
      cell: ({ row }) => {
        const assignedTo = row.getValue("assignedTo") as string[];
        
        if (!assignedTo || assignedTo.length === 0) {
          return <div className="text-muted-foreground">No team assigned</div>;
        }
        
        return (
          <div className="flex items-center space-x-1">
            <div className="flex -space-x-1">
              {assignedTo.slice(0, 3).map((memberId) => {
                const member = getTeamMemberById(memberId);
                if (!member) return null;
                
                return (
                  <Avatar key={memberId} className="h-6 w-6 border border-background">
                    <AvatarImage src={member.avatarUrl} />
                    <AvatarFallback className="text-xs">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                );
              })}
              {assignedTo.length > 3 && (
                <div className="h-6 w-6 rounded-full bg-muted border border-background flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">
                    +{assignedTo.length - 3}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "tasksCount",
      header: "Tasks",
      cell: ({ row }) => {
        const project = row.original;
        const taskCounts = projectTasksMap.get(project.id) || { total: 0, active: 0 };
        
        return (
          <div className="flex flex-col">
            <div className="font-medium">
              {taskCounts.active} active
            </div>
            <div className="text-muted-foreground">{taskCounts.total} total</div>
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
            <div>{formatRelativeTime(updatedAt)}</div>
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const project = row.original;

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
              <DropdownMenuItem onClick={() => openProjectOverview(project)}>
                <Info className="mr-2 h-4 w-4" />
                Project details
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/app/projects/${project.id}`}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View project
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/app/projects/${project.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  Open in editor
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500">
                <Archive className="mr-2 h-4 w-4 text-red-500" />
                Delete project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [projectTasksMap, getTeamMemberById]);

  const table = useReactTable({
    data: filteredAndSortedProjects,
    columns: projectColumns,
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
            placeholder="Search projects..."
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
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
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
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={projectColumns.length}
                      className="h-24 text-center"
                    >
                      No projects found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedProjects.length > 0 ? (
            filteredAndSortedProjects.map((project) => {
              const taskCounts = projectTasksMap.get(project.id) || { total: 0, active: 0 };
              
              return (
                <Card key={project.id} className="group justify-between">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <Link href={`/app/projects/${project.id}`}>
                            <CardTitle className="text-lg hover:text-primary transition-colors">
                              {project.title}
                            </CardTitle>
                          </Link>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => openProjectOverview(project)}>
                                <Info className="mr-2 h-4 w-4" />
                                Project details
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/app/projects/${project.id}`}>
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  View Project
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/app/projects/${project.id}/settings`}>
                                  <Settings className="mr-2 h-4 w-4" />
                                  Settings
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-500">
                                <Archive className="mr-2 h-4 w-4 text-red-500" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="mt-2">
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {project.description || "No description"}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* Team Members */}
                      {project.assignedTo && project.assignedTo.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <div className="flex -space-x-1">
                            {project.assignedTo.slice(0, 3).map((memberId) => {
                              const member = getTeamMemberById(memberId);
                              if (!member) return null;
                              
                              return (
                                <Avatar key={memberId} className="h-6 w-6 border border-background">
                                  <AvatarImage src={member.avatarUrl} />
                                  <AvatarFallback className="text-xs">
                                    {member.name.split(" ").map(n => n[0]).join("")}
                                  </AvatarFallback>
                                </Avatar>
                              );
                            })}
                            {project.assignedTo.length > 3 && (
                              <div className="h-6 w-6 rounded-full bg-muted border border-background flex items-center justify-center">
                                <span className="text-xs text-muted-foreground">
                                  +{project.assignedTo.length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Tasks Info */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-muted-foreground">
                          {taskCounts.total} tasks, {taskCounts.active} active
                        </div>
                        <div className="text-muted-foreground">
                          {formatRelativeTime(project.updatedAt)}
                        </div>
                      </div>
                      
                      {/* Open Project Button */}
                      <Button asChild className="w-full">
                        <Link href={`/app/projects/${project.id}`}>
                          Open Project
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full flex items-center justify-center h-32 text-muted-foreground">
              No projects found.
            </div>
          )}
        </div>
      )}
      
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          Showing {table.getRowModel().rows.length} of {filteredAndSortedProjects.length} projects.
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

      {/* Project Overview Modal */}
      <ProjectOverviewModal
        project={selectedProject}
        open={isOverviewModalOpen}
        onOpenChange={setIsOverviewModalOpen}
      />
    </div>
  );
}