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
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus, ExternalLink } from "lucide-react";

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
  CheckSquare,
  Calendar,
} from "lucide-react";
import { 
  Task,
  getTasksByAssignee, 
  getProjectById,
  getTeamMemberById 
} from "@/lib/utils/dummy-data";
import { format } from "date-fns";

type TaskFilter = "recent" | "due_date" | "urgent" | "completed";

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

export const taskColumns: ColumnDef<Task>[] = [
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
        <div className="flex flex-col">
          <div className="font-medium">{task.title}</div>
          <div className="text-sm text-muted-foreground">
            {project?.title}
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
        <Badge variant="outline" className={getStatusColor(status)}>
          {status.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
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
          <span className="text-sm">{assignee.name}</span>
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
      
      if (!dueDate) return <div className="text-muted-foreground">No due date</div>;
      
      const date = new Date(dueDate);
      const isOverdue = date < new Date() && row.original.status !== "completed";
      
      return (
        <div className={`flex items-center space-x-1 ${isOverdue ? 'text-red-600' : ''}`}>
          <Calendar className="h-3 w-3" />
          <span className="text-sm">{format(date, "MMM d")}</span>
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
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit Task</DropdownMenuItem>
            <DropdownMenuItem>Mark as Complete</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              Delete Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function TasksPreview() {
  const [filter, setFilter] = React.useState<TaskFilter>("recent");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  
  const currentUserId = "u1"; // Mock current user
  
  const getUserTasks = () => {
    let userTasks = getTasksByAssignee(currentUserId);
    
    switch (filter) {
      case "recent":
        return userTasks
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
      case "due_date":
        return userTasks
          .filter(t => t.dueDate)
          .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
          .slice(0, 5);
      case "urgent":
        return userTasks
          .filter(t => t.priority === "urgent" || t.priority === "high")
          .slice(0, 5);
      case "completed":
        return userTasks
          .filter(t => t.status === "completed")
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, 5);
      default:
        return userTasks.slice(0, 5);
    }
  };

  const data = getUserTasks();

  const table = useReactTable({
    data,
    columns: taskColumns,
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckSquare className="h-5 w-5" />
            <CardTitle>My Tasks</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter tasks..."
              value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("title")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
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
                      colSpan={taskColumns.length}
                      className="h-24 text-center"
                    >
                      No tasks found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="text-muted-foreground flex-1 text-sm">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <Link href="/app/tasks">
            <Button variant="outline">
              View All Your Tasks
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <Link href="/app/tasks/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Quick Create Task
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}