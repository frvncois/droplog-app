'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Eye,
  Edit,
  Archive,
  Trash2,
  Star,
  TrendingUp
} from 'lucide-react'

// Project interface based on dummy data schema
interface Project {
  id: string
  title: string
  description: string
  status: 'active' | 'completed' | 'archived' | 'on_hold'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdAt: string
  updatedAt: string
  dueDate?: string
  url?: string
  tasksCount: number
  completedTasks: number
  teamMembers: string[]
  owner: string
  budget?: number
  spent?: number
  tags: string[]
}

// Dummy projects data
const projects: Project[] = [
  {
    id: 'p1',
    title: 'Marketing Website Redesign',
    description: 'Complete overhaul of the company marketing website with modern design and improved UX',
    status: 'active',
    priority: 'high',
    createdAt: '2025-08-01T10:00:00Z',
    updatedAt: '2025-09-10T15:30:00Z',
    dueDate: '2025-10-15T23:59:59Z',
    url: 'https://marketing.company.com',
    tasksCount: 24,
    completedTasks: 18,
    teamMembers: ['u1', 'u2', 'u3'],
    owner: 'u1',
    budget: 50000,
    spent: 32000,
    tags: ['marketing', 'design', 'frontend']
  },
  {
    id: 'p2',
    title: 'Mobile App Development',
    description: 'Native iOS and Android app for customer engagement',
    status: 'active',
    priority: 'urgent',
    createdAt: '2025-07-15T09:00:00Z',
    updatedAt: '2025-09-11T12:00:00Z',
    dueDate: '2025-11-30T23:59:59Z',
    tasksCount: 45,
    completedTasks: 12,
    teamMembers: ['u2', 'u4', 'u5'],
    owner: 'u2',
    budget: 120000,
    spent: 45000,
    tags: ['mobile', 'ios', 'android', 'development']
  },
  {
    id: 'p3',
    title: 'Data Analytics Platform',
    description: 'Internal dashboard for business intelligence and analytics',
    status: 'active',
    priority: 'medium',
    createdAt: '2025-06-01T08:00:00Z',
    updatedAt: '2025-09-09T16:45:00Z',
    dueDate: '2025-12-31T23:59:59Z',
    tasksCount: 32,
    completedTasks: 28,
    teamMembers: ['u3', 'u5'],
    owner: 'u3',
    budget: 80000,
    spent: 65000,
    tags: ['analytics', 'dashboard', 'data']
  },
  {
    id: 'p4',
    title: 'E-commerce Integration',
    description: 'Integration with major e-commerce platforms',
    status: 'completed',
    priority: 'medium',
    createdAt: '2025-04-01T10:00:00Z',
    updatedAt: '2025-08-15T14:20:00Z',
    tasksCount: 18,
    completedTasks: 18,
    teamMembers: ['u1', 'u4'],
    owner: 'u4',
    budget: 35000,
    spent: 33000,
    tags: ['ecommerce', 'integration', 'api']
  },
  {
    id: 'p5',
    title: 'Legacy System Migration',
    description: 'Migration from legacy systems to modern infrastructure',
    status: 'on_hold',
    priority: 'low',
    createdAt: '2025-05-01T11:00:00Z',
    updatedAt: '2025-07-30T10:15:00Z',
    tasksCount: 52,
    completedTasks: 8,
    teamMembers: ['u2', 'u5'],
    owner: 'u5',
    budget: 200000,
    spent: 25000,
    tags: ['migration', 'infrastructure', 'backend']
  }
]

// Team members for display
const teamMembers = [
  { id: 'u1', name: 'Alice Johnson', avatarUrl: '/avatars/alice.png' },
  { id: 'u2', name: 'Bob Smith', avatarUrl: '/avatars/bob.png' },
  { id: 'u3', name: 'Carol Davis', avatarUrl: '/avatars/carol.png' },
  { id: 'u4', name: 'David Wilson', avatarUrl: '/avatars/david.png' },
  { id: 'u5', name: 'Emma Brown', avatarUrl: '/avatars/emma.png' }
]

