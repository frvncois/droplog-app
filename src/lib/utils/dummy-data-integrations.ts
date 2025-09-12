// lib/utils/dummy-data-integrations.ts

export interface Integration {
  id: string
  name: string
  category: 'productivity' | 'storage' | 'communication' | 'development' | 'analytics' | 'automation'
  status: 'connected' | 'disconnected' | 'error' | 'pending'
  description: string
  icon: string // Icon name for Lucide React
  plan: 'free' | 'pro' | 'enterprise' | null
  features: string[]
  settings?: Record<string, any>
  lastSync?: string
  connectedAt?: string
  syncFrequency?: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'manual'
  dataTypes?: string[]
  permissions?: string[]
}

export interface Webhook {
  id: string
  name: string
  url: string
  events: string[]
  status: 'active' | 'inactive' | 'error'
  secret?: string
  createdAt: string
  lastTriggered?: string
  successCount: number
  errorCount: number
  description?: string
}

export interface ApiKey {
  id: string
  name: string
  key: string // Masked for security
  permissions: string[]
  createdAt: string
  lastUsed?: string
  status: 'active' | 'inactive' | 'expired'
  expiresAt?: string
  usageCount: number
}

// Integrations dummy data
export const integrations: Integration[] = [
  // Productivity
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    category: 'productivity',
    status: 'connected',
    description: 'Sync tasks and deadlines with your Google Calendar',
    icon: 'Calendar',
    plan: 'free',
    features: ['Two-way sync', 'Event creation', 'Deadline reminders', 'Meeting scheduling'],
    settings: {
      calendarId: 'primary',
      syncTaskDeadlines: true,
      createMeetingEvents: true,
      reminderMinutes: [15, 30]
    },
    lastSync: '2025-09-12T08:30:00Z',
    connectedAt: '2025-09-01T10:00:00Z',
    syncFrequency: 'hourly',
    dataTypes: ['tasks', 'events', 'deadlines'],
    permissions: ['calendar.read', 'calendar.write']
  },
  {
    id: 'apple-calendar',
    name: 'Apple Calendar',
    category: 'productivity',
    status: 'disconnected',
    description: 'Integrate with iCloud Calendar for seamless task scheduling',
    icon: 'Calendar',
    plan: 'pro',
    features: ['Two-way sync', 'Event creation', 'Reminder integration', 'Cross-device sync'],
    syncFrequency: 'daily',
    dataTypes: ['tasks', 'events', 'reminders']
  },
  {
    id: 'microsoft-calendar',
    name: 'Microsoft Calendar',
    category: 'productivity',
    status: 'error',
    description: 'Connect with Outlook Calendar for unified scheduling',
    icon: 'Calendar',
    plan: 'free',
    features: ['Outlook integration', 'Teams meeting sync', 'Exchange support'],
    lastSync: '2025-09-11T14:20:00Z',
    connectedAt: '2025-08-15T09:00:00Z',
    syncFrequency: 'hourly',
    dataTypes: ['tasks', 'meetings', 'events']
  },
  {
    id: 'trello',
    name: 'Trello',
    category: 'productivity',
    status: 'connected',
    description: 'Import boards and sync cards with your Droplog projects',
    icon: 'Trello',
    plan: 'free',
    features: ['Board import', 'Card sync', 'Checklist integration', 'Due date sync'],
    settings: {
      boardIds: ['abc123', 'def456'],
      syncChecklists: true,
      importLabels: true
    },
    lastSync: '2025-09-12T07:45:00Z',
    connectedAt: '2025-08-20T11:30:00Z',
    syncFrequency: 'daily',
    dataTypes: ['projects', 'tasks', 'checklists']
  },
  {
    id: 'monday',
    name: 'Monday.com',
    category: 'productivity',
    status: 'disconnected',
    description: 'Sync boards and items from Monday.com workspaces',
    icon: 'Grid3X3',
    plan: 'pro',
    features: ['Board sync', 'Status tracking', 'Timeline integration', 'Pulse updates'],
    syncFrequency: 'hourly',
    dataTypes: ['projects', 'tasks', 'statuses', 'timelines']
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'productivity',
    status: 'connected',
    description: 'Import pages and databases from your Notion workspace',
    icon: 'FileText',
    plan: 'pro',
    features: ['Database sync', 'Page import', 'Block-level sync', 'Template sharing'],
    settings: {
      databaseIds: ['notion-db-1', 'notion-db-2'],
      syncBlocks: false,
      importPages: true
    },
    lastSync: '2025-09-12T06:15:00Z',
    connectedAt: '2025-09-05T16:00:00Z',
    syncFrequency: 'daily',
    dataTypes: ['content', 'databases', 'pages']
  },

  // Storage
  {
    id: 'google-drive',
    name: 'Google Drive',
    category: 'storage',
    status: 'connected',
    description: 'Store and manage project assets in Google Drive',
    icon: 'HardDrive',
    plan: 'free',
    features: ['File sync', 'Automatic backup', 'Shared folder access', 'Version control'],
    settings: {
      folderId: 'drive-folder-123',
      autoBackup: true,
      shareFiles: true,
      maxFileSize: '100MB'
    },
    lastSync: '2025-09-12T09:00:00Z',
    connectedAt: '2025-08-10T14:30:00Z',
    syncFrequency: 'realtime',
    dataTypes: ['files', 'documents', 'images'],
    permissions: ['drive.read', 'drive.write', 'drive.share']
  },
  {
    id: 'apple-cloud',
    name: 'iCloud Drive',
    category: 'storage',
    status: 'disconnected',
    description: 'Access and sync files from your iCloud Drive',
    icon: 'Cloud',
    plan: 'pro',
    features: ['File sync', 'Cross-device access', 'Automatic backup', 'Family sharing'],
    syncFrequency: 'daily',
    dataTypes: ['files', 'documents', 'media']
  },
  {
    id: 'microsoft-onedrive',
    name: 'OneDrive',
    category: 'storage',
    status: 'pending',
    description: 'Integrate with Microsoft OneDrive for file management',
    icon: 'HardDrive',
    plan: 'free',
    features: ['File sync', 'Office integration', 'Shared libraries', 'Version history'],
    syncFrequency: 'hourly',
    dataTypes: ['files', 'documents', 'office-files']
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    category: 'storage',
    status: 'disconnected',
    description: 'Connect your Dropbox for seamless file sharing',
    icon: 'Droplets',
    plan: 'free',
    features: ['File sync', 'Smart sync', 'File recovery', 'Team folders'],
    syncFrequency: 'realtime',
    dataTypes: ['files', 'documents', 'media']
  },

  // Communication
  {
    id: 'slack',
    name: 'Slack',
    category: 'communication',
    status: 'connected',
    description: 'Send notifications and updates to Slack channels',
    icon: 'MessageSquare',
    plan: 'free',
    features: ['Channel notifications', 'Direct messages', 'Task updates', 'Project alerts'],
    settings: {
      channels: ['#general', '#projects', '#notifications'],
      mentionUsers: true,
      taskUpdates: true
    },
    lastSync: '2025-09-12T09:15:00Z',
    connectedAt: '2025-08-25T12:00:00Z',
    syncFrequency: 'realtime',
    dataTypes: ['notifications', 'messages', 'updates']
  },
  {
    id: 'discord',
    name: 'Discord',
    category: 'communication',
    status: 'disconnected',
    description: 'Post updates and notifications to Discord servers',
    icon: 'MessageCircle',
    plan: 'pro',
    features: ['Server notifications', 'Webhook support', 'Role mentions', 'Embed messages'],
    syncFrequency: 'realtime',
    dataTypes: ['notifications', 'messages']
  },
  {
    id: 'microsoft-teams',
    name: 'Microsoft Teams',
    category: 'communication',
    status: 'error',
    description: 'Integrate with Teams for seamless collaboration',
    icon: 'Users',
    plan: 'enterprise',
    features: ['Team notifications', 'Meeting integration', 'File sharing', 'Chat sync'],
    lastSync: '2025-09-10T16:30:00Z',
    connectedAt: '2025-09-01T08:00:00Z',
    syncFrequency: 'hourly',
    dataTypes: ['notifications', 'meetings', 'files']
  },

  // Development
  {
    id: 'github',
    name: 'GitHub',
    category: 'development',
    status: 'connected',
    description: 'Link repositories and track issues with your projects',
    icon: 'Github',
    plan: 'free',
    features: ['Repository linking', 'Issue tracking', 'Pull request sync', 'Commit history'],
    settings: {
      repositories: ['user/repo1', 'user/repo2'],
      syncIssues: true,
      trackCommits: true,
      webhookUrl: 'https://api.droplog.com/webhooks/github'
    },
    lastSync: '2025-09-12T08:45:00Z',
    connectedAt: '2025-08-01T10:00:00Z',
    syncFrequency: 'realtime',
    dataTypes: ['repositories', 'issues', 'pull-requests', 'commits']
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    category: 'development',
    status: 'disconnected',
    description: 'Connect GitLab projects and manage merge requests',
    icon: 'GitBranch',
    plan: 'pro',
    features: ['Project sync', 'Issue management', 'Pipeline tracking', 'Merge requests'],
    syncFrequency: 'hourly',
    dataTypes: ['projects', 'issues', 'pipelines', 'merge-requests']
  },
  {
    id: 'jira',
    name: 'Jira',
    category: 'development',
    status: 'disconnected',
    description: 'Sync issues and epics from your Jira projects',
    icon: 'Bug',
    plan: 'enterprise',
    features: ['Issue sync', 'Epic tracking', 'Sprint integration', 'Status updates'],
    syncFrequency: 'daily',
    dataTypes: ['issues', 'epics', 'sprints', 'stories']
  },

  // Analytics
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    category: 'analytics',
    status: 'connected',
    description: 'Track project performance and website analytics',
    icon: 'BarChart3',
    plan: 'pro',
    features: ['Traffic tracking', 'Goal monitoring', 'Custom reports', 'Real-time data'],
    settings: {
      propertyId: 'GA-123456789',
      trackingGoals: ['conversions', 'engagement'],
      reportFrequency: 'weekly'
    },
    lastSync: '2025-09-12T07:00:00Z',
    connectedAt: '2025-08-15T09:30:00Z',
    syncFrequency: 'daily',
    dataTypes: ['analytics', 'reports', 'goals']
  },
  {
    id: 'hotjar',
    name: 'Hotjar',
    category: 'analytics',
    status: 'disconnected',
    description: 'Analyze user behavior with heatmaps and recordings',
    icon: 'Activity',
    plan: 'pro',
    features: ['Heatmaps', 'Session recordings', 'Feedback polls', 'Conversion funnels'],
    syncFrequency: 'daily',
    dataTypes: ['heatmaps', 'recordings', 'feedback']
  },

  // Automation
  {
    id: 'zapier',
    name: 'Zapier',
    category: 'automation',
    status: 'connected',
    description: 'Automate workflows with 5000+ app integrations',
    icon: 'Zap',
    plan: 'pro',
    features: ['Multi-step workflows', 'Conditional logic', 'Webhooks', 'Custom triggers'],
    settings: {
      activeZaps: 5,
      maxZaps: 20,
      webhookEndpoint: 'https://hooks.zapier.com/droplog'
    },
    lastSync: '2025-09-12T09:30:00Z',
    connectedAt: '2025-08-20T14:15:00Z',
    syncFrequency: 'realtime',
    dataTypes: ['triggers', 'actions', 'workflows']
  },
  {
    id: 'make',
    name: 'Make (Integromat)',
    category: 'automation',
    status: 'disconnected',
    description: 'Create advanced automation scenarios',
    icon: 'Settings2',
    plan: 'enterprise',
    features: ['Visual scenarios', 'Error handling', 'Data transformation', 'API connections'],
    syncFrequency: 'realtime',
    dataTypes: ['scenarios', 'modules', 'connections']
  },
  {
    id: 'webhooks',
    name: 'Custom Webhooks',
    category: 'automation',
    status: 'connected',
    description: 'Set up custom webhook endpoints for real-time integrations',
    icon: 'Webhook',
    plan: 'free',
    features: ['Custom endpoints', 'Event filtering', 'Retry logic', 'Payload transformation'],
    settings: {
      activeWebhooks: 3,
      maxWebhooks: 10
    },
    lastSync: '2025-09-12T09:45:00Z',
    connectedAt: '2025-08-01T10:00:00Z',
    syncFrequency: 'realtime',
    dataTypes: ['events', 'payloads', 'responses']
  }
]

