'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Search,
  FileText,
  FolderOpen,
  Users,
  CheckSquare,
  Settings,
  LayoutDashboard,
  Calendar,
  Hash,
  Image,
  BookOpen,
  Zap,
  Clock,
  User,
  Plus
} from 'lucide-react'
import { projects, tasks, team, assets, content } from '@/lib/utils/dummy-data'

interface SearchResult {
  id: string
  title: string
  type: 'page' | 'project' | 'task' | 'content' | 'team' | 'asset' | 'documentation' | 'action'
  href: string
  description?: string
  badge?: string
  status?: string
  project?: string
  author?: string
  icon?: React.ComponentType<{ className?: string }>
}

interface GlobalCommandBarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GlobalCommandBar({ open, onOpenChange }: GlobalCommandBarProps) {
  const router = useRouter()
  const [search, setSearch] = React.useState('')

  // Mock documentation data for search
  const documentation = [
    { id: 'doc1', title: 'Project Setup Guide', description: 'Complete setup guide', projectId: 'p1', author: 'u1' },
    { id: 'doc2', title: 'API Documentation', description: 'RESTful API endpoints', projectId: 'p2', author: 'u2' },
    { id: 'doc3', title: 'Design System', description: 'Brand guidelines', projectId: 'p1', author: 'u3' },
  ]

  // Generate search results based on query
  const getSearchResults = React.useMemo(() => {
    if (!search) {
      return {
        pages: [],
        projects: [],
        tasks: [],
        documentation: [],
        team: [],
        assets: [],
        content: [],
        actions: []
      }
    }

    const query = search.toLowerCase()

    // Page navigation results
    const pages: SearchResult[] = [
      { id: 'dashboard', title: 'Dashboard', type: 'page', href: '/app/workspace', description: 'Main dashboard overview', icon: LayoutDashboard },
      { id: 'projects', title: 'Projects', type: 'page', href: '/app/projects', description: 'All projects', icon: FolderOpen },
      { id: 'tasks', title: 'Tasks', type: 'page', href: '/app/tasks', description: 'Task management', icon: CheckSquare },
      { id: 'assets', title: 'Assets', type: 'page', href: '/app/assets', description: 'File and media management', icon: Image },
      { id: 'team', title: 'Team', type: 'page', href: '/app/team', description: 'Team members', icon: Users },
      { id: 'documentation', title: 'Documentation', type: 'page', href: '/app/documentation', description: 'Knowledge base', icon: BookOpen },
      { id: 'settings', title: 'Settings', type: 'page', href: '/app/settings', description: 'App settings', icon: Settings },
    ].filter(page => 
      page.title.toLowerCase().includes(query) || 
      page.description?.toLowerCase().includes(query)
    )

    // Project results
    const projectResults: SearchResult[] = projects
      .filter(project => 
        project.title.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query)
      )
      .map(project => ({
        id: project.id,
        title: project.title,
        type: 'project' as const,
        href: `/app/projects/${project.id}`,
        description: project.description || undefined,
        badge: project.status,
        status: project.status
      }))

    // Task results
    const taskResults: SearchResult[] = tasks
      .filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
      )
      .slice(0, 5)
      .map(task => {
        const project = projects.find(p => p.id === task.projectId)
        return {
          id: task.id,
          title: task.title,
          type: 'task' as const,
          href: `/app/projects/${task.projectId}?tab=tasks&task=${task.id}`,
          description: task.description || undefined,
          badge: task.priority,
          status: task.status,
          project: project?.title
        }
      })

    // Documentation results
    const docResults: SearchResult[] = documentation
      .filter(doc => 
        doc.title.toLowerCase().includes(query) ||
        doc.description?.toLowerCase().includes(query)
      )
      .map(doc => {
        const project = projects.find(p => p.id === doc.projectId)
        const author = team.find(t => t.id === doc.author)
        return {
          id: doc.id,
          title: doc.title,
          type: 'documentation' as const,
          href: `/app/documentation/${doc.id}`,
          description: doc.description,
          project: project?.title,
          author: author?.name
        }
      })