export function OrganizationProjects() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('updated')

  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesStatus = filterStatus === 'all' || project.status === filterStatus
      const matchesPriority = filterPriority === 'all' || project.priority === filterPriority
      
      return matchesSearch && matchesStatus && matchesPriority
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title)
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'due':
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case 'progress':
          const aProgress = a.tasksCount > 0 ? (a.completedTasks / a.tasksCount) * 100 : 0
          const bProgress = b.tasksCount > 0 ? (b.completedTasks / b.tasksCount) * 100 : 0
          return bProgress - aProgress
        default: // updated
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }
    })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
      case 'completed':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Completed</Badge>
      case 'on_hold':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">On Hold</Badge>
      case 'archived':
        return <Badge variant="secondary">Archived</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
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

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 60) return 'bg-blue-500'
    if (progress >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getTeamMember = (id: string) => {
    return teamMembers.find(member => member.id === id)
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  // Calculate organization project stats
  const totalProjects = projects.length
  const activeProjects = projects.filter(p => p.status === 'active').length
  const completedProjects = projects.filter(p => p.status === 'completed').length
  const onHoldProjects = projects.filter(p => p.status === 'on_hold').length

  return (
    <div className="space-y-6">
      {/* Project Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FolderOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold">{totalProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold">{activeProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">On Hold</p>
                <p className="text-2xl font-bold">{onHoldProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Projects</CardTitle>
              <CardDescription>Manage and monitor all organization projects</CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
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
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated">Last Updated</SelectItem>
                <SelectItem value="created">Date Created</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="due">Due Date</SelectItem>
                <SelectItem value="progress">Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Projects Grid */}
          <div className="grid gap-6">
            {filteredProjects.map((project) => {
              const progress = project.tasksCount > 0 ? (project.completedTasks / project.tasksCount) * 100 : 0
              const owner = getTeamMember(project.owner)
              const budgetUsed = project.budget && project.spent ? (project.spent / project.budget) * 100 : 0

              return (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{project.title}</h3>
                          {getStatusBadge(project.status)}
                          {getPriorityBadge(project.priority)}
                        </div>
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {project.dueDate ? `Due ${formatDate(project.dueDate)}` : 'No due date'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {project.teamMembers.length} members
                          </div>
                          {project.budget && (
                            <div>
                              Budget: {formatCurrency(project.spent || 0)} / {formatCurrency(project.budget)}
                            </div>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Project
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Project
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Star className="h-4 w-4 mr-2" />
                            Add to Favorites
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Archive className="h-4 w-4 mr-2" />
                            Archive Project
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-4">
                      {/* Progress */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-muted-foreground">
                            {project.completedTasks}/{project.tasksCount} tasks
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <p className="text-sm text-muted-foreground mt-1">
                          {Math.round(progress)}% complete
                        </p>
                      </div>

                      {/* Budget Progress (if available) */}
                      {project.budget && project.spent && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Budget</span>
                            <span className="text-sm text-muted-foreground">
                              {formatCurrency(project.spent)} / {formatCurrency(project.budget)}
                            </span>
                          </div>
                          <Progress value={budgetUsed} className="h-2" />
                          <p className="text-sm text-muted-foreground mt-1">
                            {Math.round(budgetUsed)}% used
                          </p>
                        </div>
                      )}

                      {/* Team and Tags */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Team:</span>
                          <div className="flex -space-x-2">
                            {project.teamMembers.slice(0, 3).map((memberId) => {
                              const member = getTeamMember(memberId)
                              return member ? (
                                <Avatar key={memberId} className="h-8 w-8 border-2 border-background">
                                  <AvatarImage src={member.avatarUrl} />
                                  <AvatarFallback className="text-xs">
                                    {getInitials(member.name)}
                                  </AvatarFallback>
                                </Avatar>
                              ) : null
                            })}
                            {project.teamMembers.length > 3 && (
                              <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                                <span className="text-xs font-medium">
                                  +{project.teamMembers.length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                          {owner && (
                            <div className="ml-2 text-sm text-muted-foreground">
                              Owner: {owner.name}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {project.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {project.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first project'}
              </p>
              {!searchTerm && filterStatus === 'all' && filterPriority === 'all' && (
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}