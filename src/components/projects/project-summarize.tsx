// components/projects/project-summarize.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Bot, 
  Sparkles, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  FileText,
  Calendar,
  Target,
  Activity
} from 'lucide-react'

// Dummy data schemas matching the playbook
interface Project {
  id: string
  title: string
  url?: string
  status: 'active' | 'completed' | 'archived'
  createdAt: string
  updatedAt: string
  tasksCount: number
}

interface Task {
  id: string
  projectId: string
  title: string
  status: 'todo' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  assignedTo?: string
  dueDate?: string
  comments?: string[]
}

interface Asset {
  id: string
  projectId: string
  type: string
  title: string
  addedBy: string
  updatedAt: string
}

interface Content {
  id: string
  projectId: string
  title: string
  status: 'draft' | 'pending' | 'approved'
  createdAt: string
  updatedAt: string
  assignedTo?: string
}

interface TeamMember {
  id: string
  name: string
  role: string
  avatarUrl: string
}

interface ProjectSummarizeProps {
  projectId: string
  project: Project
  tasks: Task[]
  assets: Asset[]
  content: Content[]
  team: TeamMember[]
}

interface SummaryData {
  overview: {
    status: string
    health: 'healthy' | 'warning' | 'critical'
    completionRate: number
    timelineStatus: 'on-track' | 'delayed' | 'ahead'
  }
  tasks: {
    total: number
    completed: number
    inProgress: number
    overdue: number
    byPriority: Record<string, number>
  }
  team: {
    totalMembers: number
    activeContributors: number
    workloadDistribution: Record<string, number>
  }
  content: {
    total: number
    byStatus: Record<string, number>
    recentActivity: number
  }
  assets: {
    total: number
    byType: Record<string, number>
    recentUploads: number
  }
  insights: string[]
  recommendations: string[]
}

