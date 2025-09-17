// components/organization/organization-projects.tsx

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Eye,
  Edit,
  Archive,
  Trash2,
  Star,
  TrendingUp,
  ExternalLink,
  Copy,
  Settings
} from "lucide-react";
import Link from "next/link";

interface Organization {
  id: string;
  name: string;
  description?: string;
  plan: string;
  members: number;
  projects: number;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  status: "active" | "completed" | "archived" | "on_hold";
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  url?: string;
  tasksCount: number;
  completedTasks: number;
  teamMembers: string[];
  owner: string;
  budget?: number;
  spent?: number;
  tags: string[];
  starred?: boolean;
}

interface OrganizationProjectsProps {
  organization: Organization;
}

// Dummy projects data
const projects: Project[] = [
  {
    id: "p1",
    title: "Marketing Website Redesign",
    description: "Complete overhaul of the company marketing website with modern design and improved UX",
    status: "active",
    priority: "high",
    createdAt: "2025-08-01T10:00:00Z",
    updatedAt: "2025-09-10T15:30:00Z",
    dueDate: "2025-10-15T23:59:59Z",
    url: "https://marketing.company.com",
    tasksCount: 24,
    completedTasks: 18,
    teamMembers: ["u1", "u6"],
    owner: "u1",
    budget: 25000,
    spent: 25000,
    tags: ["branding", "design", "guidelines"],
    starred: false
  },
  {
    id: "p5",
    title: "Customer Support Portal",
    description: "Self-service portal for customer support and documentation",
    status: "on_hold",
    priority: "low",
    createdAt: "2025-04-20T14:00:00Z",
    updatedAt: "2025-07-15T10:20:00Z",
    dueDate: "2025-11-15T23:59:59Z",
    tasksCount: 28,
    completedTasks: 5,
    teamMembers: ["u4", "u7"],
    owner: "u4",
    budget: 40000,
    spent: 8000,
    tags: ["support", "portal", "documentation"]
  },
  {
    id: "p6",
    title: "E-commerce Integration",
    description: "Integration with third-party e-commerce platforms",
    status: "archived",
    priority: "medium",
    createdAt: "2025-03-01T09:00:00Z",
    updatedAt: "2025-06-30T17:00:00Z",
    tasksCount: 20,
    completedTasks: 20,
    teamMembers: ["u2", "u3", "u5"],
    owner: "u2",
    budget: 60000,
    spent: 55000,
    tags: ["ecommerce", "integration", "api"]
  }
];

// Mock team members for display
const teamMembers = {
  "u1": { name: "Alice Johnson", avatarUrl: "/avatars/alice.png" },
  "u2": { name: "Bob Smith", avatarUrl: "/avatars/bob.png" },
  "u3": { name: "Carol Davis", avatarUrl: "/avatars/carol.png" },
  "u4": { name: "David Wilson", avatarUrl: "/avatars/david.png" },
  "u5": { name: "Emma Brown", avatarUrl: "/avatars/emma.png" },
  "u6": { name: "Frank Miller", avatarUrl: "/avatars/frank.png" },
  "u7": { name: "Grace Lee", avatarUrl: "/avatars/grace.png" }
};

