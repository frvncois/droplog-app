// components/modals/team-add-modal.tsx

"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  UserPlus,
  Crown,
  Shield,
  Settings,
  Edit,
  User,
  Star,
  Mail,
  Calendar
} from "lucide-react";

// Import from centralized types
import type { TeamMember } from "@/lib/types";
import { format } from "date-fns";

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

const roleOptions = [
  { value: "admin", label: "Admin", description: "Full project access and management" },
  { value: "manager", label: "Manager", description: "Team and task management" },
  { value: "designer", label: "Designer", description: "Design and creative work" },
  { value: "developer", label: "Developer", description: "Development and technical tasks" },
  { value: "content_writer", label: "Content Writer", description: "Content creation and writing" },
];

interface TeamAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableMembers: TeamMember[];
  onAddMember: (memberData: { memberId: string; role: string }) => void;
}

export function TeamAddModal({ 
  open, 
  onOpenChange, 
  availableMembers, 
  onAddMember 
}: TeamAddModalProps) {
  const [selectedMember, setSelectedMember] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");

  // Filter available members based on search term
  const filteredMembers = React.useMemo(() => {
    if (!searchTerm) return availableMembers;
    return availableMembers.filter((member: TeamMember) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableMembers, searchTerm]);

  // Get selected member data
  const selectedMemberData = React.useMemo(() => {
    return availableMembers.find((member: TeamMember) => member.id === selectedMember);
  }, [availableMembers, selectedMember]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMember || !selectedRole) {
      return;
    }

    onAddMember({
      memberId: selectedMember,
      role: selectedRole,
    });

    // Reset form
    setSelectedMember("");
    setSelectedRole("");
    setSearchTerm("");
    onOpenChange(false);
  };

  const handleCancel = () => {
    setSelectedMember("");
    setSelectedRole("");
    setSearchTerm("");
    onOpenChange(false);
  };

  const isFormValid = selectedMember && selectedRole;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add Team Member
          </DialogTitle>
          <DialogDescription>
            Select a team member and assign their role for this project.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Member Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Select Member</Label>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search available members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Available Members List */}
            <ScrollArea className="h-64 border rounded-lg">
              {filteredMembers.length > 0 ? (
                <div className="p-2 space-y-2">
                  {filteredMembers.map((member: TeamMember) => (
                    <Card 
                      key={member.id} 
                      className={`cursor-pointer transition-all ${
                        selectedMember === member.id 
                          ? 'ring-2 ring-primary' 
                          : 'hover:shadow-sm'
                      }`}
                      onClick={() => setSelectedMember(member.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.avatarUrl} />
                            <AvatarFallback>
                              {member.name.split(" ").map((n: string) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              <Mail className="h-3 w-3" />
                              {member.email || "No email"}
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={getRoleBadgeColor(member.role)}>
                              {member.role.replace("_", " ")}
                            </Badge>
                            {member.joinedAt && (
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(member.joinedAt), "MMM yyyy")}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  <div className="text-center">
                    <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No available members found</p>
                    {searchTerm && (
                      <p className="text-xs mt-1">Try adjusting your search</p>
                    )}
                  </div>
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Selected Member Preview */}
          {selectedMemberData && (
            <div className="space-y-3">
              <Label className="text-base font-medium">Selected Member</Label>
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedMemberData.avatarUrl} />
                      <AvatarFallback className="text-lg">
                        {selectedMemberData.name.split(" ").map((n: string) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{selectedMemberData.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedMemberData.email || "No email"}
                      </div>
                      <div className="mt-1">
                        <Badge className={getRoleBadgeColor(selectedMemberData.role)}>
                          Current: {selectedMemberData.role.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Role Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Assign Project Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role for this project" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    <div className="flex items-center space-x-3">
                      {getRoleIcon(role.value)}
                      <div>
                        <div className="font-medium">{role.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {role.description}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Role Preview */}
            {selectedRole && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2">
                    {getRoleIcon(selectedRole)}
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {roleOptions.find(r => r.value === selectedRole)?.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {roleOptions.find(r => r.value === selectedRole)?.description}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!isFormValid}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Add Member
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}