    // Team results
    const teamResults: SearchResult[] = team
      .filter(member => 
        member.name.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query)
      )
      .map(member => ({
        id: member.id,
        title: member.name,
        type: 'team' as const,
        href: `/app/team/${member.id}`,
        description: member.role,
        badge: member.role
      }))

    // Asset results
    const assetResults: SearchResult[] = assets
      .filter(asset => 
        asset.title.toLowerCase().includes(query) ||
        asset.type.toLowerCase().includes(query)
      )
      .slice(0, 5)
      .map(asset => {
        const project = projects.find(p => p.id === asset.projectId)
        return {
          id: asset.id,
          title: asset.title,
          type: 'asset' as const,
          href: `/app/projects/${asset.projectId}?tab=assets&asset=${asset.id}`,
          description: `${asset.type} file`,
          badge: asset.type,
          project: project?.title
        }
      })

    // Content results
    const contentResults: SearchResult[] = content
      .filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.status.toLowerCase().includes(query)
      )
      .slice(0, 5)
      .map(item => {
        const project = projects.find(p => p.id === item.projectId)
        return {
          id: item.id,
          title: item.title,
          type: 'content' as const,
          href: `/app/projects/${item.projectId}?tab=content&content=${item.id}`,
          description: 'Content piece',
          badge: item.status,
          status: item.status,
          project: project?.title
        }
      })

    // Quick actions
    const actions: SearchResult[] = [
      { id: 'new-project', title: 'New Project', type: 'action' as const, href: '/app/projects/new', description: 'Create a new project', icon: Plus },
      { id: 'new-task', title: 'New Task', type: 'action' as const, href: '/app/tasks/new', description: 'Create a new task', icon: Plus },
      { id: 'new-doc', title: 'New Document', type: 'action' as const, href: '/app/documentation/new', description: 'Create documentation', icon: Plus },
    ].filter(action => 
      action.title.toLowerCase().includes(query) ||
      action.description?.toLowerCase().includes(query)
    ) as SearchResult[]

    return {
      pages,
      projects: projectResults,
      tasks: taskResults,
      documentation: docResults,
      team: teamResults,
      assets: assetResults,
      content: contentResults,
      actions
    }
  }, [search])

  const handleSelect = (result: SearchResult) => {
    router.push(result.href)
    onOpenChange(false)
    setSearch('')
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'page':
        return LayoutDashboard
      case 'project':
        return FolderOpen
      case 'task':
        return CheckSquare
      case 'documentation':
        return BookOpen
      case 'team':
        return Users
      case 'asset':
        return Image
      case 'content':
        return FileText
      case 'action':
        return Zap
      default:
        return Search
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
      case 'published':
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
      case 'review':
        return 'bg-blue-100 text-blue-800'
      case 'todo':
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'high':
      case 'urgent':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const allResults = Object.values(getSearchResults).flat()
  const hasResults = allResults.length > 0

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Search projects, tasks, docs, team members..." 
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        {!hasResults && search && (
          <CommandEmpty>No results found for "{search}"</CommandEmpty>
        )}

        {!search && (
          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => handleSelect({ id: 'new-project', title: 'New Project', type: 'action', href: '/app/projects/new' })}>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </CommandItem>
            <CommandItem onSelect={() => handleSelect({ id: 'new-task', title: 'New Task', type: 'action', href: '/app/tasks/new' })}>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </CommandItem>
            <CommandItem onSelect={() => handleSelect({ id: 'new-doc', title: 'New Document', type: 'action', href: '/app/documentation/new' })}>
              <Plus className="mr-2 h-4 w-4" />
              New Document
            </CommandItem>
          </CommandGroup>
        )}

        {getSearchResults.pages.length > 0 && (
          <>
            <CommandGroup heading="Pages">
              {getSearchResults.pages.map((result) => {
                const Icon = result.icon || getTypeIcon(result.type)
                return (
                  <CommandItem key={result.id} onSelect={() => handleSelect(result)}>
                    <Icon className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                      <span>{result.title}</span>
                      {result.description && (
                        <span className="text-xs text-muted-foreground">{result.description}</span>
                      )}
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {getSearchResults.projects.length > 0 && (
          <>
            <CommandGroup heading="Projects">
              {getSearchResults.projects.map((result) => {
                const Icon = getTypeIcon(result.type)
                return (
                  <CommandItem key={result.id} onSelect={() => handleSelect(result)}>
                    <Icon className="mr-2 h-4 w-4" />
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center justify-between">
                        <span>{result.title}</span>
                        {result.badge && (
                          <Badge className={getStatusColor(result.status)} variant="secondary">
                            {result.badge}
                          </Badge>
                        )}
                      </div>
                      {result.description && (
                        <span className="text-xs text-muted-foreground truncate">{result.description}</span>
                      )}
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {getSearchResults.tasks.length > 0 && (
          <>
            <CommandGroup heading="Tasks">
              {getSearchResults.tasks.map((result) => {
                const Icon = getTypeIcon(result.type)
                return (
                  <CommandItem key={result.id} onSelect={() => handleSelect(result)}>
                    <Icon className="mr-2 h-4 w-4" />
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center justify-between">
                        <span>{result.title}</span>
                        <div className="flex items-center gap-1">
                          {result.badge && (
                            <Badge className={getStatusColor(result.badge)} variant="secondary">
                              {result.badge}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {result.project && <span>{result.project}</span>}
                        {result.status && <span>• {result.status}</span>}
                      </div>
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {getSearchResults.documentation.length > 0 && (
          <>
            <CommandGroup heading="Documentation">
              {getSearchResults.documentation.map((result) => {
                const Icon = getTypeIcon(result.type)
                return (
                  <CommandItem key={result.id} onSelect={() => handleSelect(result)}>
                    <Icon className="mr-2 h-4 w-4" />
                    <div className="flex flex-col flex-1">
                      <span>{result.title}</span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {result.project && <span>{result.project}</span>}
                        {result.author && <span>• by {result.author}</span>}
                      </div>
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {getSearchResults.team.length > 0 && (
          <>
            <CommandGroup heading="Team Members">
              {getSearchResults.team.map((result) => {
                const member = team.find(t => t.id === result.id)
                return (
                  <CommandItem key={result.id} onSelect={() => handleSelect(result)}>
                    <Avatar className="mr-2 h-4 w-4">
                      <AvatarImage src={member?.avatarUrl} />
                      <AvatarFallback className="text-xs">
                        {member?.name?.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span>{result.title}</span>
                      <span className="text-xs text-muted-foreground">{result.description}</span>
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {getSearchResults.actions.length > 0 && (
          <CommandGroup heading="Quick Actions">
            {getSearchResults.actions.map((result) => {
              const Icon = result.icon || getTypeIcon(result.type)
              return (
                <CommandItem key={result.id} onSelect={() => handleSelect(result)}>
                  <Icon className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>{result.title}</span>
                    {result.description && (
                      <span className="text-xs text-muted-foreground">{result.description}</span>
                    )}
                  </div>
                </CommandItem>
              )
            })}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}