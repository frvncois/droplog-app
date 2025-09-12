'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Activity, 
  Users, 
  FolderOpen, 
  CheckCircle, 
  MessageSquare, 
  UserPlus, 
  Settings, 
  Upload, 
  Download,
  Clock,
  Search,
  Filter,
  Calendar,
  TrendingUp
} from 'lucide-react'

// Activity interfaces
interface ActivityItem {
  id: string
  type: 'user_joined' | 'user_left' | 'project_created' | 'project_completed' | 'project_updated' | 
        'task_created' | 'task_completed' | 'task_assigned' | 'file_uploaded' | 'comment_added' | 
        'settings_changed' | 'plan_upgraded' | 'integration_added'
  title: string
  description: string
  timestamp: string
  user: {
    id: string
    name: string
    avatarUrl?: string
  }
  metadata?: {
    projectId?: string
    projectName?: string
    taskId?: string
    taskName?: string
    fileName?: string
    oldValue?: string
    newValue?: string
  }
}

// Dummy activity data
const activities: ActivityItem[] = [
  {
    id: 'act_001',
    type: 'user_joined',
    title: 'New team member joined',
    description: 'David Wilson joined the organization',
    timestamp: '2025-09-12T08:30:00Z',
    user: {
      id: 'u4',
      name: 'David Wilson',
      avatarUrl: '/avatars/david.png'
    }
  },
  {
    id: 'act_002',
    type: 'project_completed',
    title: 'Project completed',
    description: 'E-commerce Integration project was completed',
    timestamp: '2025-09-12T07:15:00Z',
    user: {
      id: 'u1',
      name: 'Alice Johnson',
      avatarUrl: '/avatars/alice.png'
    },
    metadata: {
      projectId: 'p4',
      projectName: 'E-commerce Integration'
    }
  },
  {
    id: 'act_003',
    type: 'task_assigned',
    title: 'Task assigned',
    description: 'Update homepage header was assigned to Bob Smith',
    timestamp: '2025-09-12T06:45:00Z',
    user: {
      id: 'u1',
      name: 'Alice Johnson',
      avatarUrl: '/avatars/alice.png'
    },
    metadata: {
      taskId: 't1',
      taskName: 'Update homepage header',
      projectId: 'p1',
      projectName: 'Marketing Website Redesign'
    }
  },
  {
    id: 'act_004',
    type: 'file_uploaded',
    title: 'File uploaded',
    description: 'New design mockups uploaded to Marketing Website project',
    timestamp: '2025-09-11T16:20:00Z',
    user: {
      id: 'u3',
      name: 'Carol Davis',
      avatarUrl: '/avatars/carol.png'
    },
    metadata: {
      fileName: 'homepage-mockups-v2.figma',
      projectId: 'p1',
      projectName: 'Marketing Website Redesign'
    }
  },
  {
    id: 'act_005',
    type: 'project_created',
    title: 'New project created',
    description: 'Data Analytics Platform project was created',
    timestamp: '2025-09-11T14:30:00Z',
    user: {
      id: 'u2',
      name: 'Bob Smith',
      avatarUrl: '/avatars/bob.png'
    },
    metadata: {
      projectId: 'p3',
      projectName: 'Data Analytics Platform'
    }
  },
  {
    id: 'act_006',
    type: 'plan_upgraded',
    title: 'Plan upgraded',
    description: 'Organization plan upgraded from Starter to Professional',
    timestamp: '2025-09-10T12:00:00Z',
    user: {
      id: 'u1',
      name: 'Alice Johnson',
      avatarUrl: '/avatars/alice.png'
    },
    metadata: {
      oldValue: 'Starter',
      newValue: 'Professional'
    }
  },
  {
    id: 'act_007',
    type: 'task_completed',
    title: 'Task completed',
    description: 'Database schema design task was completed',
    timestamp: '2025-09-10T10:15:00Z',
    user: {
      id: 'u5',
      name: 'Emma Brown',
      avatarUrl: '/avatars/emma.png'
    },
    metadata: {
      taskId: 't8',
      taskName: 'Database schema design',
      projectId: 'p3',
      projectName: 'Data Analytics Platform'
    }
  },
  {
    id: 'act_008',
    type: 'comment_added',
    title: 'Comment added',
    description: 'Added a comment on Mobile App Development project',
    timestamp: '2025-09-09T15:45:00Z',
    user: {
      id: 'u4',
      name: 'David Wilson',
      avatarUrl: '/avatars/david.png'
    },
    metadata: {
      projectId: 'p2',
      projectName: 'Mobile App Development'
    }
  },
  {
    id: 'act_009',
    type: 'settings_changed',
    title: 'Organization settings updated',
    description: 'Security settings were updated',
    timestamp: '2025-09-09T09:30:00Z',
    user: {
      id: 'u1',
      name: 'Alice Johnson',
      avatarUrl: '/avatars/alice.png'
    }
  },
  {
    id: 'act_010',
    type: 'integration_added',
    title: 'Integration added',
    description: 'Slack integration was configured',
    timestamp: '2025-09-08T13:20:00Z',
    user: {
      id: 'u2',
      name: 'Bob Smith',
      avatarUrl: '/avatars/bob.png'
    }
  }
]

interface OrganizationActivityProps {
  activities?: ActivityItem[]
  showSearch?: boolean
  showFilters?: boolean
  maxItems?: number
}

