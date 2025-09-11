"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Plus, 
  MoreHorizontal, 
  Mail, 
  UserMinus,
  Crown,
  Search,
  Settings,
  MessageCircle
} from "lucide-react";
import { 
  Project,
  getTeamMemberById,
  team,
  getTasksByProjectId
} from "@/lib/utils/dummy-data";
import { format } from "date-fns";

interface ProjectTeamProps {
  project: Project;
}

export function ProjectTeam({ project }: ProjectTeamProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isAddMemberOpen, setIsAddMemberOpen] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState("");
  const [selectedMember, setSelectedMember] = React.useState("");
  
  // Get project team members
  const projectTeamMembers = (project.assignedTo || [])
    .map(id => getTeamMemberById(id))
    .filter(Boolean);
  
  // Get available team members not in project
  const availableMembers = team.filter(member => 
    !project.assignedTo?.includes(member.id)
  );
  
  // Filter team members
  const filteredTeamMembers = React.useMemo(() => {
    if (!searchTerm) return projectTeamMembers;
    
    return projectTeamMembers.filter(member => 
      member && member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projectTeamMembers, searchTerm]);

  // Get team member stats
  const getTeamMemberStats = (memberId: string) => {
    const tasks = getTasksByProjectId(project.id).filter(task => task.assignedTo === memberId);
    const completedTasks = tasks.filter(task => task.status === "completed");
    
    return {
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      activeTasks: tasks.length - completedTasks.length
    };
  };

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

  const handleAddMember = () => {
    // In a real app, this would make an API call
    console.log("Adding member:", selectedMember, "with role:", selectedRole);
    setIsAddMemberOpen(false);
    setSelectedMember("");
    setSelectedRole("");
  };

  return (
    <div className="space-y-0">
      {/* Team Members List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Team Members</CardTitle>
            <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
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
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex items-center space-x-2 mb-6">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {/* Team Members Grid */}
          {filteredTeamMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTeamMembers.map((member) => {
                if (!member) return null;
                const stats = getTeamMemberStats(member.id);
                
                return (
                  <Card key={member.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={member.avatarUrl} />
                            <AvatarFallback>
                              {member.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium">{member.name}</h4>
                              <Badge variant="outline" className={getRoleBadgeColor(member.role)}>
                                {member.role.replace("_", " ")}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-2">
                              {member.email}
                            </p>
                            
                            <div className="grid grid-cols-3 gap-4 text-xs">
                              <div className="text-center p-1 bg-gray-50 rounded">
                                <div className="font-medium">{stats.totalTasks}</div>
                                <div className="text-muted-foreground">Total</div>
                              </div>
                              <div className="text-center p-1 bg-blue-50 rounded">
                                <div className="font-medium text-blue-600">{stats.activeTasks}</div>
                                <div className="text-muted-foreground">Active</div>
                              </div>
                              <div className="text-center p-1 bg-green-50 rounded">
                                <div className="font-medium text-green-600">{stats.completedTasks}</div>
                                <div className="text-muted-foreground">Done</div>
                              </div>
                            </div>
                            
                            <div className="text-xs text-muted-foreground mt-2">
                              Joined {format(new Date(member.joinedAt), "MMM yyyy")}
                            </div>
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
                              <Settings className="mr-2 h-4 w-4" />
                              Change Role
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <UserMinus className="mr-2 h-4 w-4" />
                              Remove from Project
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No team members found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? "No team members match your search." 
                  : "Add team members to collaborate on this project."}
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsAddMemberOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Member
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}