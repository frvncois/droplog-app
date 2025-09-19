// components/projects/project-settings.tsx

"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { 
  Settings, 
  Save, 
  Trash2, 
  Archive,
  ExternalLink,
  Shield,
  Bell,
  Loader2
} from "lucide-react";

// Import from standardized types and hooks
import { Project, TeamMember } from "@/lib/types";
import { ProjectCardProps } from "@/lib/types/component-props";
import { useProjects, useProject } from "@/hooks/use-projects";
import { useTeam } from "@/hooks/use-team";

// Form data interface
interface ProjectSettingsFormData {
  title: string;
  description: string;
  url: string;
  status: Project['status'];
  priority?: Project['priority'];
  dueDate?: string;
  budget?: number;
  tags?: string[];
  isPublic: boolean;
  allowComments: boolean;
  emailNotifications: boolean;
  slackNotifications: boolean;
  autoArchive: boolean;
}

interface ProjectSettingsProps {
  projectId: string;
  onProjectUpdate?: (project: Project) => void;
  onProjectArchive?: (projectId: string) => void;
  onProjectDelete?: (projectId: string) => void;
}

export function ProjectSettings({ 
  projectId, 
  onProjectUpdate, 
  onProjectArchive, 
  onProjectDelete 
}: ProjectSettingsProps) {
  // Use standardized hooks
  const { project } = useProject(projectId);
  const { team, getTeamMemberById } = useTeam();
  
  // Early return if no project
  if (!project) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="text-destructive text-sm">Project not found</div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Form state - memoized initial data
  const initialFormData = React.useMemo((): ProjectSettingsFormData => ({
    title: project?.title || "",
    description: project?.description || "",
    url: project?.url || "",
    status: project?.status || "active",
    priority: project?.priority || "medium",
    dueDate: project?.dueDate || "",
    budget: project?.budget || 0,
    tags: project?.tags || [],
    isPublic: true,
    allowComments: true,
    emailNotifications: true,
    slackNotifications: false,
    autoArchive: false,
  }), [project]);

  const [formData, setFormData] = React.useState<ProjectSettingsFormData>(initialFormData);
  const [hasChanges, setHasChanges] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  // Update form data when project changes
  React.useEffect(() => {
    if (project) {
      setFormData(initialFormData);
      setHasChanges(false);
    }
  }, [project, initialFormData]);

  // Memoized team member count
  const teamMemberCount = React.useMemo(() => {
    if (!project?.assignedTo) return 0;
    return project.assignedTo.length;
  }, [project?.assignedTo]);

  // Memoized assigned team members
  const assignedMembers = React.useMemo(() => {
    if (!project?.assignedTo) return [];
    return project.assignedTo
      .map(memberId => getTeamMemberById(memberId))
      .filter((member): member is TeamMember => member !== undefined);
  }, [project?.assignedTo, getTeamMemberById]);

  // Optimized input change handler
  const handleInputChange = React.useCallback((field: keyof ProjectSettingsFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  }, []);

  // Save handler with optimistic updates
  const handleSave = React.useCallback(async () => {
    if (!project || !hasChanges) return;

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create updated project object
      const updatedProject: Project = {
        ...project,
        title: formData.title,
        description: formData.description,
        url: formData.url,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate,
        budget: formData.budget,
        tags: formData.tags,
        updatedAt: new Date().toISOString(),
      };

      // Call parent update handler
      onProjectUpdate?.(updatedProject);
      
      toast.success("Project settings saved successfully");
      setHasChanges(false);
    } catch (error) {
      toast.error("Failed to save project settings");
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  }, [project, formData, hasChanges, onProjectUpdate]);

  // Archive handler
  const handleArchiveProject = React.useCallback(async () => {
    if (!project) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onProjectArchive?.(project.id);
      toast.success("Project archived successfully");
    } catch (error) {
      toast.error("Failed to archive project");
      console.error("Archive error:", error);
    }
  }, [project, onProjectArchive]);

  // Delete handler
  const handleDeleteProject = React.useCallback(async () => {
    if (!project) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onProjectDelete?.(project.id);
      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error("Failed to delete project");
      console.error("Delete error:", error);
    }
  }, [project, onProjectDelete]);

  return (
    <div className="space-y-6">
      {/* Basic Settings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Basic Settings</span>
          </CardTitle>
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges || isSaving}
            size="sm"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Name</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter project name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Project Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value as Project['status'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority || "medium"}
                onValueChange={(value) => handleInputChange("priority", value as Project['priority'])}
              >
                <SelectTrigger>
                  <SelectValue />
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
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">Project URL</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => handleInputChange("url", e.target.value)}
                placeholder="https://example.com"
              />
              {formData.url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={formData.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your project goals, requirements, and objectives"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Budget (USD)</Label>
            <Input
              id="budget"
              type="number"
              min="0"
              value={formData.budget || ""}
              onChange={(e) => handleInputChange("budget", parseFloat(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Privacy & Access</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm">Public Project</Label>
              <p className="text-sm text-muted-foreground">
                Make this project visible to all team members
              </p>
            </div>
            <Switch
              checked={formData.isPublic}
              onCheckedChange={(checked) => handleInputChange("isPublic", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm">Allow Comments</Label>
              <p className="text-sm text-muted-foreground">
                Team members can leave comments on tasks and content
              </p>
            </div>
            <Switch
              checked={formData.allowComments}
              onCheckedChange={(checked) => handleInputChange("allowComments", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email updates for project changes
              </p>
            </div>
            <Switch
              checked={formData.emailNotifications}
              onCheckedChange={(checked) => handleInputChange("emailNotifications", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm">Slack Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Send updates to connected Slack channels
              </p>
            </div>
            <Switch
              checked={formData.slackNotifications}
              onCheckedChange={(checked) => handleInputChange("slackNotifications", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Project Information */}
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Project ID</Label>
              <p className="text-sm text-muted-foreground font-mono">{project.id}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Created Date</Label>
              <p className="text-sm text-muted-foreground">
                {new Date(project.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Last Updated</Label>
              <p className="text-sm text-muted-foreground">
                {new Date(project.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Team Members</Label>
              <p className="text-sm text-muted-foreground">
                {teamMemberCount} member{teamMemberCount !== 1 ? 's' : ''}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Tasks</Label>
              <p className="text-sm text-muted-foreground">
                {project.tasksCount} task{project.tasksCount !== 1 ? 's' : ''}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Completion Rate</Label>
              <p className="text-sm text-muted-foreground">
                {project.completedTasks && project.tasksCount 
                  ? `${Math.round((project.completedTasks / project.tasksCount) * 100)}%`
                  : 'N/A'
                }
              </p>
            </div>
          </div>

          {/* Team Members List */}
          {assignedMembers.length > 0 && (
            <div className="mt-6">
              <Label className="text-sm font-medium mb-3 block">Assigned Team Members</Label>
              <div className="space-y-2">
                {assignedMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{member.name}</div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {member.role?.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {member.email}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-orange-200 rounded-lg">
            <div>
              <Label className="text-sm font-medium">Archive Project</Label>
              <p className="text-sm text-muted-foreground">
                Archive this project to hide it from active projects list. Can be restored later.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Archive Project</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to archive "{project.title}"? It will be moved to the archived projects list and hidden from active projects. You can restore it later if needed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleArchiveProject}>
                    Archive Project
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="flex items-center justify-between p-4 border border-destructive rounded-lg">
            <div>
              <Label className="text-sm font-medium text-destructive">Delete Project</Label>
              <p className="text-sm text-muted-foreground">
                Permanently delete this project and all its data. This action cannot be undone.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Project</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{project.title}"? This action cannot be undone and will permanently remove:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>All project tasks and their data</li>
                      <li>All uploaded assets and files</li>
                      <li>All project content and documentation</li>
                      <li>Project settings and configurations</li>
                    </ul>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteProject}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Delete Project
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}