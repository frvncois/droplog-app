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
  ExternalLink,
  CheckSquare,
  Edit,
  Copy,
  Trash2,
  Clock,
  Flag,
  User,
  Target,
  AlertTriangle,
  TrendingUp,
  Calendar,
  MessageCircle,
  ArrowUp,
  ArrowRight,
  Circle
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
  Task,
  getTasksByProjectId,
  getTeamMemberById 
} from "@/lib/utils/dummy-data";
import { format } from "date-fns";
import { formatRelativeTime } from "@/lib/utils";
import { TaskSheetModal } from "@/components/modals/task-sheet-modal";
import { TaskCreateModal } from "@/components/modals/task-create-modal";
import { TaskEditModal } from "@/components/modals/task-edit-modal";

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    completed: "bg-green-100 text-green-800",
    in_progress: "bg-blue-100 text-blue-800",
    todo: "bg-gray-100 text-gray-800"
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

const getPriorityConfig = (priority: string) => {
  switch (priority) {
    case "urgent": 
      return { 
        bg: "bg-red-50 border-red-200"
      };
    case "high": 
      return { 
        bg: "bg-orange-50 border-orange-200"
      };
    case "medium": 
      return { 
        bg: "bg-amber-50 border-amber-200"
      };
    case "low": 
      return { 
        bg: "bg-emerald-50 border-emerald-200"
      };
    default: 
      return { 
        bg: "bg-slate-50 border-slate-200"
      };
  }
};

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "urgent":
      return <Flag className="h-4 w-4 text-red-500" />;
    case "high":
      return <Flag className="h-4 w-4 text-orange-500" />;
    case "medium":
      return <Flag className="h-4 w-4 text-yellow-500" />;
    case "low":
      return <Flag className="h-4 w-4 text-green-500" />;
    default:
      return <Flag className="h-4 w-4 text-gray-500" />;
  }
};

// Status filter options
const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

