// components/modals/team-sheet-modal.tsx

"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  Target,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Star,
  Award,
  Activity,
  Crown,
  Shield,
  Settings,
  Edit,
  User,
  MessageCircle,
  UserMinus,
  Save
} from "lucide-react";
import { 
  Project,
  TeamMember,
  Task,
  getTasksByProjectId 
} from "@/lib/utils/dummy-data";
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

const getRoleIcon = (role: string) => {
  switch (role) {
    case "admin":
      return <Crown className="h-5 w-5 text-red-500" />;
    case "manager":
      return <Shield className="h-5 w-5 text-purple-500" />;
    case "designer":
      return <Star className="h-5 w-5 text-blue-500" />;
    case "developer":
      return <Settings className="h-5 w-5 text-green-500" />;
    case "content_writer":
      return <Edit className="h-5 w-5 text-yellow-500" />;
    default:
      return <User className="h-5 w-5 text-gray-500" />;
  }
};

interface TeamSheetModalProps {
  member: ProjectTeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
}

export function TeamSheetModal({ member, open, onOpenChange, project }: TeamSheetModalProps) {
  const [isEditingRole, setIsEditingRole] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState("");

  // Get member's tasks for this project
  const memberTasks = React.useMemo(() => {
    if (!member) return [];
    return getTasksByProjectId(project.id).filter(task => task.assignedTo === member.id);
  }, [member, project.id]);

  // Initialize role selection when member changes
  React.useEffect(() => {
    if (member) {
      setSelectedRole(member.role);
    }
  }, [member]);

  if (!member) return null;

  const completionRate = member.totalTasks > 0 
    ? Math.round((member.completedTasks / member.totalTasks) * 100) 
    : 0;

  // Recent tasks (last 5)
  const recentTasks = memberTasks
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const handleSaveRole = () => {
    console.log(`Changing ${member.name}'s role from ${member.role} to ${selectedRole}`);
    setIsEditingRole(false);
    // In a real app, this would make an API call
  };

  const handleRemoveFromProject = () => {
    if (confirm(`Are you sure you want to remove ${member.name} from this project?`)) {
      console.log(`Removing ${member.name} from project`);
      onOpenChange(false);
      // In a real app, this would make an API call
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl overflow-hidden">
        <ScrollArea className="h-full pr-6">
          <SheetHeader className="space-y-4">
            {/* Member Header */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={member.avatarUrl} />
                <AvatarFallback className="text-xl">
                  {member.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <SheetTitle className="text-2xl">{member.name}</SheetTitle>
                <SheetDescription className="text-base">
                  {member.email || "No email provided"}
                </SheetDescription>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(member.role)}
                    <Badge className={getRoleBadgeColor(member.role)}>
                      {member.role.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </SheetHeader>

          <div className="space-y-6 mt-6">
            {/* Role Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Role Management
                  </CardTitle>
                  {!isEditingRole ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditingRole(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Role
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setIsEditingRole(false);
                          setSelectedRole(member.role);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm"
                        onClick={handleSaveRole}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isEditingRole ? (
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="content_writer">Content Writer</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getRoleIcon(member.role)}
                      <div>
                        <div className="font-medium">{member.role.replace("_", " ")}</div>
                        <div className="text-sm text-muted-foreground">
                          Current role in {project.title}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{member.totalTasks}</div>
                    <div className="text-sm text-muted-foreground">Total Tasks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{member.completedTasks}</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{member.activeTasks}</div>
                    <div className="text-sm text-muted-foreground">In Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{completionRate}%</div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Task Completion Progress</span>
                    <span className="font-medium">{completionRate}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {member.completedTasks} of {member.totalTasks} tasks completed
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{member.email || "No email provided"}</span>
                </div>
                {member.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{member.phone}</span>
                  </div>
                )}
                {member.company && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{member.company}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Joined {member.joinedAt ? format(new Date(member.joinedAt), "MMMM d, yyyy") : "Unknown date"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Recent Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentTasks.length > 0 ? (
                  <div className="space-y-3">
                    {recentTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{task.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Updated {formatRelativeTime(task.updatedAt)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={task.status === "completed" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {task.status.replace("_", " ")}
                          </Badge>
                          {task.priority && (
                            <Badge variant="outline" className="text-xs">
                              {task.priority}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full" size="sm">
                      View All Tasks
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No tasks assigned yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Target className="h-4 w-4 mr-2" />
                  Assign New Task
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Start Discussion
                </Button>
                <Separator />
                <Button 
                  variant="destructive" 
                  className="w-full justify-start"
                  onClick={handleRemoveFromProject}
                >
                  <UserMinus className="h-4 w-4 mr-2" />
                  Remove from Project
                </Button>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}