// components/organization/organization-header.tsx

"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  MoreHorizontal, 
  Settings, 
  Plus,
  Users,
  Building2,
  Crown,
  CreditCard,
  UserPlus,
  FolderPlus
} from "lucide-react";

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

interface OrganizationHeaderProps {
  organization: Organization;
}

export function OrganizationHeader({ organization }: OrganizationHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-lg">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-semibold tracking-tight">{organization.name}</h1>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Crown className="h-3 w-3" />
                {organization.plan}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              {organization.description || "No description available for this organization."}
            </p>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Quick add
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Add to Organization</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite member
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FolderPlus className="mr-2 h-4 w-4" />
                Create project
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                Create team
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="default" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Manage
          </Button>
        </div>
      </div>
    </div>
  );
}