export function OrganizationActivity({ 
  activities: propActivities = activities, 
  showSearch = true,
  showFilters = true,
  maxItems 
}: OrganizationActivityProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterUser, setFilterUser] = useState<string>('all')

  // Filter activities based on search and filters - WITH SAFE HANDLING
  const filteredActivities = propActivities
    .filter(activity => {
      // Safe string operations with fallbacks
      const title = activity?.title || ''
      const description = activity?.description || ''
      const userName = activity?.user?.name || ''
      
      const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           userName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = filterType === 'all' || (activity?.type || '').includes(filterType)
      const matchesUser = filterUser === 'all' || activity?.user?.id === filterUser

      return matchesSearch && matchesType && matchesUser
    })
    .slice(0, maxItems)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_joined':
      case 'user_left':
        return <UserPlus className="h-5 w-5 text-green-500" />
      case 'project_created':
      case 'project_updated':
        return <FolderOpen className="h-5 w-5 text-blue-500" />
      case 'project_completed':
      case 'task_completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'task_created':
      case 'task_assigned':
        return <Activity className="h-5 w-5 text-orange-500" />
      case 'file_uploaded':
        return <Upload className="h-5 w-5 text-purple-500" />
      case 'comment_added':
        return <MessageSquare className="h-5 w-5 text-blue-500" />
      case 'settings_changed':
        return <Settings className="h-5 w-5 text-gray-500" />
      case 'plan_upgraded':
        return <TrendingUp className="h-5 w-5 text-green-500" />
      case 'integration_added':
        return <Settings className="h-5 w-5 text-blue-500" />
      default:
        return <Activity className="h-5 w-5 text-gray-500" />
    }
  }

  const getActivityTypeBadge = (type: string) => {
    const typeMap = {
      'user_joined': 'Team',
      'user_left': 'Team',
      'project_created': 'Project',
      'project_completed': 'Project',
      'project_updated': 'Project',
      'task_created': 'Task',
      'task_completed': 'Task',
      'task_assigned': 'Task',
      'file_uploaded': 'File',
      'comment_added': 'Comment',
      'settings_changed': 'Settings',
      'plan_upgraded': 'Billing',
      'integration_added': 'Integration'
    }

    return (
      <Badge variant="outline" className="text-xs">
        {typeMap[type as keyof typeof typeMap] || 'Activity'}
      </Badge>
    )
  }

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return 'Unknown time'
    
    try {
      const date = new Date(timestamp)
      const now = new Date()
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

      if (diffInHours < 1) return 'Just now'
      if (diffInHours < 24) return `${diffInHours}h ago`
      if (diffInHours < 48) return 'Yesterday'
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    } catch (error) {
      return 'Unknown time'
    }
  }

  const getInitials = (name: string) => {
    if (!name || typeof name !== 'string') return 'UN'
    try {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'UN'
    } catch (error) {
      return 'UN'
    }
  }

  // Get unique users for filter - WITH SAFE HANDLING
  const uniqueUsers = Array.from(new Set(propActivities.map(a => a?.user?.id).filter(Boolean)))
    .map(id => propActivities.find(a => a?.user?.id === id)?.user)
    .filter(Boolean)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest organization activities and updates</CardDescription>
          </div>
          {showFilters && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        {(showSearch || showFilters) && (
          <div className="flex items-center gap-4">
            {showSearch && (
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}
            {showFilters && (
              <>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="user">Team</SelectItem>
                    <SelectItem value="project">Projects</SelectItem>
                    <SelectItem value="task">Tasks</SelectItem>
                    <SelectItem value="file">Files</SelectItem>
                    <SelectItem value="comment">Comments</SelectItem>
                    <SelectItem value="settings">Settings</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterUser} onValueChange={setFilterUser}>
                  <SelectTrigger className="w-40">
                    <Users className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="User" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {uniqueUsers.map((user) => (
                      <SelectItem key={user?.id} value={user?.id || ''}>
                        {user?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
        )}

        {/* Activity Timeline */}
        <div className="space-y-4">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No activities found</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterType !== 'all' || filterUser !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No recent activities to display'}
              </p>
            </div>
          ) : (
            filteredActivities.map((activity, index) => (
              <div key={activity?.id || index} className="flex items-start gap-4 pb-4 border-b border-muted last:border-b-0 last:pb-0">
                <div className="mt-1">
                  {getActivityIcon(activity?.type || 'default')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{activity?.title || 'Untitled Activity'}</h4>
                    {getActivityTypeBadge(activity?.type || 'default')}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{activity?.description || 'No description available'}</p>
                  
                  {/* Metadata */}
                  {activity?.metadata && (
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      {activity.metadata.projectName && (
                        <span className="flex items-center gap-1">
                          <FolderOpen className="h-3 w-3" />
                          {activity.metadata.projectName}
                        </span>
                      )}
                      {activity.metadata.taskName && (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          {activity.metadata.taskName}
                        </span>
                      )}
                      {activity.metadata.fileName && (
                        <span className="flex items-center gap-1">
                          <Upload className="h-3 w-3" />
                          {activity.metadata.fileName}
                        </span>
                      )}
                      {activity.metadata.oldValue && activity.metadata.newValue && (
                        <span>
                          {activity.metadata.oldValue} → {activity.metadata.newValue}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={activity?.user?.avatarUrl} />
                        <AvatarFallback className="text-xs">
                          {getInitials(activity?.user?.name || 'Unknown')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">{activity?.user?.name || 'Unknown User'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatTimestamp(activity?.timestamp || new Date().toISOString())}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More */}
        {!maxItems && filteredActivities.length > 0 && filteredActivities.length < propActivities.length && (
          <div className="text-center pt-4">
            <Button variant="outline" size="sm">
              Load More Activities
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}