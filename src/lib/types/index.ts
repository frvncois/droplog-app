// src/lib/types/index.ts

// Core entity types
export interface Project {
  id: string;
  title: string;
  url?: string;
  status: "active" | "completed" | "archived" | "on_hold";
  priority?: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  tasksCount: number;
  completedTasks?: number;
  description?: string;
  assignedTo?: string[];
  teamMembers?: string[];
  owner?: string;
  budget?: number;
  spent?: number;
  tags?: string[];
  starred?: boolean;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  status: "todo" | "in_progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  comments: string[];
  description?: string;
  tags?: string[];
  estimatedHours?: number;
  actualHours?: number;
}

export interface Asset {
  id: string;
  projectId: string;
  type: "image" | "video" | "pdf" | "document" | "audio" | "other";
  title: string;
  filename?: string;
  fileName?: string; // Alternative naming for consistency
  fileUrl?: string;
  fileSize?: number;
  size?: number; // Alternative naming for consistency
  description?: string;
  addedBy: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  url?: string;
  tags?: string[];
}

export interface Content {
  id: string;
  projectId: string;
  title: string;
  status: "draft" | "pending" | "approved" | "published";
  type: "blog_post" | "page" | "email" | "social" | "other";
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  content?: string;
  wordCount?: number;
  url?: string;
  tags?: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role: "admin" | "manager" | "designer" | "developer" | "content_writer" | "viewer" | "owner" | "member";
  avatarUrl?: string;
  joinedAt?: string;
  lastActive?: string;
  department?: string;
  location?: string;
  status?: "active" | "pending" | "inactive";
  projectsAssigned?: number;
  tasksCompleted?: number;
}

// Documentation types
export interface Documentation {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  status: "draft" | "review" | "published" | "archived";
  author: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  wordCount: number;
  readTime: number;
  content?: string;
}

// Organization types
export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: string;
  members: number;
  projects: number;
  createdAt: string;
  updatedAt: string;
  description?: string;
  website?: string;
  logo?: string;
}

// Integration types
export interface Integration {
  id: string;
  name: string;
  category: 'productivity' | 'storage' | 'communication' | 'development' | 'analytics' | 'automation';
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  description: string;
  icon: string;
  plan: 'free' | 'pro' | 'enterprise' | null;
  features: string[];
  settings?: Record<string, any>;
  lastSync?: string;
  connectedAt?: string;
  syncFrequency?: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'manual';
  dataTypes?: string[];
  permissions?: string[];
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive' | 'error';
  secret?: string;
  createdAt: string;
  lastTriggered?: string;
  successCount: number;
  errorCount: number;
  description?: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  createdAt: string;
  lastUsed?: string;
  status: 'active' | 'inactive' | 'expired';
  expiresAt?: string;
  usageCount: number;
}

// Activity/Timeline types
export interface Activity {
  id: string;
  type: 'project_created' | 'task_completed' | 'asset_uploaded' | 'member_added' | 'comment_added';
  entityId: string;
  entityType: 'project' | 'task' | 'asset' | 'comment';
  userId: string;
  timestamp: string;
  metadata?: Record<string, any>;
  description?: string;
}

// Help/Support types
export interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  helpful: number;
  notHelpful: number;
}

export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  relatedArticles?: string[];
  tags?: string[];
}

export interface SupportTeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
}

// Extended types for specific use cases
export interface AssetWithProject extends Asset {
  project?: {
    id: string;
    title: string;
    status: string;
  };
}

export interface TaskWithProject extends Task {
  project?: {
    id: string;
    title: string;
    status: string;
  };
}

export interface ProjectTeamMember extends TeamMember {
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
  projectRole?: string;
}

// Form and validation types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export interface ProjectForm {
  title: string;
  description?: string;
  status: Project['status'];
  priority?: Project['priority'];
  dueDate?: string;
  budget?: number;
  tags?: string[];
  teamMembers?: string[];
}

export interface TaskForm {
  title: string;
  description?: string;
  projectId: string;
  assignedTo?: string;
  priority: Task['priority'];
  dueDate?: string;
  estimatedHours?: number;
  tags?: string[];
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter and search types
export interface ProjectFilters {
  status?: Project['status'] | 'all';
  priority?: Project['priority'] | 'all';
  owner?: string | 'all';
  dateRange?: {
    from?: string;
    to?: string;
  };
  tags?: string[];
}

export interface TaskFilters {
  status?: Task['status'] | 'all';
  priority?: Task['priority'] | 'all';
  assignedTo?: string | 'all';
  projectId?: string | 'all';
  dueDate?: 'overdue' | 'today' | 'this_week' | 'this_month' | 'all';
}

export interface AssetFilters {
  type?: Asset['type'] | 'all';
  projectId?: string | 'all';
  addedBy?: string | 'all';
  dateRange?: {
    from?: string;
    to?: string;
  };
}

// Settings types
export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  taskReminders: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  lastPasswordChange?: string;
  activeSessions: number;
}

// Dashboard/Analytics types
export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  totalAssets: number;
  totalTeamMembers: number;
  recentActivity: Activity[];
}

export interface ProjectAnalytics {
  tasksCompleted: number;
  tasksInProgress: number;
  tasksTodo: number;
  completionRate: number;
  averageTaskTime: number;
  upcomingDeadlines: Task[];
  recentActivity: Activity[];
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: string;
  timestamp: string;
}

// User authentication types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl?: string;
  organizationId?: string;
  settings?: UserSettings;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Export utility types
export type Status = 'idle' | 'loading' | 'success' | 'error';
export type ViewMode = 'grid' | 'list' | 'kanban';
export type SortDirection = 'asc' | 'desc';
export type ThemeMode = 'light' | 'dark' | 'system';