// Webhooks dummy data
export const webhooks: Webhook[] = [
  {
    id: 'wh-1',
    name: 'Project Status Updates',
    url: 'https://hooks.example.com/project-updates',
    events: ['project.created', 'project.updated', 'project.completed'],
    status: 'active',
    secret: 'wh_secret_***',
    createdAt: '2025-08-15T10:00:00Z',
    lastTriggered: '2025-09-12T08:30:00Z',
    successCount: 245,
    errorCount: 3,
    description: 'Sends notifications when project status changes'
  },
  {
    id: 'wh-2',
    name: 'Task Assignments',
    url: 'https://hooks.example.com/task-assignments',
    events: ['task.assigned', 'task.completed', 'task.overdue'],
    status: 'active',
    secret: 'wh_secret_***',
    createdAt: '2025-08-20T14:30:00Z',
    lastTriggered: '2025-09-12T09:15:00Z',
    successCount: 156,
    errorCount: 0,
    description: 'Notifies external systems about task assignments and completions'
  },
  {
    id: 'wh-3',
    name: 'Asset Uploads',
    url: 'https://hooks.example.com/asset-uploads',
    events: ['asset.uploaded', 'asset.updated', 'asset.deleted'],
    status: 'error',
    createdAt: '2025-09-01T09:00:00Z',
    lastTriggered: '2025-09-10T15:45:00Z',
    successCount: 28,
    errorCount: 12,
    description: 'Triggers when project assets are modified'
  },
  {
    id: 'wh-4',
    name: 'Team Activity',
    url: 'https://hooks.example.com/team-activity',
    events: ['user.login', 'user.project_joined', 'user.task_created'],
    status: 'inactive',
    createdAt: '2025-07-10T12:00:00Z',
    successCount: 89,
    errorCount: 5,
    description: 'Tracks team member activities and engagement'
  }
]

