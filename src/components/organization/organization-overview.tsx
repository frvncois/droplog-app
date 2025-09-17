// components/organization/organization-overview.tsx

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  FolderOpen, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Calendar,
  Activity,
  Building2,
  Crown,
  ArrowRight
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

interface OrganizationOverviewProps {
  organization: Organization;
}

// Dummy stats data
const organizationStats = {
  totalMembers: 12,
  activeProjects: 8,
  completedProjects: 24,
  pendingTasks: 47,
  storageUsed: 2.4,
  storageLimit: 10,
  planUsage: {
    projects: { used: 8, limit: 25 },
    members: { used: 12, limit: 50 },
    storage: { used: 2.4, limit: 10 }
  }
};

const recentActivity = [
  {
    id: '1',
    type: 'user_joined',
    title: 'Alice Johnson joined the team',
    timestamp: '2 hours ago',
    avatarUrl: '/avatars/alice.png'
  },
  {
    id: '2',
    type: 'project_completed',
    title: 'Marketing Website project completed',
    timestamp: '5 hours ago',
    avatarUrl: '/avatars/bob.png'
  },
  {
    id: '3',
    type: 'plan_upgraded',
    title: 'Organization plan upgraded to Professional',
    timestamp: '1 day ago',
    avatarUrl: null
  },
  {
    id: '4',
    type: 'task_assigned',
    title: '12 new tasks assigned across projects',
    timestamp: '2 days ago',
    avatarUrl: '/avatars/carol.png'
  }
];

const topProjects = [
  {
    id: 'p1',
    title: 'Marketing Website Redesign',
    status: 'active',
    progress: 75,
    tasksTotal: 24,
    tasksCompleted: 18,
    teamMembers: ['u1', 'u2', 'u3']
  },
  {
    id: 'p2',
    title: 'Mobile App Development',
    status: 'active',
    progress: 45,
    tasksTotal: 32,
    tasksCompleted: 14,
    teamMembers: ['u2', 'u4', 'u5', 'u6']
  },
  {
    id: 'p3',
    title: 'Data Analytics Platform',
    status: 'active',
    progress: 30,
    tasksTotal: 28,
    tasksCompleted: 8,
    teamMembers: ['u3', 'u5', 'u7']
  }
];

export function OrganizationOverview({ organization }: OrganizationOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizationStats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizationStats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              {organizationStats.completedProjects} completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizationStats.pendingTasks}</div>
            <p className="text-xs text-muted-foreground">
              Across all projects
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizationStats.storageUsed} GB</div>
            <p className="text-xs text-muted-foreground">
              of {organizationStats.storageLimit} GB limit
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Plan Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Plan Usage
            </CardTitle>
            <CardDescription>
              Current usage across your {organization.plan} plan limits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span>Projects</span>
                <span className="text-muted-foreground">
                  {organizationStats.planUsage.projects.used}/{organizationStats.planUsage.projects.limit}
                </span>
              </div>
              <Progress 
                value={(organizationStats.planUsage.projects.used / organizationStats.planUsage.projects.limit) * 100} 
                className="mt-2"
              />
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span>Team Members</span>
                <span className="text-muted-foreground">
                  {organizationStats.planUsage.members.used}/{organizationStats.planUsage.members.limit}
                </span>
              </div>
              <Progress 
                value={(organizationStats.planUsage.members.used / organizationStats.planUsage.members.limit) * 100} 
                className="mt-2"
              />
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span>Storage</span>
                <span className="text-muted-foreground">
                  {organizationStats.planUsage.storage.used} GB/{organizationStats.planUsage.storage.limit} GB
                </span>
              </div>
              <Progress 
                value={(organizationStats.planUsage.storage.used / organizationStats.planUsage.storage.limit) * 100} 
                className="mt-2"
              />
            </div>
            <Button variant="outline" className="w-full">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade Plan
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest updates across your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.avatarUrl || ''} />
                    <AvatarFallback>
                      {activity.type === 'plan_upgraded' ? <Building2 className="h-4 w-4" /> : 
                       activity.title.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4">
              View All Activity
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Top Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Active Projects
          </CardTitle>
          <CardDescription>
            Your most active projects and their current progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{project.title}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{project.tasksCompleted}/{project.tasksTotal} tasks</span>
                    <div className="flex -space-x-2">
                      {project.teamMembers.slice(0, 3).map((memberId, index) => (
                        <Avatar key={memberId} className="h-6 w-6 border-2 border-background">
                          <AvatarFallback className="text-xs">
                            {String.fromCharCode(65 + index)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {project.teamMembers.length > 3 && (
                        <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">
                            +{project.teamMembers.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-24">
                  <div className="text-right text-sm font-medium mb-1">
                    {project.progress}%
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-4">
            View All Projects
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}