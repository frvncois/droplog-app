// components/projects/project-written-summary.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Bot, 
  FileText, 
  RefreshCw, 
  Copy,
  Download,
  Share
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

interface ProjectWrittenSummaryProps {
  project: Project
  tasks: Task[]
  assets: Asset[]
  content: Content[]
  team: TeamMember[]
}

export function ProjectWrittenSummary({ 
  project, 
  tasks, 
  assets, 
  content, 
  team 
}: ProjectWrittenSummaryProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)

  // Generate human-readable written summary
  const generateWrittenSummary = async () => {
    setIsGenerating(true)
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Analyze project data for written summary
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(t => t.status === 'completed').length
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length
    const overdueTasks = tasks.filter(t => {
      if (!t.dueDate) return false
      return new Date(t.dueDate) < new Date() && t.status !== 'completed'
    }).length

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    
    // Analyze team assignments
    const assignedTasks = tasks.filter(t => t.assignedTo)
    const activeTeamMembers = new Set(assignedTasks.map(t => t.assignedTo)).size

    // Analyze content status
    const approvedContent = content.filter(c => c.status === 'approved').length
    const draftContent = content.filter(c => c.status === 'draft').length

    // Analyze recent activity
    const recentDate = new Date()
    recentDate.setDate(recentDate.getDate() - 7)
    const recentActivity = [
      ...tasks.filter(t => new Date(t.dueDate || '2000-01-01') > recentDate),
      ...content.filter(c => new Date(c.updatedAt) > recentDate)
    ].length

    // Generate project status assessment
    let projectHealthPhrase = "progressing steadily"
    let urgencyPhrase = ""
    
    if (completionRate > 80) {
      projectHealthPhrase = "nearing completion with excellent momentum"
    } else if (completionRate > 60) {
      projectHealthPhrase = "making solid progress"
    } else if (completionRate < 30) {
      projectHealthPhrase = "in early stages of development"
    }

    if (overdueTasks > 0) {
      urgencyPhrase = overdueTasks === 1 
        ? " However, there is one overdue task that requires immediate attention."
        : ` However, there are ${overdueTasks} overdue tasks that need immediate attention.`
    }

    // Generate team assessment
    let teamPhrase = ""
    if (activeTeamMembers === 0) {
      teamPhrase = "The project currently has no assigned team members."
    } else if (activeTeamMembers === 1) {
      teamPhrase = "A single team member is actively working on tasks."
    } else {
      teamPhrase = `${activeTeamMembers} team members are actively contributing to the project.`
    }

    // Generate content assessment
    let contentPhrase = ""
    if (content.length === 0) {
      contentPhrase = "No content has been created yet for this project."
    } else {
      contentPhrase = `The project has ${content.length} content item${content.length === 1 ? '' : 's'}, with ${approvedContent} approved and ${draftContent} still in draft stage.`
    }

    // Generate asset assessment
    let assetPhrase = ""
    if (assets.length === 0) {
      assetPhrase = "No assets have been uploaded to support the project."
    } else {
      const assetTypes = [...new Set(assets.map(a => a.type))];
      assetPhrase = `The project includes ${assets.length} asset${assets.length === 1 ? '' : 's'} covering ${assetTypes.join(', ')} files.`
    }

    // Generate timeline assessment
    let timelinePhrase = ""
    const projectAge = Math.floor((new Date().getTime() - new Date(project.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    
    if (projectAge < 7) {
      timelinePhrase = "This is a newly created project."
    } else if (projectAge < 30) {
      timelinePhrase = `This project was initiated ${projectAge} days ago.`
    } else {
      timelinePhrase = `This project has been running for ${Math.floor(projectAge / 30)} month${Math.floor(projectAge / 30) === 1 ? '' : 's'}.`
    }

    // Generate priority tasks
    let priorityPhrase = ""
    const highPriorityTasks = tasks.filter(t => t.priority === 'high' && t.status !== 'completed')
    if (highPriorityTasks.length > 0) {
      priorityPhrase = ` There ${highPriorityTasks.length === 1 ? 'is' : 'are'} ${highPriorityTasks.length} high-priority task${highPriorityTasks.length === 1 ? '' : 's'} that ${highPriorityTasks.length === 1 ? 'requires' : 'require'} focus.`
    }

    // Generate recommendations
    let recommendations = ""
    const recommendationList = []
    
    if (overdueTasks > 0) {
      recommendationList.push("address overdue tasks immediately")
    }
    if (completionRate < 50 && totalTasks > 0) {
      recommendationList.push("accelerate task completion")
    }
    if (draftContent > approvedContent && content.length > 0) {
      recommendationList.push("review and approve pending content")
    }
    if (activeTeamMembers < team.length) {
      recommendationList.push("ensure all team members are actively engaged")
    }
    if (assets.length === 0 && completionRate > 30) {
      recommendationList.push("upload supporting documentation and assets")
    }

    if (recommendationList.length > 0) {
      if (recommendationList.length === 1) {
        recommendations = ` To maintain momentum, the team should ${recommendationList[0]}.`
      } else if (recommendationList.length === 2) {
        recommendations = ` To maintain momentum, the team should ${recommendationList[0]} and ${recommendationList[1]}.`
      } else {
        const lastRecommendation = recommendationList.pop()
        recommendations = ` To maintain momentum, the team should ${recommendationList.join(', ')}, and ${lastRecommendation}.`
      }
    }

    // Compile the complete written summary
    const writtenSummary = `
**${project.title}** is currently ${projectHealthPhrase} with ${completedTasks} out of ${totalTasks} tasks completed (${completionRate}% completion rate).${urgencyPhrase}

${timelinePhrase} The project status is marked as "${project.status}" and involves ${team.length} team member${team.length === 1 ? '' : 's'} in total. ${teamPhrase}${priorityPhrase}

${contentPhrase} ${assetPhrase}

${recentActivity > 0 ? `Recent activity shows ${recentActivity} update${recentActivity === 1 ? '' : 's'} in the past week, indicating active development.` : 'There has been limited activity in the past week.'} ${project.url ? `The project can be accessed at ${project.url}.` : ''}

**Current Focus:** The immediate priorities are ${inProgressTasks > 0 ? `completing the ${inProgressTasks} task${inProgressTasks === 1 ? '' : 's'} currently in progress` : 'initiating new tasks'} and maintaining the project's ${completionRate > 70 ? 'strong' : completionRate > 40 ? 'steady' : 'developing'} momentum.${recommendations}

**Overall Assessment:** This project ${completionRate > 80 ? 'is on track for successful completion' : completionRate > 50 ? 'shows positive progress toward its objectives' : 'is building foundation for future success'} and ${overdueTasks === 0 ? 'maintains good timeline adherence' : 'would benefit from timeline reassessment'}.
    `.trim()

    setSummary(writtenSummary)
    setIsGenerating(false)
  }

  const copyToClipboard = () => {
    if (summary) {
      navigator.clipboard.writeText(summary)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Project Summary
            </CardTitle>
            <CardDescription>
              Generate a comprehensive written overview of your project's current status and progress
            </CardDescription>
          </div>
          <Button 
            onClick={generateWrittenSummary} 
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Bot className="h-4 w-4" />
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
              Analyzing project data and writing comprehensive summary...
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <div className="my-4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
              <div className="my-4" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        )}

        {!summary && !isGenerating && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to create your project summary</h3>
            <p className="text-muted-foreground mb-4">
              Click "Generate Summary" to create a comprehensive written overview that analyzes your 
              project's progress, team performance, content status, and provides actionable insights.
            </p>
            <Badge variant="secondary" className="mb-4">
              <Bot className="h-3 w-3 mr-1" />
              AI-Powered Analysis
            </Badge>
          </div>
        )}

        {summary && (
          <div className="space-y-4">
            {/* Summary Actions */}
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Summary Generated
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {new Date().toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>

            {/* Written Summary Content */}
            <div className="prose prose-sm max-w-none">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="whitespace-pre-line text-gray-900 leading-relaxed">
                  {summary}
                </div>
              </div>
            </div>

            {/* Summary Footer */}
            <div className="text-xs text-muted-foreground pt-4 border-t">
              <p>
                This summary was automatically generated based on current project data including 
                {tasks.length} tasks, {content.length} content items, {assets.length} assets, 
                and {team.length} team members. For the most accurate insights, ensure all 
                project data is up to date.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}