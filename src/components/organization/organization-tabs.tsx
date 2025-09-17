// components/organization/organization-tabs.tsx

"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrganizationOverview } from "./organization-overview";
import { OrganizationTeam } from "./organization-team";
import { OrganizationProjects } from "./organization-projects";
import { OrganizationPlansBilling } from "./organization-plans-billing";
import { OrganizationSettings } from "./organization-settings";
import { 
  LayoutDashboard,
  Users, 
  FolderOpen,
  CreditCard,
  Settings,
  MoreHorizontal,
  Building2,
  Shield,
  Archive
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

interface OrganizationTabsProps {
  organization: Organization;
  currentUserId?: string;
}

export function OrganizationTabs({ organization, currentUserId = "u1" }: OrganizationTabsProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleDropdownAction = (action: string) => {
    switch (action) {
      case "settings":
        setActiveTab("settings");
        break;
      case "team":
        setActiveTab("team");
        break;
      case "archive":
        // Handle archive organization logic here
        console.log("Archive organization:", organization.id);
        break;
      default:
        break;
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="flex w-full gap-10">
        <TabsTrigger value="overview" className="flex items-center space-x-2">
          <LayoutDashboard className="h-4 w-4" />
          <span>Overview</span>
        </TabsTrigger>
        <TabsTrigger value="team" className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span>Team</span>
        </TabsTrigger>
        <TabsTrigger value="projects" className="flex items-center space-x-2">
          <FolderOpen className="h-4 w-4" />
          <span>Projects</span>
        </TabsTrigger>
        <TabsTrigger value="plans-billing" className="flex items-center space-x-2">
          <CreditCard className="h-4 w-4" />
          <span>Plans & Billing</span>
        </TabsTrigger>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="ml-auto">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Organization Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDropdownAction("settings")}>
              <Settings className="h-4 w-4 mr-2" />
              Organization Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDropdownAction("team")}>
              <Users className="h-4 w-4 mr-2" />
              Manage Team
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-orange-600"
              onClick={() => handleDropdownAction("archive")}
            >
              <Archive className="h-4 w-4 mr-2 text-orange-600" />
              Archive Organization
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </TabsList>

      <TabsContent value="overview">
        <OrganizationOverview organization={organization} />
      </TabsContent>

      <TabsContent value="team">
        <OrganizationTeam organization={organization} />
      </TabsContent>

      <TabsContent value="projects">
        <OrganizationProjects organization={organization} />
      </TabsContent>

      <TabsContent value="plans-billing">
        <OrganizationPlansBilling organization={organization} />
      </TabsContent>

      <TabsContent value="settings">
        <OrganizationSettings organization={organization} />
      </TabsContent>
    </Tabs>
  );
}