// API Keys dummy data
export const apiKeys: ApiKey[] = [
  {
    id: 'api-1',
    name: 'Mobile App API',
    key: 'pk_live_51H***************',
    permissions: ['projects.read', 'tasks.read', 'tasks.write'],
    createdAt: '2025-08-01T10:00:00Z',
    lastUsed: '2025-09-12T08:45:00Z',
    status: 'active',
    usageCount: 15420
  },
  {
    id: 'api-2',
    name: 'Analytics Dashboard',
    key: 'pk_live_52G***************',
    permissions: ['analytics.read', 'projects.read'],
    createdAt: '2025-08-15T14:30:00Z',
    lastUsed: '2025-09-11T22:30:00Z',
    status: 'active',
    usageCount: 8934
  },
  {
    id: 'api-3',
    name: 'Automation Scripts',
    key: 'pk_live_53F***************',
    permissions: ['projects.write', 'tasks.write', 'webhooks.manage'],
    createdAt: '2025-07-20T09:15:00Z',
    lastUsed: '2025-09-05T16:20:00Z',
    status: 'inactive',
    expiresAt: '2025-12-20T09:15:00Z',
    usageCount: 2156
  },
  {
    id: 'api-4',
    name: 'Third-party Integration',
    key: 'pk_test_54H***************',
    permissions: ['projects.read', 'tasks.read'],
    createdAt: '2025-09-01T11:00:00Z',
    status: 'expired',
    expiresAt: '2025-09-10T11:00:00Z',
    usageCount: 45
  }
]