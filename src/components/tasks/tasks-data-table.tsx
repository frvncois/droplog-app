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
import { ArrowUpDown, ChevronDown, MoreHorizontal, Calendar, ExternalLink } from "lucide-react";

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
  Task,
  tasks,
  getProjectById,
  getTeamMemberById 
} from "@/lib/utils/dummy-data";
import { format } from "date-fns";
import Link from "next/link";

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "bg-red-500 text-white";
    case "high":
      return "bg-orange-500 text-white";
    case "medium":
      return "bg-yellow-500 text-white";
    case "low":
      return "bg-green-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "in_progress":
      return "bg-blue-100 text-blue-800";
    case "todo":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const allTasksColumns: ColumnDef<Task>[] = [
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
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Task
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const task = row.original;
      const project = getProjectById(task.projectId);
      
      return (
        <div className="flex flex-col space-y-1">
          <div className="font-medium">{task.title}</div>
          <div className="text-sm text-muted-foreground">
            {project?.title}
          </div>
          {task.description && (
            <div className="text-xs text-muted-foreground line-clamp-1">
              {task.description}
            </div>
          )}
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
          {status.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Priority
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      return (
        <Badge className={`text-xs ${getPriorityColor(priority)}`}>
          {priority}
        </Badge>
      );
    },
  },
  {
    accessorKey: "assignedTo",
    header: "Assignee",
    cell: ({ row }) => {
      const assigneeId = row.getValue("assignedTo") as string;
      const assignee = assigneeId ? getTeamMemberById(assigneeId) : null;
      
      if (!assignee) return <div className="text-muted-foreground">Unassigned</div>;
      
      return (
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={assignee.avatarUrl} />
            <AvatarFallback className="text-xs">
              {assignee.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{assignee.name}</span>
            <span className="text-xs text-muted-foreground capitalize">
              {assignee.role.replace("_", " ")}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dueDate = row.getValue("dueDate") as string;
      const task = row.original;
      
      if (!dueDate) return <div className="text-muted-foreground">No due date</div>;
      
      const date = new Date(dueDate);
      const today = new Date();
      const isOverdue = date < today && task.status !== "completed";
      const isDueSoon = date <= new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000) && !isOverdue && task.status !== "completed";
      
      return (
        <div className={`flex items-center space-x-1 ${
          isOverdue ? 'text-red-600' : isDueSoon ? 'text-orange-600' : ''
        }`}>
          <Calendar className="h-3 w-3" />
          <div className="flex flex-col">
            <span className="text-sm">{format(date, "MMM d, yyyy")}</span>
            {isOverdue && (
              <Badge variant="destructive" className="text-xs w-fit">
                Overdue
              </Badge>
            )}
            {isDueSoon && !isOverdue && (
              <Badge variant="outline" className="text-xs w-fit text-orange-600">
                Due Soon
              </Badge>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Updated
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const updatedAt = row.getValue("updatedAt") as string;
      const date = new Date(updatedAt);
      
      return (
        <div className="text-sm text-muted-foreground">
          {format(date, "MMM d")}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const task = row.original;

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
            <DropdownMenuItem asChild>
              <Link href={`/app/projects/${task.projectId}?task=${task.id}`}>
                <ExternalLink className="mr-2 h-4 w-4" />
                View Task
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Edit Task
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {task.status === "completed" ? "Mark as Incomplete" : "Mark as Complete"}
            </DropdownMenuItem>
            <DropdownMenuItem>
              Change Priority
            </DropdownMenuItem>
            <DropdownMenuItem>
              Assign to Member
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Duplicate Task
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Delete Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function TasksDataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [priorityFilter, setPriorityFilter] = React.useState<string>("all");
  const [assigneeFilter, setAssigneeFilter] = React.useState<string>("all");

  // Filter tasks based on all filters
  const filteredTasks = React.useMemo(() => {
    let filtered = tasks;
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(task => task.status === statusFilter);
    }
    
    if (priorityFilter !== "all") {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }
    
    if (assigneeFilter !== "all") {
      if (assigneeFilter === "unassigned") {
        filtered = filtered.filter(task => !task.assignedTo);
      } else if (assigneeFilter === "me") {
        // Mock current user filter - in real app this would be actual user ID
        filtered = filtered.filter(task => task.assignedTo === "u1");
      } else {
        filtered = filtered.filter(task => task.assignedTo === assigneeFilter);
      }
    }
    
    return filtered;
  }, [statusFilter, priorityFilter, assigneeFilter]);

  const table = useReactTable({
    data: filteredTasks,
    columns: allTasksColumns,
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

  return (

        <div className="w-full">
          {/* Filters Row */}
          <div className="flex items-center py-4 space-x-2 flex-wrap gap-4">
            <Input
              placeholder="Search tasks..."
              value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("title")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                <SelectItem value="me">My Tasks</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                <SelectItem value="u1">Alice Johnson</SelectItem>
                <SelectItem value="u2">Bob Smith</SelectItem>
                <SelectItem value="u3">Carol Davis</SelectItem>
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
          </div>
          
          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <div>
              Showing {table.getFilteredRowModel().rows.length} of {tasks.length} tasks
            </div>
            <div className="flex items-center space-x-2">
              {table.getFilteredSelectedRowModel().rows.length > 0 && (
                <Badge variant="secondary">
                  {table.getFilteredSelectedRowModel().rows.length} selected
                </Badge>
              )}
            </div>
          </div>
          
          {/* Data Table */}
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
                      className="hover:bg-muted/50"
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
                      colSpan={allTasksColumns.length}
                      className="h-24 text-center"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className="text-muted-foreground">No tasks found</div>
                        <div className="text-sm text-muted-foreground">
                          Try adjusting your filters or create a new task
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-muted-foreground flex-1 text-sm">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                <span className="text-sm text-muted-foreground">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </span>
              </div>
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