export function ProjectSummarize({ 
  projectId, 
  project, 
  tasks, 
  assets, 
  content, 
  team 
}: ProjectSummarizeProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [summary, setSummary] = useState<SummaryData | null>(null)

  // Generate AI summary based on project data
  const generateSummary = async () => {
    setIsGenerating(true)
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Analyze project data
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(t => t.status === 'completed').length
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length
    const overdueTasks = tasks.filter(t => {
      if (!t.dueDate) return false
      return new Date(t.dueDate) < new Date() && t.status !== 'completed'
    }).length

    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
    
    // Determine project health
    let health: 'healthy' | 'warning' | 'critical' = 'healthy'
    if (overdueTasks > 0 || completionRate < 50) health = 'warning'
    if (overdueTasks > 3 || completionRate < 30) health = 'critical'

    // Timeline status
    let timelineStatus: 'on-track' | 'delayed' | 'ahead' = 'on-track'
    if (overdueTasks > 0) timelineStatus = 'delayed'
    if (completionRate > 80) timelineStatus = 'ahead'

    // Task analysis
    const tasksByPriority = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Team analysis
    const assignedTasks = tasks.filter(t => t.assignedTo)
    const workloadDistribution = assignedTasks.reduce((acc, task) => {
      if (task.assignedTo) {
        acc[task.assignedTo] = (acc[task.assignedTo] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    // Content analysis
    const contentByStatus = content.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Assets analysis
    const assetsByType = assets.reduce((acc, asset) => {
      acc[asset.type] = (acc[asset.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Recent activity (last 7 days)
    const recentDate = new Date()
    recentDate.setDate(recentDate.getDate() - 7)
    
    const recentContentActivity = content.filter(c => 
      new Date(c.updatedAt) > recentDate
    ).length
    
    const recentAssetUploads = assets.filter(a => 
      new Date(a.updatedAt) > recentDate
    ).length

    // Generate insights
    const insights = []
    if (completionRate > 80) {
      insights.push(`Excellent progress! ${completionRate.toFixed(0)}% of tasks completed`)
    } else if (completionRate > 60) {
      insights.push(`Good momentum with ${completionRate.toFixed(0)}% completion rate`)
    } else {
      insights.push(`Project needs attention - only ${completionRate.toFixed(0)}% tasks completed`)
    }

    if (overdueTasks > 0) {
      insights.push(`${overdueTasks} tasks are overdue and need immediate attention`)
    }

    if (inProgressTasks > totalTasks * 0.5) {
      insights.push(`High workload: ${inProgressTasks} tasks currently in progress`)
    }

    if (recentContentActivity > 0) {
      insights.push(`Active content development: ${recentContentActivity} items updated recently`)
    }

    // Generate recommendations
    const recommendations = []
    if (overdueTasks > 0) {
      recommendations.push('Focus on completing overdue tasks to get back on track')
    }
    
    if (Object.keys(workloadDistribution).length < team.length) {
      recommendations.push('Consider distributing work more evenly among team members')
    }

    if (contentByStatus.draft > contentByStatus.approved) {
      recommendations.push('Review and approve pending content to maintain project momentum')
    }

    if (tasksByPriority.high > 0 && completionRate < 70) {
      recommendations.push('Prioritize high-priority tasks to ensure critical deliverables')
    }

    if (assets.length === 0) {
      recommendations.push('Upload project assets and documentation for better collaboration')
    }

    const summaryData: SummaryData = {
      overview: {
        status: project.status,
        health,
        completionRate,
        timelineStatus
      },
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        inProgress: inProgressTasks,
        overdue: overdueTasks,
        byPriority: tasksByPriority
      },
      team: {
        totalMembers: team.length,
        activeContributors: Object.keys(workloadDistribution).length,
        workloadDistribution
      },
      content: {
        total: content.length,
        byStatus: contentByStatus,
        recentActivity: recentContentActivity
      },
      assets: {
        total: assets.length,
        byType: assetsByType,
        recentUploads: recentAssetUploads
      },
      insights,
      recommendations
    }

    setSummary(summaryData)
    setIsGenerating(false)
  }

  // Health color mapping
  const healthColors = {
    healthy: 'text-green-600 bg-green-50 border-green-200',
    warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    critical: 'text-red-600 bg-red-50 border-red-200'
  }

  const healthIcons = {
    healthy: CheckCircle2,
    warning: AlertTriangle,
    critical: AlertTriangle
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Project Summary
            </CardTitle>
            <CardDescription>
              Get an intelligent overview of your project's status, progress, and recommendations
            </CardDescription>
          </div>
          <Button 
            onClick={generateSummary} 
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Summary
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {isGenerating && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Bot className="h-4 w-4" />
              Analyzing project data and generating insights...
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        )}

        {!summary && !isGenerating && (
          <div className="text-center py-8">
            <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to analyze your project</h3>
            <p className="text-muted-foreground mb-4">
              Click "Generate Summary" to get AI-powered insights about your project's status, 
              team performance, and actionable recommendations.
            </p>
          </div>
        )}

        {summary && (
          <div className="space-y-6">
            {/* Project Health Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className={`border ${healthColors[summary.overview.health]}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Project Health</p>
                      <p className="text-lg font-bold capitalize">{summary.overview.health}</p>
                    </div>
                    {(() => {
                      const Icon = healthIcons[summary.overview.health]
                      return <Icon className="h-8 w-8" />
                    })()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                      <p className="text-lg font-bold">{summary.overview.completionRate.toFixed(0)}%</p>
                    </div>
                    <Target className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <Progress value={summary.overview.completionRate} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Timeline Status</p>
                      <p className="text-lg font-bold capitalize">{summary.overview.timelineStatus}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Team</p>
                      <p className="text-lg font-bold">{summary.team.activeContributors}/{summary.team.totalMembers}</p>
                    </div>
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tasks Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Tasks Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{summary.tasks.completed}</p>
                        <p className="text-sm text-muted-foreground">Completed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{summary.tasks.inProgress}</p>
                        <p className="text-sm text-muted-foreground">In Progress</p>
                      </div>
                    </div>
                    
                    {summary.tasks.overdue > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-medium text-red-600">
                            {summary.tasks.overdue} overdue tasks
                          </span>
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-medium mb-2">Priority Distribution</p>
                      <div className="space-y-1">
                        {Object.entries(summary.tasks.byPriority).map(([priority, count]) => (
                          <div key={priority} className="flex justify-between text-sm">
                            <span className="capitalize">{priority}</span>
                            <Badge variant="secondary">{count}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Content & Assets */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Content & Assets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{summary.content.total}</p>
                        <p className="text-sm text-muted-foreground">Content Items</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{summary.assets.total}</p>
                        <p className="text-sm text-muted-foreground">Assets</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Content Status</p>
                      <div className="space-y-1">
                        {Object.entries(summary.content.byStatus).map(([status, count]) => (
                          <div key={status} className="flex justify-between text-sm">
                            <span className="capitalize">{status}</span>
                            <Badge variant="secondary">{count}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {summary.content.recentActivity > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-600">
                            {summary.content.recentActivity} items updated this week
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* AI Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Key Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {summary.insights.map((insight, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <Bot className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-900">{insight}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {summary.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <Sparkles className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-green-900">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Last Updated */}
            <div className="text-center text-sm text-muted-foreground">
              Summary generated on {new Date().toLocaleString()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}