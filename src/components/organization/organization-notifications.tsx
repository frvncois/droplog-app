'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Settings, 
  Users, 
  FolderOpen, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Send,
  Plus,
  Filter,
  Search,
  Archive,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react'

// Notification interfaces
interface Notification {
  id: string
  type: 'system' | 'project' | 'team' | 'task' | 'mention'
  title: string
  message: string
  createdAt: string
  read: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  sender?: string
  projectId?: string
  actionUrl?: string
}

interface NotificationSettings {
  email: {
    projectUpdates: boolean
    taskAssignments: boolean
    teamInvitations: boolean
    mentions: boolean
    weeklyDigest: boolean
    systemUpdates: boolean
  }
  push: {
    projectUpdates: boolean
    taskAssignments: boolean
    teamInvitations: boolean
    mentions: boolean
    systemUpdates: boolean
  }
  frequency: 'instant' | 'hourly' | 'daily' | 'weekly'
}

// Dummy notifications data
const notifications: Notification[] = [
  {
    id: 'n1',
    type: 'project',
    title: 'Project Update',
    message: 'Marketing Website Redesign project has been updated with new tasks',
    createdAt: '2025-09-12T08:30:00Z',
    read: false,
    priority: 'medium',
    sender: 'Alice Johnson',
    projectId: 'p1',
    actionUrl: '/projects/p1'
  },
  {
    id: 'n2',
    type: 'task',
    title: 'Task Assignment',
    message: 'You have been assigned to "Update homepage header" task',
    createdAt: '2025-09-12T07:15:00Z',
    read: false,
    priority: 'high',
    sender: 'Bob Smith',
    actionUrl: '/tasks/t1'
  },
  {
    id: 'n3',
    type: 'team',
    title: 'New Team Member',
    message: 'David Wilson has joined the organization',
    createdAt: '2025-09-11T16:45:00Z',
    read: true,
    priority: 'low',
    sender: 'System'
  },
  {
    id: 'n4',
    type: 'mention',
    title: 'You were mentioned',
    message: 'Carol Davis mentioned you in a comment on Mobile App Development',
    createdAt: '2025-09-11T14:20:00Z',
    read: true,
    priority: 'medium',
    sender: 'Carol Davis',
    projectId: 'p2'
  },
  {
    id: 'n5',
    type: 'system',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur this weekend from 2-4 AM EST',
    createdAt: '2025-09-10T12:00:00Z',
    read: true,
    priority: 'urgent',
    sender: 'System'
  }
]

// Dummy team members for sender display
const teamMembers = [
  { id: 'u1', name: 'Alice Johnson', avatarUrl: '/avatars/alice.png' },
  { id: 'u2', name: 'Bob Smith', avatarUrl: '/avatars/bob.png' },
  { id: 'u3', name: 'Carol Davis', avatarUrl: '/avatars/carol.png' },
  { id: 'u4', name: 'David Wilson', avatarUrl: '/avatars/david.png' }
]

