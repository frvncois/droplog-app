"use client";

import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, MoreHorizontal, Eye, CheckSquare, Trash2, Edit, Copy, Plus, ExternalLink } from "lucide-react";
import { Task, tasks, getProjectById, getTeamMemberById } from "@/lib/utils/dummy-data";
import { format } from "date-fns";
import { TaskSheetModal } from "@/components/modals/task-sheet-modal";

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed": return "bg-green-100 text-green-800";
    case "in_progress": return "bg-blue-100 text-blue-800";
    case "todo": return "bg-gray-100 text-gray-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent": return "bg-red-500 text-white";
    case "high": return "bg-orange-500 text-white";
    case "medium": return "bg-yellow-500 text-white";
    case "low": return "bg-green-500 text-white";
    default: return "bg-gray-500 text-white";
  }
};

export function TasksDataTable() {
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [priorityFilter, setPriorityFilter] = React.useState("all");
  const [projectFilter, setProjectFilter] = React.useState("all");

  // Get all tasks for current user (this would normally filter by current user ID)
  const allTasks = tasks;

  // Get unique projects for filter dropdown
  const uniqueProjects = React.useMemo(() => {
    const projectIds = [...new Set(allTasks.map(task => task.projectId))];
    return projectIds.map(id => getProjectById(id)).filter((project): project is NonNullable<typeof project> => project !== null && project !== undefined);
  }, [allTasks]);

  const filteredTasks = allTasks.filter((task) => {
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    const matchesProject = projectFilter === "all" || task.projectId === projectFilter;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPriority && matchesProject && matchesSearch;
  });

  const openTaskSheet = (task: Task) => {
    setSelectedTask(task);
    setIsSheetOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4">
          <Input
            placeholder="Search tasks..."
            className="max-w-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {uniqueProjects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => console.log('Quick add task clicked')}>
            <Plus className="h-4 w-4 mr-2" />
            Quick add task
          </Button>
          <Button onClick={() => console.log('Open in editor clicked')}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in editor
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing {filteredTasks.length} of {allTasks.length} tasks
        </div>
      </div>

      {/* Tasks Table */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => {
                const dueDate = task.dueDate ? new Date(task.dueDate) : null;
                const today = new Date();
                const isOverdue = dueDate && dueDate < today && task.status !== "completed";
                const isDueSoon = dueDate && dueDate <= new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000) && !isOverdue && task.status !== "completed";
                const project = getProjectById(task.projectId);
                const assignee = task.assignedTo ? getTeamMemberById(task.assignedTo) : null;

                return (
                  <TableRow key={task.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <Button variant="link" className="p-0 justify-start font-medium" onClick={() => openTaskSheet(task)}>
                          {task.title}
                        </Button>
                        {task.description && (
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {task.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {project ? (
                        <div className="flex flex-col space-y-1">
                          <span className="text-sm font-medium">{project.title}</span>
                          <Badge variant="outline" className="w-fit text-xs">
                            {project.status}
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Unknown Project</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {assignee ? (
                        <div className="flex items-center space-x-2">
                          <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                            {assignee.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{assignee.name}</span>
                            <span className="text-xs text-muted-foreground">{assignee.role}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell className={isOverdue ? "text-red-600" : isDueSoon ? "text-orange-600" : ""}>
                      {dueDate ? (
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span className="text-sm">{format(dueDate, "MMM d, yyyy")}</span>
                          </div>
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
                      ) : (
                        "No due date"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openTaskSheet(task)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => console.log('Open in editor:', task.title)}>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openTaskSheet(task)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View in editor
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => console.log('Edit task:', task.title)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit task
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => console.log('Mark as completed:', task.title)}>
                              <CheckSquare className="mr-2 h-4 w-4" />
                              {task.status === "completed" ? "Mark as incomplete" : "Mark as completed"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => console.log('Duplicate task:', task.title)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate task
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600" 
                              onClick={() => console.log('Delete task:', task.title)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete task
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
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

      {/* Task Sheet Modal */}
      <TaskSheetModal
        task={selectedTask}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </div>
  );
}