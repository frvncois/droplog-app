// components/projects/project-team-list.tsx

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
  Plus,
  Settings, 
  UserMinus, 
  MoreVertical,
  Search,
  Filter,
  SortAsc,
  Grid,
  List,
  GripVertical,
  Info,
  Mail,
  MessageCircle,
  User,
  Users,
  Calendar,
  Crown,
  CheckCircle,
  Clock,
  Target,
  UserPlus
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Project,
  TeamMember,
  getTeamMemberById,
  team,
  getTasksByProjectId
} from "@/lib/utils/dummy-data";
import { format } from "date-fns";
import { formatRelativeTime } from "@/lib/utils";

// Extended team member interface with project-specific data
interface ProjectTeamMember extends TeamMember {
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
}

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "admin":
      return "bg-red-100 text-red-800";
    case "manager":
      return "bg-purple-100 text-purple-800";
    case "designer":
      return "bg-blue-100 text-blue-800";
    case "developer":
      return "bg-green-100 text-green-800";
    case "content_writer":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};


// Role filter options
const roleOptions = [
  { value: "all", label: "All Roles" },
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "designer", label: "Designer" },
  { value: "developer", label: "Developer" },
  { value: "content_writer", label: "Content Writer" },
];

// Sort options
const sortOptions = [
  { value: "name", label: "Name A-Z" },
  { value: "totalTasks", label: "Total Tasks" },
  { value: "completedTasks", label: "Completed Tasks" },
  { value: "activeTasks", label: "Active Tasks" },
  { value: "joinedAt", label: "Join Date" },
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
function DraggableRow({ row }: { row: Row<ProjectTeamMember> }) {
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

interface ProjectTeamListProps {
  project: Project;
  teamMembers?: ProjectTeamMember[];
}

export function ProjectTeamList({ project, teamMembers: externalTeamMembers }: ProjectTeamListProps) {
  // Get project team members with stats
  const originalTeamMembers: ProjectTeamMember[] = React.useMemo(() => {
    return (project.assignedTo || [])
      .map(id => {
        const member = getTeamMemberById(id);
        if (!member) return null;
        
        const tasks = getTasksByProjectId(project.id).filter(task => task.assignedTo === id);
        const completedTasks = tasks.filter(task => task.status === "completed");
        
        return {
          ...member,
          totalTasks: tasks.length,
          completedTasks: completedTasks.length,
          activeTasks: tasks.length - completedTasks.length
        } as ProjectTeamMember;
      })
      .filter((member): member is ProjectTeamMember => member !== null);
  }, [project.id, project.assignedTo]);

  const [data, setData] = React.useState(() => externalTeamMembers || originalTeamMembers);

  // Update data when external team members change
  React.useEffect(() => {
    if (externalTeamMembers) {
      setData(externalTeamMembers);
    } else {
      setData(originalTeamMembers);
    }
  }, [externalTeamMembers, originalTeamMembers]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  
  // Filter states
  const [searchTerm, setSearchTerm] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("name");
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('list');

  // Add member modal state
  const [isAddMemberOpen, setIsAddMemberOpen] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState("");
  const [selectedMember, setSelectedMember] = React.useState("");

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

  // Get available team members not in project
  const availableMembers = team.filter(member => 
    !project.assignedTo?.includes(member.id)
  );

  // Filter and sort team members
  const filteredAndSortedTeamMembers = React.useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      );
    }

    // Apply role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter(member => member.role === roleFilter);
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "totalTasks":
          return b.totalTasks - a.totalTasks;
        case "completedTasks":
          return b.completedTasks - a.completedTasks;
        case "activeTasks":
          return b.activeTasks - a.activeTasks;
        case "joinedAt":
          const aDate = a.joinedAt ? new Date(a.joinedAt).getTime() : 0;
          const bDate = b.joinedAt ? new Date(b.joinedAt).getTime() : 0;
          return bDate - aDate;
        default:
          return 0;
      }
    });

    return filtered;
  }, [data, searchTerm, roleFilter, sortBy]);

  const teamColumns: ColumnDef<ProjectTeamMember>[] = [
    {
      id: "drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={row.original.id} />,
      enableSorting: false,
      enableHiding: false,
      size: 24,
    },
    {
      accessorKey: "name",
      header: "Member",
      cell: ({ row }) => {
        const member = row.original;
        
        return (
          <div className="flex items-center space-x-3 p-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={member.avatarUrl} />
              <AvatarFallback>
                {member.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <div className="font-medium hover:text-primary transition-colors cursor-pointer">
                {member.name}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        return (
          <Badge className={getRoleBadgeColor(role)}>
            {role.replace("_", " ")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "totalTasks",
      header: "Tasks",
      cell: ({ row }) => {
        const member = row.original;
        
        return (
          <div className="flex items-center space-x-2">
            <div className="text-sm">
              <span className="font-medium">{member.totalTasks}</span>
              <span className="text-muted-foreground"> total</span>
            </div>
            {member.activeTasks > 0 && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                {member.activeTasks} active
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "completedTasks",
      header: "Completed",
      cell: ({ row }) => {
        const member = row.original;
        const completionRate = member.totalTasks > 0 
          ? Math.round((member.completedTasks / member.totalTasks) * 100) 
          : 0;
        
        return (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-green-600">
              {member.completedTasks}
            </span>
            <span className="text-xs text-muted-foreground">
              ({completionRate}%)
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "joinedAt",
      header: "Joined",
      cell: ({ row }) => {
        const joinedAt = row.getValue("joinedAt") as string;
        
        if (!joinedAt) return <div className="text-muted-foreground">No date</div>;
        
        return (
          <div className="flex flex-col">
            <div>{format(new Date(joinedAt), "MMM yyyy")}</div>
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const member = row.original;

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
              <DropdownMenuItem onClick={() => console.log('View profile:', member.name)}>
                <Info className="mr-2 h-4 w-4" />
                View profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('View tasks:', member.name)}>
                <Target className="mr-2 h-4 w-4" />
                View tasks
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => console.log('Change role:', member.name)}>
                <Settings className="mr-2 h-4 w-4" />
                Change role
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500" onClick={() => console.log('Remove member:', member.name)}>
                <UserMinus className="mr-2 h-4 w-4 text-red-500" />
                Remove from project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredAndSortedTeamMembers,
    columns: teamColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row.id,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleAddMember = () => {
    // In a real app, this would make an API call
    console.log("Adding member:", selectedMember, "with role:", selectedRole);
    setIsAddMemberOpen(false);
    setSelectedMember("");
    setSelectedRole("");
  };

  // Team stats
  const totalMembers = data.length;
  const activeMembers = data.filter(m => m.activeTasks > 0).length;
  const totalTasks = data.reduce((sum, member) => sum + member.totalTasks, 0);
  const completedTasks = data.reduce((sum, member) => sum + member.completedTasks, 0);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium tracking-tight">Team</h2>
          <p className="text-muted-foreground text-sm">
            Manage team members and roles for {project.title}
          </p>
        </div>
        <div className="flex items-center gap-2">

              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMembers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          {/* Role Filter */}
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((option) => (
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


      {/* Selection Info */}
      {Object.keys(rowSelection).length > 0 && (
        <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
          <div className="text-sm">
            {Object.keys(rowSelection).length} team member(s) selected
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Send Message
            </Button>
            <Button size="sm" variant="outline">
              <Target className="h-4 w-4 mr-2" />
              Assign Tasks
            </Button>
            <Button size="sm" variant="destructive">
              <UserMinus className="h-4 w-4 mr-2" />
              Remove Selected
            </Button>
          </div>
        </div>
      )}
      
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
                      colSpan={teamColumns.length}
                      className="h-24 text-center"
                    >
                      No team members found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedTeamMembers.length > 0 ? (
            filteredAndSortedTeamMembers.map((member) => {
              const completionRate = member.totalTasks > 0 
                ? Math.round((member.completedTasks / member.totalTasks) * 100) 
                : 0;
              
              return (
                <Card key={member.id} className="group hover:shadow-md transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={member.avatarUrl} />
                              <AvatarFallback>
                                {member.name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg hover:text-primary transition-colors cursor-pointer">
                                {member.name}
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
                                <DropdownMenuItem onClick={() => console.log('View profile:', member.name)}>
                                  <Info className="mr-2 h-4 w-4" />
                                  View profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => console.log('View tasks:', member.name)}>
                                  <Target className="mr-2 h-4 w-4" />
                                  View tasks
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => console.log('Change role:', member.name)}>
                                  <Settings className="mr-2 h-4 w-4" />
                                  Change role
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500" onClick={() => console.log('Remove member:', member.name)}>
                                  <UserMinus className="mr-2 h-4 w-4 text-red-500" />
                                  Remove from project
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <Badge className={getRoleBadgeColor(member.role)}>
                            {member.role.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* Task Stats */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-muted/50 rounded-lg p-2">
                          <div className="text-lg font-bold">{member.totalTasks}</div>
                          <div className="text-xs text-muted-foreground">Total</div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-2">
                          <div className="text-lg font-bold text-blue-600">{member.activeTasks}</div>
                          <div className="text-xs text-muted-foreground">Active</div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-2">
                          <div className="text-lg font-bold text-green-600">{member.completedTasks}</div>
                          <div className="text-xs text-muted-foreground">Done</div>
                        </div>
                      </div>
                      
                      {/* Completion Rate */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Completion Rate</span>
                          <span className="font-medium">{completionRate}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${completionRate}%` }}
                          />
                        </div>
                      </div>

                      {/* Joined Date */}
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm text-muted-foreground">
                          Joined {member.joinedAt ? format(new Date(member.joinedAt), "MMM yyyy") : "Unknown"}
                        </div>
                      </div>
                      
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full flex items-center justify-center h-32 text-muted-foreground">
              No team members found.
            </div>
          )}
        </div>
      )}
      
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} team member(s) selected.
          Showing {table.getRowModel().rows.length} of {filteredAndSortedTeamMembers.length} team members.
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
    </div>
  );
}