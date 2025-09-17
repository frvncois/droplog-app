// src/lib/types/component-props.ts

// Import from centralized types
import type {
  Project,
  Task,
  Asset,
  TeamMember,
  Documentation,
  Integration,
  Activity,
  User,
  ViewMode,
  Status,
  SortDirection
} from '@/lib/types'

// Base data component props pattern
export interface BaseDataComponentProps<T> {
  data: T[]
  isLoading?: boolean
  error?: string | null
  onRefresh?: () => void
}

// Common action props
export interface DataActionProps<T> {
  onCreate?: (item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => void
  onUpdate?: (id: string, updates: Partial<T>) => void
  onDelete?: (id: string) => void
  onSelect?: (item: T) => void
  onView?: (item: T) => void
}

// Filter and search props
export interface DataFilterProps {
  searchTerm?: string
  onSearchChange?: (term: string) => void
  sortBy?: string
  onSortChange?: (sort: string) => void
  filterBy?: Record<string, any>
  onFilterChange?: (filters: Record<string, any>) => void
}

// Pagination props
export interface PaginationProps {
  currentPage?: number
  totalPages?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
}

// Project-specific component props
export interface ProjectListProps extends 
  BaseDataComponentProps<Project>,
  DataActionProps<Project>,
  DataFilterProps,
  PaginationProps {
  viewMode?: 'grid' | 'list' | 'kanban'
  onViewModeChange?: (mode: 'grid' | 'list' | 'kanban') => void
  selectedProjects?: string[]
  onSelectionChange?: (projectIds: string[]) => void
}

export interface ProjectCardProps {
  project: Project
  isSelected?: boolean
  onSelect?: (project: Project) => void
  onEdit?: (project: Project) => void
  onDelete?: (projectId: string) => void
  onView?: (project: Project) => void
  showActions?: boolean
}

// Task-specific component props
export interface TaskListProps extends 
  BaseDataComponentProps<Task>,
  DataActionProps<Task>,
  DataFilterProps {
  groupBy?: 'status' | 'priority' | 'assignee' | 'project' | 'none'
  onGroupByChange?: (groupBy: TaskListProps['groupBy']) => void
  projectId?: string
  assignedTo?: string
}

export interface TaskCardProps {
  task: Task
  project?: Project
  assignee?: TeamMember
  isSelected?: boolean
  onSelect?: (task: Task) => void
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
  onStatusChange?: (taskId: string, status: Task['status']) => void
  showProject?: boolean
  showAssignee?: boolean
}

// Asset-specific component props
export interface AssetListProps extends 
  BaseDataComponentProps<Asset>,
  DataActionProps<Asset>,
  DataFilterProps {
  viewMode?: 'grid' | 'list'
  onViewModeChange?: (mode: 'grid' | 'list') => void
  typeFilter?: Asset['type'] | 'all'
  onTypeFilterChange?: (type: Asset['type'] | 'all') => void
  projectFilter?: string | 'all'
  onProjectFilterChange?: (projectId: string | 'all') => void
}

export interface AssetCardProps {
  asset: Asset
  project?: Project
  isSelected?: boolean
  onSelect?: (asset: Asset) => void
  onEdit?: (asset: Asset) => void
  onDelete?: (assetId: string) => void
  onDownload?: (asset: Asset) => void
  showProject?: boolean
}

// Team-specific component props
export interface TeamListProps extends 
  BaseDataComponentProps<TeamMember>,
  DataActionProps<TeamMember>,
  DataFilterProps {
  roleFilter?: TeamMember['role'] | 'all'
  onRoleFilterChange?: (role: TeamMember['role'] | 'all') => void
}

export interface TeamMemberCardProps {
  member: TeamMember
  isSelected?: boolean
  onSelect?: (member: TeamMember) => void
  onEdit?: (member: TeamMember) => void
  onRemove?: (memberId: string) => void
  showRole?: boolean
  showContact?: boolean
}

// Modal component props
export interface BaseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export interface CreateModalProps<T> extends BaseModalProps {
  onCreate: (item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => void
  defaultValues?: Partial<T>
}

export interface EditModalProps<T> extends BaseModalProps {
  item: T | null
  onSave: (item: T) => void
}

export interface ViewModalProps<T> extends BaseModalProps {
  item: T | null
  onEdit?: (item: T) => void
  onDelete?: (id: string) => void
}

// Specific modal props
export interface ProjectModalProps extends CreateModalProps<Project> {
  // Add project-specific modal props if needed
}

export interface TaskModalProps extends CreateModalProps<Task> {
  projectId?: string
  projects?: Project[]
  teamMembers?: TeamMember[]
}

export interface AssetUploadModalProps extends BaseModalProps {
  onUpload: (assets: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>[]) => void
  projectId?: string
  allowedTypes?: Asset['type'][]
  maxFileSize?: number
}

// Dashboard/workspace component props
export interface DashboardStatsProps {
  stats: {
    totalProjects: number
    activeProjects: number
    totalTasks: number
    completedTasks: number
    totalAssets: number
    totalTeamMembers: number
  }
  isLoading?: boolean
}

export interface RecentActivityProps {
  activities: Activity[]
  isLoading?: boolean
  maxItems?: number
  onViewAll?: () => void
}

// Settings component props
export interface SettingsTabProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export interface SecuritySettingsProps {
  user: TeamMember
  onPasswordChange: (oldPassword: string, newPassword: string) => Promise<void>
  onTwoFactorToggle: (enabled: boolean) => Promise<void>
  twoFactorEnabled: boolean
}

// Integration component props
export interface IntegrationListProps {
  integrations: Integration[]
  isLoading?: boolean
  onConnect: (integrationId: string) => void
  onDisconnect: (integrationId: string) => void
  onConfigure: (integrationId: string) => void
}

// Common loading component props
export interface LoadingStateProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'spinner' | 'skeleton' | 'pulse'
}

// Common error component props
export interface ErrorStateProps {
  error: string | Error
  onRetry?: () => void
  showRetry?: boolean
  variant?: 'inline' | 'card' | 'page'
}

// Re-export for convenience
export type {
  Project,
  Task,
  Asset,
  TeamMember,
  Documentation,
  Integration,
  Activity,
  User,
  ViewMode,
  Status,
  SortDirection
}