// Priority filter options
const priorityOptions = [
  { value: "all", label: "All Priority" },
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

// Sort options
const sortOptions = [
  { value: "updatedAt", label: "Last Updated" },
  { value: "createdAt", label: "Created Date" },
  { value: "title", label: "Title A-Z" },
  { value: "priority", label: "Priority" },
  { value: "dueDate", label: "Due Date" },
];

interface ProjectTasksListProps {
  project: Project;
  tasks?: Task[];
}

export function ProjectTasksList({ project, tasks: externalTasks }: ProjectTasksListProps) {
  const originalTasks = React.useMemo(() => getTasksByProjectId(project.id), [project.id]);
  const [data, setData] = React.useState(() => externalTasks || originalTasks);

  // Update data when external tasks change
  React.useEffect(() => {
    if (externalTasks) {
      setData(externalTasks);
    } else {
      setData(originalTasks);
    }
  }, [externalTasks, originalTasks]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  
  // Filter states
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [priorityFilter, setPriorityFilter] = React.useState("all");
  const [assigneeFilter, setAssigneeFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("updatedAt");
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('list');

  // Modal states
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [isTaskSheetOpen, setIsTaskSheetOpen] = React.useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);

  // Function to open task sheet modal
  const openTaskSheet = (task: Task) => {
    setSelectedTask(task);
    setIsTaskSheetOpen(true);
  };

  // Function to open edit modal
  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  // Function to handle task status change
  const handleStatusChange = (task: Task, newStatus: "todo" | "in_progress" | "completed") => {
    const updatedTask: Task = {
      ...task,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };
    
    setData(prev => prev.map(t => t.id === task.id ? updatedTask : t));
    console.log(`Task "${task.title}" status changed to:`, newStatus);
  };

  // Function to handle task creation
  const handleCreateTask = (newTaskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `t${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setData(prev => [newTask, ...prev]);
    console.log('Created new task:', newTask);
  };

  // Function to handle task update
  const handleUpdateTask = (updatedTask: Task) => {
    setData(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    console.log('Updated task:', updatedTask);
  };

  // Function to handle task deletion
  const handleDeleteTask = (task: Task) => {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      setData(prev => prev.filter(t => t.id !== task.id));
      console.log('Deleted task:', task.title);
    }
  };

  // Function to handle task duplication
  const handleDuplicateTask = (task: Task) => {
    const duplicatedTask: Task = {
      ...task,
      id: `t${Date.now()}`,
      title: `${task.title} (Copy)`,
      status: "todo",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setData(prev => [duplicatedTask, ...prev]);
    console.log('Duplicated task:', duplicatedTask);
  };

  // Get unique assignees for filter
  const uniqueAssignees = React.useMemo(() => {
    const assignees = data
      .map(task => task.assignedTo)
      .filter((assignee): assignee is string => assignee !== undefined)
      .filter((assignee, index, array) => array.indexOf(assignee) === index);
    
    return assignees.map(assigneeId => {
      const member = getTeamMemberById(assigneeId);
      return member ? { value: assigneeId, label: member.name } : null;
    }).filter((item): item is { value: string; label: string } => item !== null);
  }, [data]);

  // Task statistics
  const taskStats = React.useMemo(() => {
    const totalTasks = data.length;
    const todoTasks = data.filter(t => t.status === "todo");
    const inProgressTasks = data.filter(t => t.status === "in_progress");
    const completedTasks = data.filter(t => t.status === "completed");
    
    // Priority counts
    const urgentTasks = data.filter(t => t.priority === "urgent");
    const highPriorityTasks = data.filter(t => t.priority === "high");
    
    // Due date analysis
    const today = new Date();
    const overdueTasks = data.filter(t => {
      if (!t.dueDate || t.status === "completed") return false;
      return new Date(t.dueDate) < today;
    });
    
    const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
    
    return {
      totalTasks,
      todoTasks: todoTasks.length,
      inProgressTasks: inProgressTasks.length,
      completedTasks: completedTasks.length,
      urgentTasks: urgentTasks.length + highPriorityTasks.length,
      overdueTasks: overdueTasks.length,
      completionRate
    };
  }, [data]);

  // Filter and sort tasks
  const filteredAndSortedTasks = React.useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    // Apply assignee filter
    if (assigneeFilter !== "all") {
      filtered = filtered.filter(task => task.assignedTo === assigneeFilter);
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
        case "priority":
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
                 (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
        case "dueDate":
          const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          return aDate - bDate;
        default:
          return 0;
      }
    });

    return filtered;
  }, [data, searchTerm, statusFilter, priorityFilter, assigneeFilter, sortBy]);

  const taskColumns: ColumnDef<Task>[] = [
    {
      accessorKey: "priority",
      header: () => '',
      cell: ({ row }) => {
        const priority = row.getValue("priority") as string;
        return (
        <div className={`p-2 rounded-md flex flex-col items-center ${getPriorityConfig(priority).bg}`}>
            {getPriorityIcon(priority)}
          </div>
        );
      },
      size: 50,
    },
    {
      accessorKey: "title",
      header: "Task",
      cell: ({ row }) => {
        const task = row.original;
        
        return (
          <div className="flex flex-col p-2">
            <Button 
              variant="link" 
              className="p-0 h-auto font-medium hover:text-primary transition-colors cursor-pointer text-left justify-start"
              onClick={() => openTaskSheet(task)}
            >
              {task.title}
            </Button>
            <div className="text-xs text-muted-foreground line-clamp-1">
              {task.description || "No description"}
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
            {status.replace("_", " ")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "comments",
      header: "Comments",
      cell: ({ row }) => {
        const task = row.original;
        const commentsCount = task.comments?.length || 0;
        
        // For demo purposes, let's say there's a new comment if the task was updated in the last day
        const hasNewComment = new Date(task.updatedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        return (
          <Button 
            variant="ghost" 
            size="xs"
            className="flex items-center gap-1 hover:bg-muted"
            onClick={() => openTaskSheet(task)}
          >
            <MessageCircle className="h-3 w-3" />
            <p className="text-sx">{commentsCount} replies</p>
            {hasNewComment && commentsCount > 0 && (
              <Badge variant="destructive" className="text-xs px-1">
                new
              </Badge>
            )}
          </Button>
        );
      },
    },
    {
      accessorKey: "assignedTo",
      header: "Assignee",
      cell: ({ row }) => {
        const assignedTo = row.getValue("assignedTo") as string | undefined;
        
        if (!assignedTo) {
          return <div className="text-muted-foreground">Unassigned</div>;
        }
        
        const member = getTeamMemberById(assignedTo);
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
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => {
        const task = row.original;
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        const today = new Date();

        
        return (
          <div className="flex flex-col">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span className="text-xs">
                {dueDate ? format(dueDate, "MMM d, yyyy") : "No due date"}
              </span>
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
        const task = row.original;

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
              <DropdownMenuItem onClick={() => openTaskSheet(task)}>
                <Eye className="h-4 w-4" />
                Task details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openEditModal(task)}>
                <Edit className="h-4 w-4" />
                Edit task
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {task.status !== "completed" && (
                <DropdownMenuItem onClick={() => handleStatusChange(task, "completed")}>
                  <CheckSquare className="h-4 w-4" />
                  Mark completed
                </DropdownMenuItem>
              )}
              {task.status !== "in_progress" && (
                <DropdownMenuItem onClick={() => handleStatusChange(task, "in_progress")}>
                  <ArrowRight className="h-4 w-4" />
                  Mark in progress
                </DropdownMenuItem>
              )}
              {task.status !== "todo" && (
                <DropdownMenuItem onClick={() => handleStatusChange(task, "todo")}>
                  <Circle className="h-4 w-4" />
                  Mark to do
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDuplicateTask(task)}>
                <Copy className="h-4 w-4" />
                Duplicate task
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500" onClick={() => handleDeleteTask(task)}>
                <Trash2 className="h-4 w-4 text-red-500" />
                Delete task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredAndSortedTasks,
    columns: taskColumns,
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
          <h2 className="text-2xl font-medium tracking-tight">Tasks</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Task Progress</CardTitle>
            <div className="p-2 rounded-md bg-secondary">
              <Target className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {taskStats.completedTasks} of {taskStats.totalTasks} completed
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
            <div className="text-2xl font-bold">{taskStats.inProgressTasks}</div>
            <p className="text-xs text-muted-foreground">
              {taskStats.todoTasks} in backlog
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <div className="p-2 rounded-md bg-secondary"> 
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.urgentTasks}</div>
            <p className="text-xs text-muted-foreground">
              Urgent & high priority
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <div className="p-2 rounded-md bg-secondary"> 
              <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.overdueTasks}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
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
            placeholder="Search tasks..."
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

          {/* Priority Filter */}
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[200px]">
              <Flag className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {priorityOptions.map((option) => (
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedTasks.length > 0 ? (
            filteredAndSortedTasks.map((task) => {
              const assignee = task.assignedTo ? getTeamMemberById(task.assignedTo) : null;
              const dueDate = task.dueDate ? new Date(task.dueDate) : null;
              const today = new Date();
              const isOverdue = dueDate && dueDate < today && task.status !== "completed";
              const isDueSoon = dueDate && dueDate <= new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000) && !isOverdue && task.status !== "completed";
              const commentsCount = task.comments?.length || 0;
              const hasNewComment = new Date(task.updatedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000);
              
              return (
                <Card key={task.id} className="group justify-between hover:shadow-sm transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`p-2 rounded-md ${getPriorityConfig(task.priority).bg}`}>
                              {getPriorityIcon(task.priority)}
                            </div>
                            <Button 
                              variant="link" 
                              className="p-0 h-auto text-left justify-start"
                              onClick={() => openTaskSheet(task)}
                            >
                              <CardTitle className="text-lg hover:text-primary transition-colors">
                                {task.title}
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
                              <DropdownMenuItem onClick={() => openTaskSheet(task)}>
                                <Eye className="h-4 w-4" />
                                Task details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditModal(task)}>
                                <Edit className="h-4 w-4" />
                                Edit task
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {task.status !== "completed" && (
                                <DropdownMenuItem onClick={() => handleStatusChange(task, "completed")}>
                                  <CheckSquare className="h-4 w-4" />
                                  Mark completed
                                </DropdownMenuItem>
                              )}
                              {task.status !== "in_progress" && (
                                <DropdownMenuItem onClick={() => handleStatusChange(task, "in_progress")}>
                                  <ArrowRight className="h-4 w-4" />
                                  Mark in progress
                                </DropdownMenuItem>
                              )}
                              {task.status !== "todo" && (
                                <DropdownMenuItem onClick={() => handleStatusChange(task, "todo")}>
                                  <Circle className="h-4 w-4" />
                                  Mark to do
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDuplicateTask(task)}>
                                <Copy className="h-4 w-4" />
                                Duplicate task
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-500" onClick={() => handleDeleteTask(task)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                        {isOverdue && (
                          <Badge variant="destructive" className="text-xs">
                            Overdue
                          </Badge>
                        )}
                        {isDueSoon && !isOverdue && (
                          <Badge variant="outline" className="text-xs text-orange-600 border-orange-600">
                            Due Soon
                          </Badge>
                        )}
                          <Badge className={getStatusColor(task.status)}>
                            {task.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-6 line-clamp-2">
                          {task.description || "No description"}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-col justify-between gap-2">
                      {/* Due Date */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                          Task due on {dueDate ? format(dueDate, "MMM d, yyyy") : "No due date"}
                        </div>
                        </div>
                      <div className="flex items-center">
                          <Button 
                            variant="ghost" 
                            size="xs"
                            className="flex items-center space-x-1 hover:bg-muted p-1 h-auto"
                            onClick={() => openTaskSheet(task)}
                          >
                            <MessageCircle className="h-3 w-3" />
                            <span className="text-xs">{commentsCount}</span>
                            {hasNewComment && commentsCount > 0 && (
                              <Badge variant="destructive" className="text-xs px-1 ml-1">
                                new
                              </Badge>
                            )}
                          </Button>
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
                                    {assignee.name.split(" ").map(n => n[0]).join("")}
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
                              {formatRelativeTime(task.updatedAt)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Open Task Button */}
                      <Button 
                        variant="default"
                        className="w-full" 
                        onClick={() => openTaskSheet(task)}
                      >
                        View Task
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-sm flex items-center border rounded-xl justify-center h-50 bg-card text-muted-foreground">
              <p>No tasks found.</p>
            </div>
          )}
        </div>
      )}
      
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          Showing {table.getRowModel().rows.length} of {filteredAndSortedTasks.length} tasks.
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

      {/* Task Sheet Modal */}
      <TaskSheetModal
        task={selectedTask}
        open={isTaskSheetOpen}
        onOpenChange={setIsTaskSheetOpen}
      />

      {/* Task Create Modal */}
      <TaskCreateModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        projectId={project.id}
        onCreateTask={handleCreateTask}
      />

      {/* Task Edit Modal */}
      <TaskEditModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        task={editingTask}
        onUpdateTask={handleUpdateTask}
      />
    </div>
  );
}