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
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus, Filter, Mail, UserMinus, Settings, MessageCircle, Crown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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
  TeamMember,
  Project,
  getTeamMemberById,
  team,
  getTasksByProjectId
} from "@/lib/utils/dummy-data";
import { format } from "date-fns";

interface ProjectTeamListProps {
  project: Project;
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

const getProjectRoleBadgeColor = (projectRole: string) => {
  switch (projectRole) {
    case "lead":
      return "bg-purple-100 text-purple-800";
    case "contributor":
      return "bg-blue-100 text-blue-800";
    case "reviewer":
      return "bg-green-100 text-green-800";
    case "viewer":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Extended team member interface with project-specific data
interface ProjectTeamMember extends TeamMember {
  projectRole?: string;
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
}

export const projectTeamColumns: ColumnDef<ProjectTeamMember>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Member
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const member = row.original;
      
      return (
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={member.avatarUrl} />
            <AvatarFallback>
              {member.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <div className="font-medium truncate">{member.name}</div>
            <div className="text-sm text-muted-foreground truncate">
              {member.email}
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
        <Badge variant="outline" className={getRoleBadgeColor(role)}>
          {role.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "projectRole",
    header: "Project Role",
    cell: ({ row }) => {
      const projectRole = row.getValue("projectRole") as string;
      if (!projectRole) return <div className="text-muted-foreground">—</div>;
      
      return (
        <div className="flex items-center space-x-1">
          {projectRole === "lead" && <Crown className="h-3 w-3 text-purple-600" />}
          <Badge variant="outline" className={getProjectRoleBadgeColor(projectRole)}>
            {projectRole}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "totalTasks",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tasks
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Completed
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Joined
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const joinedAt = row.getValue("joinedAt") as string;
      
      if (!joinedAt) return <div className="text-muted-foreground">No date</div>;
      
      const date = new Date(joinedAt);
      
      return (
        <div className="flex items-center space-x-1">
          <span className="text-sm">{format(date, "MMM yyyy")}</span>
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
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              Send Message
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MessageCircle className="mr-2 h-4 w-4" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Change Role
            </DropdownMenuItem>
            <DropdownMenuItem>
              Assign Tasks
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <UserMinus className="mr-2 h-4 w-4" />
              Remove from Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function ProjectTeamList({ project }: ProjectTeamListProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [roleFilter, setRoleFilter] = React.useState<string>("all");
  const [isAddMemberOpen, setIsAddMemberOpen] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState("");
  const [selectedMember, setSelectedMember] = React.useState("");

  // Get project team members with stats
  const projectTeamMembers: ProjectTeamMember[] = React.useMemo(() => {
    return (project.assignedTo || [])
      .map(id => {
        const member = getTeamMemberById(id);
        if (!member) return null;
        
        const tasks = getTasksByProjectId(project.id).filter(task => task.assignedTo === id);
        const completedTasks = tasks.filter(task => task.status === "completed");
        
        return {
          ...member,
          projectRole: "contributor", // Default role, would come from project_members table in real app
          totalTasks: tasks.length,
          completedTasks: completedTasks.length,
          activeTasks: tasks.length - completedTasks.length
        } as ProjectTeamMember;
      })
      .filter((member): member is ProjectTeamMember => member !== null);
  }, [project.id, project.assignedTo]);

  // Get available team members not in project
  const availableMembers = team.filter(member => 
    !project.assignedTo?.includes(member.id)
  );

  // Filter team members based on role
  const filteredTeamMembers = React.useMemo(() => {
    let filtered = projectTeamMembers;
    
    if (roleFilter !== "all") {
      filtered = filtered.filter(member => member.role === roleFilter);
    }
    
    return filtered;
  }, [projectTeamMembers, roleFilter]);

  const table = useReactTable({
    data: filteredTeamMembers,
    columns: projectTeamColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
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
  const totalMembers = projectTeamMembers.length;
  const activeMembers = projectTeamMembers.filter(m => m.activeTasks > 0).length;
  const totalTasks = projectTeamMembers.reduce((sum, member) => sum + member.totalTasks, 0);
  const completedTasks = projectTeamMembers.reduce((sum, member) => sum + member.completedTasks, 0);

  return (
    <div className="space-y-0">
      {/* Team Table */}
      <div className="w-full flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search team members..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="designer">Designer</SelectItem>
              <SelectItem value="developer">Developer</SelectItem>
              <SelectItem value="content_writer">Content Writer</SelectItem>
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
            <DialogTrigger asChild>
              <Button variant="default">
                <Plus className="h-4 w-4" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
                <DialogDescription>
                  Add a new member to this project team.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="member">Select Member</Label>
                  <Select value={selectedMember} onValueChange={setSelectedMember}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
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
                  <Label htmlFor="role">Project Role</Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lead">Project Lead</SelectItem>
                      <SelectItem value="contributor">Contributor</SelectItem>
                      <SelectItem value="reviewer">Reviewer</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMember} disabled={!selectedMember || !selectedRole}>
                  Add Member
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
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
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={projectTeamColumns.length}
                    className="h-24 text-center"
                  >
                    No team members found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
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
    </div>
  );
}