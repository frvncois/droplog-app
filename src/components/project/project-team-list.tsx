// components/projects/project-team-list.tsx

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
  Settings,
  UserMinus,
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
  UserPlus,
  Edit,
  Shield,
  Star,
  Activity
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
  Project,
  TeamMember,
  getTeamMemberById,
  team,
  getTasksByProjectId
} from "@/lib/utils/dummy-data";
import { format } from "date-fns";
import { formatRelativeTime } from "@/lib/utils";
import { TeamSheetModal } from "@/components/modals/team-sheet-modal";
import { TeamAddModal } from "@/components/modals/team-add-modal";

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

const getRoleIcon = (role: string) => {
  switch (role) {
    case "admin":
      return <Crown className="h-4 w-4 text-red-500" />;
    case "manager":
      return <Shield className="h-4 w-4 text-purple-500" />;
    case "designer":
      return <Star className="h-4 w-4 text-blue-500" />;
    case "developer":
      return <Settings className="h-4 w-4 text-green-500" />;
    case "content_writer":
      return <Edit className="h-4 w-4 text-yellow-500" />;
    default:
      return <User className="h-4 w-4 text-gray-500" />;
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
  
  // Filter states
  const [searchTerm, setSearchTerm] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("name");
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('list');

  // Modal states
  const [selectedMember, setSelectedMember] = React.useState<ProjectTeamMember | null>(null);
  const [isTeamSheetOpen, setIsTeamSheetOpen] = React.useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = React.useState(false);

  // Function to open team sheet modal
  const openTeamSheet = (member: ProjectTeamMember) => {
    setSelectedMember(member);
    setIsTeamSheetOpen(true);
  };

  // Function to handle role change
  const handleRoleChange = (member: ProjectTeamMember, newRole: string) => {
    const updatedMember: ProjectTeamMember = {
      ...member,
      role: newRole as any,
    };
    
    setData(prev => prev.map(m => m.id === member.id ? updatedMember : m));
    console.log(`Member "${member.name}" role changed to:`, newRole);
  };

  // Function to handle member addition
  const handleAddMember = (memberData: { memberId: string; role: string }) => {
    const member = getTeamMemberById(memberData.memberId);
    if (!member) return;
    
    const tasks = getTasksByProjectId(project.id).filter(task => task.assignedTo === member.id);
    const completedTasks = tasks.filter(task => task.status === "completed");
    
    const newProjectMember: ProjectTeamMember = {
      ...member,
      role: memberData.role as any,
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      activeTasks: tasks.length - completedTasks.length
    };
    
    setData(prev => [newProjectMember, ...prev]);
    console.log('Added member to project:', newProjectMember);
  };

  // Function to handle member removal
  const handleRemoveMember = (member: ProjectTeamMember) => {
    if (confirm(`Are you sure you want to remove "${member.name}" from this project?`)) {
      setData(prev => prev.filter(m => m.id !== member.id));
      console.log('Removed member from project:', member.name);
    }
  };

  // Get available team members not in project
  const availableMembers = team.filter(member => 
    !data.some(projectMember => projectMember.id === member.id)
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
      id: "roleIcon", // Changed from accessorKey: "role" to unique id
      header: () => '',
      cell: ({ row }) => {
        const role = row.original.role; // Access role from row.original instead
        return (
          <div className="p-2 rounded-md flex flex-col items-center bg-secondary">
            {getRoleIcon(role)}
          </div>
        );
      },
      size: 50,
    },
    {
      accessorKey: "name",
      header: "Member",
      cell: ({ row }) => {
        const member = row.original;
        
        return (
          <div className="flex flex-col p-2">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={member.avatarUrl} />
                <AvatarFallback>
                  {member.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <Button 
                variant="link" 
                className="p-0 h-auto font-medium hover:text-primary transition-colors cursor-pointer text-left justify-start"
                onClick={() => openTeamSheet(member)}
              >
                {member.name}
              </Button>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role", // Keep this one as is
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
            <div className="text-sm">{formatRelativeTime(joinedAt)}</div>
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
              <DropdownMenuItem onClick={() => openTeamSheet(member)}>
                <Info className="mr-2 h-4 w-4" />
                View profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('View tasks:', member.name)}>
                <Target className="mr-2 h-4 w-4" />
                View tasks
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Settings className="mr-2 h-4 w-4" />
                    Change role
                  </DropdownMenuItem>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="left" align="start">
                  <DropdownMenuLabel>Select Role</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {roleOptions.filter(role => role.value !== "all" && role.value !== member.role).map((role) => (
                    <DropdownMenuItem 
                      key={role.value} 
                      onClick={() => handleRoleChange(member, role.value)}
                      className="flex items-center gap-2"
                    >
                      {getRoleIcon(role.value)}
                      {role.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenuItem onClick={() => console.log('Send message:', member.name)}>
                <Mail className="mr-2 h-4 w-4" />
                Send message
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500" onClick={() => handleRemoveMember(member)}>
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
    getRowId: (row) => row.id,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  // Team stats
  const totalMembers = data.length;
  const activeMembers = data.filter(m => m.activeTasks > 0).length;
  const totalTasks = data.reduce((sum, member) => sum + member.totalTasks, 0);
  const completedTasks = data.reduce((sum, member) => sum + member.completedTasks, 0);
  const teamCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

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
          <Button onClick={() => setIsAddMemberOpen(true)}>
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
            <div className="p-2 rounded-md bg-secondary">
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              {activeMembers} currently active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Progress</CardTitle>
            <div className="p-2 rounded-md bg-secondary">
              <Target className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamCompletionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Overall completion rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <div className="p-2 rounded-md bg-secondary">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              Assigned to team
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <div className="p-2 rounded-md bg-secondary">
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              Tasks completed
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
                    colSpan={teamColumns.length}
                    className="h-24 text-center"
                  >
                    No team members found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedTeamMembers.length > 0 ? (
            filteredAndSortedTeamMembers.map((member) => {
              const completionRate = member.totalTasks > 0 
                ? Math.round((member.completedTasks / member.totalTasks) * 100) 
                : 0;
              
              return (
                <Card key={member.id} className="group hover:shadow-sm transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-md bg-secondary">
                              {getRoleIcon(member.role)}
                            </div>
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={member.avatarUrl} />
                              <AvatarFallback>
                                {member.name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => openTeamSheet(member)}>
                                <Info className="mr-2 h-4 w-4" />
                                View profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => console.log('View tasks:', member.name)}>
                                <Target className="mr-2 h-4 w-4" />
                                View tasks
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    Change role
                                  </DropdownMenuItem>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side="left" align="start">
                                  <DropdownMenuLabel>Select Role</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  {roleOptions.filter(role => role.value !== "all" && role.value !== member.role).map((role) => (
                                    <DropdownMenuItem 
                                      key={role.value} 
                                      onClick={() => handleRoleChange(member, role.value)}
                                      className="flex items-center gap-2"
                                    >
                                      {getRoleIcon(role.value)}
                                      {role.label}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                              <DropdownMenuItem onClick={() => console.log('Send message:', member.name)}>
                                <Mail className="mr-2 h-4 w-4" />
                                Send message
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-500" onClick={() => handleRemoveMember(member)}>
                                <UserMinus className="mr-2 h-4 w-4 text-red-500" />
                                Remove from project
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="mt-3">
                          <Button 
                            variant="link" 
                            className="p-0 h-auto text-left justify-start"
                            onClick={() => openTeamSheet(member)}
                          >
                            <CardTitle className="text-lg hover:text-primary transition-colors">
                              {member.name}
                            </CardTitle>
                          </Button>
                          <div className="mt-2 flex items-center gap-2">
                            <Badge className={getRoleBadgeColor(member.role)}>
                              {member.role.replace("_", " ")}
                            </Badge>
                          </div>
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

                      {/* View Profile Button */}
                      <Button 
                        variant="default"
                        className="w-full" 
                        onClick={() => openTeamSheet(member)}
                      >
                        View Profile
                      </Button>
                      
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-sm flex items-center border rounded-xl justify-center h-32 bg-card text-muted-foreground">
              <p>No team members found.</p>
            </div>
          )}
        </div>
      )}
      
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
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

      {/* Team Sheet Modal */}
      <TeamSheetModal
        member={selectedMember}
        open={isTeamSheetOpen}
        onOpenChange={setIsTeamSheetOpen}
        project={project}
      />

      {/* Team Add Modal */}
      <TeamAddModal
        open={isAddMemberOpen}
        onOpenChange={setIsAddMemberOpen}
        availableMembers={availableMembers}
        onAddMember={handleAddMember}
      />
    </div>
  );
}