export function OrganizationNotifications() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [composeDialogOpen, setComposeDialogOpen] = useState(false)
  const [notificationList, setNotificationList] = useState(notifications)
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      projectUpdates: true,
      taskAssignments: true,
      teamInvitations: true,
      mentions: true,
      weeklyDigest: false,
      systemUpdates: true
    },
    push: {
      projectUpdates: true,
      taskAssignments: true,
      teamInvitations: false,
      mentions: true,
      systemUpdates: true
    },
    frequency: 'instant'
  })

  // Filter notifications based on tab and filters
  const filteredNotifications = notificationList.filter(notification => {
    // Tab filtering
    if (activeTab === 'unread' && notification.read) return false
    if (activeTab === 'mentions' && notification.type !== 'mention') return false
    if (activeTab === 'projects' && !['project', 'task'].includes(notification.type)) return false

    // Search filtering
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (notification.sender?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)

    // Type filtering
    const matchesType = filterType === 'all' || notification.type === filterType

    // Priority filtering
    const matchesPriority = filterPriority === 'all' || notification.priority === filterPriority

    return matchesSearch && matchesType && matchesPriority
  })

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <FolderOpen className="h-5 w-5 text-blue-500" />
      case 'task':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'team':
        return <Users className="h-5 w-5 text-purple-500" />
      case 'mention':
        return <MessageSquare className="h-5 w-5 text-orange-500" />
      case 'system':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>
      case 'high':
        return <Badge variant="default" className="bg-red-100 text-red-800">High</Badge>
      case 'medium':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case 'low':
        return <Badge variant="secondary">Low</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const markAsRead = (notificationId: string) => {
    setNotificationList(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotificationList(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (notificationId: string) => {
    setNotificationList(prev => prev.filter(n => n.id !== notificationId))
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const unreadCount = notificationList.filter(n => !n.read).length

  return (
    <div className="space-y-6">
      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Notifications</p>
                <p className="text-2xl font-bold">{notificationList.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unread</p>
                <p className="text-2xl font-bold">{unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mentions</p>
                <p className="text-2xl font-bold">{notificationList.filter(n => n.type === 'mention').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">System</p>
                <p className="text-2xl font-bold">{notificationList.filter(n => n.type === 'system').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Notifications Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Unread ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="mentions" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Mentions
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Dialog open={composeDialogOpen} onOpenChange={setComposeDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Send className="h-4 w-4 mr-2" />
                  Send Notification
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Organization Notification</DialogTitle>
                  <DialogDescription>Send a notification to team members</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="recipients">Recipients</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipients" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Team Members</SelectItem>
                        <SelectItem value="admins">Administrators Only</SelectItem>
                        <SelectItem value="project_leads">Project Leads</SelectItem>
                        <SelectItem value="custom">Custom Selection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select defaultValue="medium">
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
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="Notification title" />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Notification message" rows={3} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setComposeDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => setComposeDialogOpen(false)}>Send Notification</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                Mark All Read
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <NotificationList 
            notifications={filteredNotifications}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterType={filterType}
            setFilterType={setFilterType}
            filterPriority={filterPriority}
            setFilterPriority={setFilterPriority}
            onMarkAsRead={markAsRead}
            onDelete={deleteNotification}
            getNotificationIcon={getNotificationIcon}
            getPriorityBadge={getPriorityBadge}
            formatDate={formatDate}
            getInitials={getInitials}
          />
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          <NotificationList 
            notifications={filteredNotifications}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterType={filterType}
            setFilterType={setFilterType}
            filterPriority={filterPriority}
            setFilterPriority={setFilterPriority}
            onMarkAsRead={markAsRead}
            onDelete={deleteNotification}
            getNotificationIcon={getNotificationIcon}
            getPriorityBadge={getPriorityBadge}
            formatDate={formatDate}
            getInitials={getInitials}
          />
        </TabsContent>

        <TabsContent value="mentions" className="space-y-4">
          <NotificationList 
            notifications={filteredNotifications}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterType={filterType}
            setFilterType={setFilterType}
            filterPriority={filterPriority}
            setFilterPriority={setFilterPriority}
            onMarkAsRead={markAsRead}
            onDelete={deleteNotification}
            getNotificationIcon={getNotificationIcon}
            getPriorityBadge={getPriorityBadge}
            formatDate={formatDate}
            getInitials={getInitials}
          />
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <NotificationList 
            notifications={filteredNotifications}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterType={filterType}
            setFilterType={setFilterType}
            filterPriority={filterPriority}
            setFilterPriority={setFilterPriority}
            onMarkAsRead={markAsRead}
            onDelete={deleteNotification}
            getNotificationIcon={getNotificationIcon}
            getPriorityBadge={getPriorityBadge}
            formatDate={formatDate}
            getInitials={getInitials}
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <NotificationSettings settings={settings} setSettings={setSettings} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Notification List Component
interface NotificationListProps {
  notifications: Notification[]
  searchTerm: string
  setSearchTerm: (term: string) => void
  filterType: string
  setFilterType: (type: string) => void
  filterPriority: string
  setFilterPriority: (priority: string) => void
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
  getNotificationIcon: (type: string) => React.ReactElement
  getPriorityBadge: (priority: string) => React.ReactElement
  formatDate: (date: string) => string
  getInitials: (name: string) => string
}

function NotificationList({
  notifications,
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  filterPriority,
  setFilterPriority,
  onMarkAsRead,
  onDelete,
  getNotificationIcon,
  getPriorityBadge,
  formatDate,
  getInitials
}: NotificationListProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Stay updated with organization activities</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="project">Project</SelectItem>
              <SelectItem value="task">Task</SelectItem>
              <SelectItem value="team">Team</SelectItem>
              <SelectItem value="mention">Mention</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notifications List */}
        <div className="space-y-2">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                You're all caught up! No new notifications.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border rounded-lg hover:bg-muted/50 transition-colors ${
                  !notification.read ? 'border-blue-200 bg-blue-50/50' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                            {notification.title}
                          </h4>
                          {getPriorityBadge(notification.priority)}
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(notification.createdAt)}
                          </div>
                          {notification.sender && (
                            <div>
                              From: {notification.sender}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onMarkAsRead(notification.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(notification.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Notification Settings Component
interface NotificationSettingsProps {
  settings: NotificationSettings
  setSettings: (settings: NotificationSettings) => void
}

function NotificationSettings({ settings, setSettings }: NotificationSettingsProps) {
  const updateEmailSetting = (key: keyof NotificationSettings['email'], value: boolean) => {
    setSettings({
      ...settings,
      email: { ...settings.email, [key]: value }
    })
  }

  const updatePushSetting = (key: keyof NotificationSettings['push'], value: boolean) => {
    setSettings({
      ...settings,
      push: { ...settings.push, [key]: value }
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
          <CardDescription>Configure when you receive email notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-project">Project Updates</Label>
              <p className="text-sm text-muted-foreground">Get notified when projects are updated</p>
            </div>
            <Switch
              id="email-project"
              checked={settings.email.projectUpdates}
              onCheckedChange={(value) => updateEmailSetting('projectUpdates', value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-tasks">Task Assignments</Label>
              <p className="text-sm text-muted-foreground">Get notified when tasks are assigned to you</p>
            </div>
            <Switch
              id="email-tasks"
              checked={settings.email.taskAssignments}
              onCheckedChange={(value) => updateEmailSetting('taskAssignments', value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-team">Team Invitations</Label>
              <p className="text-sm text-muted-foreground">Get notified about team invitations and updates</p>
            </div>
            <Switch
              id="email-team"
              checked={settings.email.teamInvitations}
              onCheckedChange={(value) => updateEmailSetting('teamInvitations', value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-mentions">Mentions</Label>
              <p className="text-sm text-muted-foreground">Get notified when someone mentions you</p>
            </div>
            <Switch
              id="email-mentions"
              checked={settings.email.mentions}
              onCheckedChange={(value) => updateEmailSetting('mentions', value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-digest">Weekly Digest</Label>
              <p className="text-sm text-muted-foreground">Receive a weekly summary of activities</p>
            </div>
            <Switch
              id="email-digest"
              checked={settings.email.weeklyDigest}
              onCheckedChange={(value) => updateEmailSetting('weeklyDigest', value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-system">System Updates</Label>
              <p className="text-sm text-muted-foreground">Get notified about system maintenance and updates</p>
            </div>
            <Switch
              id="email-system"
              checked={settings.email.systemUpdates}
              onCheckedChange={(value) => updateEmailSetting('systemUpdates', value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>Configure browser and mobile push notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-project">Project Updates</Label>
              <p className="text-sm text-muted-foreground">Browser notifications for project updates</p>
            </div>
            <Switch
              id="push-project"
              checked={settings.push.projectUpdates}
              onCheckedChange={(value) => updatePushSetting('projectUpdates', value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-tasks">Task Assignments</Label>
              <p className="text-sm text-muted-foreground">Browser notifications for task assignments</p>
            </div>
            <Switch
              id="push-tasks"
              checked={settings.push.taskAssignments}
              onCheckedChange={(value) => updatePushSetting('taskAssignments', value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-team">Team Invitations</Label>
              <p className="text-sm text-muted-foreground">Browser notifications for team activities</p>
            </div>
            <Switch
              id="push-team"
              checked={settings.push.teamInvitations}
              onCheckedChange={(value) => updatePushSetting('teamInvitations', value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-mentions">Mentions</Label>
              <p className="text-sm text-muted-foreground">Browser notifications for mentions</p>
            </div>
            <Switch
              id="push-mentions"
              checked={settings.push.mentions}
              onCheckedChange={(value) => updatePushSetting('mentions', value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-system">System Updates</Label>
              <p className="text-sm text-muted-foreground">Browser notifications for system updates</p>
            </div>
            <Switch
              id="push-system"
              checked={settings.push.systemUpdates}
              onCheckedChange={(value) => updatePushSetting('systemUpdates', value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Frequency</CardTitle>
          <CardDescription>Choose how often you receive bundled notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={settings.frequency}
            onValueChange={(value: 'instant' | 'hourly' | 'daily' | 'weekly') =>
              setSettings({ ...settings, frequency: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instant">Instant</SelectItem>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground mt-2">
            {settings.frequency === 'instant' && 'Receive notifications immediately as they happen'}
            {settings.frequency === 'hourly' && 'Receive bundled notifications every hour'}
            {settings.frequency === 'daily' && 'Receive a daily digest of notifications'}
            {settings.frequency === 'weekly' && 'Receive a weekly summary of notifications'}
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>
          Save Settings
        </Button>
      </div>
    </div>
  )
}