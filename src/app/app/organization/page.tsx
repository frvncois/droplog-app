'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  FolderOpen, 
  Bell, 
  CreditCard, 
  Settings, 
  Activity,
  TrendingUp,
  Calendar,
  Shield,
  Building2,
  Mail,
  Plus
} from 'lucide-react'
import { OrganizationTeam } from '@/components/organization/organization-team'
import { OrganizationProjects } from '@/components/organization/organization-projects'
import { OrganizationNotifications } from '@/components/organization/organization-notifications'
import { OrganizationPlan } from '@/components/organization/organization-plan'
import { OrganizationSettings } from '@/components/organization/organization-settings'
import { OrganizationActivity } from '@/components/organization/organization-activity'

// Dummy data for organization overview
const organizationStats = {
  totalMembers: 12,
  activeProjects: 8,
  completedProjects: 24,
  pendingTasks: 47,
  storageUsed: '2.4 GB',
  storageLimit: '10 GB',
  plan: 'Professional',
  billingCycle: 'Monthly',
  nextBilling: '2025-10-12'
}

const recentActivity = [
  {
    id: '1',
    type: 'user_joined' as const,
    title: 'New team member joined',
    description: 'Alice Johnson joined the organization',
    timestamp: '2025-09-12T06:00:00Z',
    user: {
      id: 'u1',
      name: 'Alice Johnson',
      avatarUrl: '/avatars/alice.png'
    }
  },
  {
    id: '2',
    type: 'project_completed' as const,
    title: 'Project completed',
    description: 'Marketing Website project completed',
    timestamp: '2025-09-12T03:00:00Z',
    user: {
      id: 'u2',
      name: 'Bob Smith',
      avatarUrl: '/avatars/bob.png'
    },
    metadata: {
      projectId: 'p1',
      projectName: 'Marketing Website'
    }
  },
  {
    id: '3',
    type: 'plan_upgraded' as const,
    title: 'Plan upgraded',
    description: 'Organization plan upgraded to Professional',
    timestamp: '2025-09-11T12:00:00Z',
    user: {
      id: 'system',
      name: 'System'
    },
    metadata: {
      oldValue: 'Starter',
      newValue: 'Professional'
    }
  },
  {
    id: '4',
    type: 'project_created' as const,
    title: 'New project created',
    description: 'Design Team project created',
    timestamp: '2025-09-10T14:00:00Z',
    user: {
      id: 'u3',
      name: 'Carol Davis',
      avatarUrl: '/avatars/carol.png'
    },
    metadata: {
      projectId: 'p5',
      projectName: 'Design Team'
    }
  }
]

export default function OrganizationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Get tab from URL params, default to 'overview'
  const urlTab = searchParams.get('tab') || 'overview'
  const [activeTab, setActiveTab] = useState(urlTab)

  // Update activeTab when URL changes
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') || 'overview'
    setActiveTab(tabFromUrl)
  }, [searchParams])

  // Update URL when tab changes
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab)
    // Update URL without adding to history
    const newUrl = newTab === 'overview' ? '/organization' : `/organization?tab=${newTab}`
    router.replace(newUrl)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Organization</h1>
          <p className="text-muted-foreground mt-1">
            Manage your team, projects, and organization settings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Invite Members
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        </div>
      </div>

      {/* Organization Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Team Members</p>
                <p className="text-2xl font-bold">{organizationStats.totalMembers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold">{organizationStats.activeProjects}</p>
              </div>
              <FolderOpen className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Tasks</p>
                <p className="text-2xl font-bold">{organizationStats.pendingTasks}</p>
              </div>
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Storage Used</p>
                <p className="text-2xl font-bold">{organizationStats.storageUsed}</p>
                <p className="text-xs text-muted-foreground">of {organizationStats.storageLimit}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Team
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="plan" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Plan & Billing
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <OrganizationActivity activities={recentActivity} />
            </div>

            {/* Organization Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Plan Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Current Plan</span>
                    <Badge variant="default">{organizationStats.plan}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Billing Cycle</span>
                    <span className="text-sm text-muted-foreground">{organizationStats.billingCycle}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Next Billing</span>
                    <span className="text-sm text-muted-foreground">{organizationStats.nextBilling}</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Manage Billing
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completed Projects</span>
                    <Badge variant="secondary">{organizationStats.completedProjects}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Storage Usage</span>
                    <div className="text-right">
                      <div className="text-sm">{organizationStats.storageUsed} / {organizationStats.storageLimit}</div>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '24%'}}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="team">
          <OrganizationTeam />
        </TabsContent>

        <TabsContent value="projects">
          <OrganizationProjects />
        </TabsContent>

        <TabsContent value="notifications">
          <OrganizationNotifications />
        </TabsContent>

        <TabsContent value="plan">
          <OrganizationPlan />
        </TabsContent>

        <TabsContent value="settings">
          <OrganizationSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}