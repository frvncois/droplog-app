"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  UserPlus, 
  Loader2,
  Mail,
  User,
  Shield,
  Eye
} from "lucide-react";

interface AddTeamMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}

type UserRole = "admin" | "manager" | "designer" | "developer" | "content_writer" | "viewer";

export function AddTeamMemberModal({ open, onOpenChange, trigger }: AddTeamMemberModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "viewer" as UserRole,
    sendInvite: true,
    allowProjectAccess: true,
    allowTaskCreation: false,
    allowTeamManagement: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      role: "viewer",
      sendInvite: true,
      allowProjectAccess: true,
      allowTaskCreation: false,
      allowTeamManagement: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically make an API call to invite the team member
      console.log("Adding team member:", formData);
      
      // Close modal and reset form
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Error adding team member:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "admin":
        return Shield;
      case "manager":
        return User;
      case "designer":
      case "developer":
      case "content_writer":
        return User;
      default:
        return Eye;
    }
  };

  const getRoleColor = (role: UserRole) => {
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

  const getRolePermissions = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "Full access to all features and settings";
      case "manager":
        return "Can manage projects, tasks, and team members";
      case "designer":
        return "Can create and edit design-related content";
      case "developer":
        return "Can manage technical tasks and assets";
      case "content_writer":
        return "Can create and edit content and documentation";
      default:
        return "Can view projects and tasks but cannot edit";
    }
  };

  const roles: { value: UserRole; label: string }[] = [
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Manager" },
    { value: "designer", label: "Designer" },
    { value: "developer", label: "Developer" },
    { value: "content_writer", label: "Content Writer" },
    { value: "viewer", label: "Viewer" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            <UserPlus className="h-5 w-5" />
            Add Team Member
          </DialogTitle>
          <DialogDescription>
            Invite a new team member to collaborate on projects.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-4">
            <Label>Role & Permissions</Label>
            <Select
              value={formData.role}
              onValueChange={(value: UserRole) => handleInputChange("role", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => {
                  const Icon = getRoleIcon(role.value);
                  return (
                    <SelectItem key={role.value} value={role.value}>
                      <div className="flex items-center gap-4">
                        <Icon className="h-4 w-4" />
                        <span>{role.label}</span>
                        <Badge variant="outline" className={getRoleColor(role.value)}>
                          {role.label}
                        </Badge>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm text-muted-foreground">
                <strong className="capitalize">{formData.role.replace("_", " ")}:</strong> {getRolePermissions(formData.role)}
              </p>
            </div>
          </div>

          {/* Custom Permissions */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Custom Permissions</Label>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Project Access</Label>
                  <p className="text-xs text-muted-foreground">
                    Can view and access assigned projects
                  </p>
                </div>
                <Switch
                  checked={formData.allowProjectAccess}
                  onCheckedChange={(checked) => handleInputChange("allowProjectAccess", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Task Creation</Label>
                  <p className="text-xs text-muted-foreground">
                    Can create and manage tasks
                  </p>
                </div>
                <Switch
                  checked={formData.allowTaskCreation}
                  onCheckedChange={(checked) => handleInputChange("allowTaskCreation", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Team Management</Label>
                  <p className="text-xs text-muted-foreground">
                    Can invite and manage other team members
                  </p>
                </div>
                <Switch
                  checked={formData.allowTeamManagement}
                  onCheckedChange={(checked) => handleInputChange("allowTeamManagement", checked)}
                />
              </div>
            </div>
          </div>

          {/* Invitation Settings */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Invitation Settings</Label>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Send Invitation Email</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically send an email invitation to the team member
                </p>
              </div>
              <Switch
                checked={formData.sendInvite}
                onCheckedChange={(checked) => handleInputChange("sendInvite", checked)}
              />
            </div>
          </div>

          {/* Member Preview */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-sm">Team Member Preview</h4>
            <div className="flex items-start gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="" />
                <AvatarFallback>
                  {formData.firstName.charAt(0) || "F"}{formData.lastName.charAt(0) || "L"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-4">
                  <h5 className="font-medium">
                    {formData.firstName || "First"} {formData.lastName || "Last"}
                  </h5>
                  <Badge variant="outline" className={getRoleColor(formData.role)}>
                    {formData.role.replace("_", " ")}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formData.email || "email@example.com"}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.allowProjectAccess && (
                    <Badge variant="secondary" className="text-xs">Project Access</Badge>
                  )}
                  {formData.allowTaskCreation && (
                    <Badge variant="secondary" className="text-xs">Task Creation</Badge>
                  )}
                  {formData.allowTeamManagement && (
                    <Badge variant="secondary" className="text-xs">Team Management</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Invitation Message Preview */}
          {formData.sendInvite && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-sm text-blue-900">Email Invitation Preview</h4>
              <div className="text-sm text-blue-800">
                <p><strong>Subject:</strong> You've been invited to join Droplog</p>
                <p className="mt-2">
                  <strong>Message:</strong> Hi {formData.firstName || "[First Name]"}, 
                  you've been invited to join our team on Droplog as a {formData.role.replace("_", " ")}. 
                  Click the link below to accept your invitation and get started.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {formData.sendInvite ? "Send Invitation" : "Add Team Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}