export function OrganizationProjects({ organization }: OrganizationProjectsProps) {
  const [projectList, setProjectList] = useState<Project[]>(projects);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [ownerFilter, setOwnerFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Filter projects
  const filteredProjects = projectList.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || project.priority === priorityFilter;
    const matchesOwner = ownerFilter === "all" || project.owner === ownerFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesOwner;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "completed": return "secondary";
      case "on_hold": return "outline";
      case "archived": return "destructive";
      default: return "outline";
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "urgent": return "destructive";
      case "high": return "default";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const calculateProgress = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const handleStarProject = (projectId: string) => {
    setProjectList(prev => prev.map(project => 
      project.id === projectId ? { ...project, starred: !project.starred } : project
    ));
  };

  const handleArchiveProject = (projectId: string) => {
    setProjectList(prev => prev.map(project => 
      project.id === projectId ? { ...project, status: "archived" } : project
    ));
  };

  const handleDeleteProject = (projectId: string) => {
    setProjectList(prev => prev.filter(project => project.id !== projectId));
  };

  const projectStats = {
    total: projectList.length,
    active: projectList.filter(p => p.status === "active").length,
    completed: projectList.filter(p => p.status === "completed").length,
    onHold: projectList.filter(p => p.status === "on_hold").length,
    archived: projectList.filter(p => p.status === "archived").length,
    totalBudget: projectList.reduce((acc, p) => acc + (p.budget || 0), 0),
    totalSpent: projectList.reduce((acc, p) => acc + (p.spent || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Project Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {projectStats.active} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectStats.completed}</div>
            <p className="text-xs text-muted-foreground">
              {projectStats.onHold} on hold
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(projectStats.totalSpent / 1000).toFixed(0)}k
            </div>
            <p className="text-xs text-muted-foreground">
              of ${(projectStats.totalBudget / 1000).toFixed(0)}k total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Progress</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(projectList.reduce((acc, p) => acc + calculateProgress(p.completedTasks, p.tasksCount), 0) / projectList.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Across all projects
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Projects Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Organization Projects
              </CardTitle>
              <CardDescription>
                Manage all projects across your organization
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>
                    Start a new project for your organization
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input id="project-name" placeholder="Enter project name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-description">Description</Label>
                    <Textarea 
                      id="project-description" 
                      placeholder="Describe the project goals and scope..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="project-priority">Priority</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-budget">Budget</Label>
                      <Input id="project-budget" type="number" placeholder="0" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-due-date">Due Date</Label>
                    <Input id="project-due-date" type="date" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCreateDialogOpen(false)}>
                    Create Project
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters and Search */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("table")}
            >
              Table
            </Button>
          </div>

          {/* Projects Display */}
          {viewMode === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="relative">
                  {project.starred && (
                    <div className="absolute top-3 right-3">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusBadgeVariant(project.status) as any}>
                            {project.status.replace('_', ' ')}
                          </Badge>
                          <Badge variant={getPriorityBadgeVariant(project.priority) as any}>
                            {project.priority}
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/app/projects/${project.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Project
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Project
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStarProject(project.id)}>
                            <Star className="mr-2 h-4 w-4" />
                            {project.starred ? 'Unstar' : 'Star'} Project
                          </DropdownMenuItem>
                          {project.url && (
                            <DropdownMenuItem>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Open URL
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleArchiveProject(project.id)}>
                            <Archive className="mr-2 h-4 w-4" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{calculateProgress(project.completedTasks, project.tasksCount)}%</span>
                        </div>
                        <Progress value={calculateProgress(project.completedTasks, project.tasksCount)} />
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {project.completedTasks}/{project.tasksCount} tasks
                        </span>
                        <span className="text-muted-foreground">
                          Due {formatDate(project.dueDate || project.updatedAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {project.teamMembers.slice(0, 3).map((memberId, index) => {
                            const member = teamMembers[memberId as keyof typeof teamMembers];
                            return (
                              <Avatar key={memberId} className="h-6 w-6 border-2 border-background">
                                <AvatarImage src={member?.avatarUrl} />
                                <AvatarFallback className="text-xs">
                                  {member?.name.split(' ').map(n => n[0]).join('') || 'U'}
                                </AvatarFallback>
                              </Avatar>
                            );
                          })}
                          {project.teamMembers.length > 3 && (
                            <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">
                                +{project.teamMembers.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {project.budget && (
                          <div className="text-xs text-muted-foreground">
                            ${(project.spent || 0).toLocaleString()}/${project.budget.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Table View would go here - simplified for brevity */
            <div className="text-center py-8 text-muted-foreground">
              Table view implementation
            </div>
          )}

          {filteredProjects.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No projects found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}