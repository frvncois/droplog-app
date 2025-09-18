// hooks/use-activities.ts
import { useState, useEffect } from 'react'
import { Activity } from '@/lib/types'

interface UseActivitiesOptions {
  projectId?: string
  limit?: number
  types?: Activity['type'][]
}

interface UseActivitiesReturn {
  activities: Activity[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useActivities(options: UseActivitiesOptions = {}): UseActivitiesReturn {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchActivities = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/activities?projectId=${options.projectId}&limit=${options.limit}`)
      // const data = await response.json()
      
      // Mock activities data following the Activity type
      const mockActivities: Activity[] = [
        {
          id: "act1",
          type: "task_completed",
          entityId: "t1",
          entityType: "task",
          userId: "u1",
          timestamp: "2025-09-17T08:30:00Z",
          description: "Task completed",
          metadata: {
            taskTitle: "Fix homepage header",
            userName: "Alice Johnson"
          }
        },
        {
          id: "act2", 
          type: "asset_uploaded",
          entityId: "a1",
          entityType: "asset",
          userId: "u2",
          timestamp: "2025-09-16T16:45:00Z",
          description: "Asset uploaded",
          metadata: {
            assetTitle: "Hero Banner Image",
            userName: "Bob Smith",
            assetType: "image"
          }
        },
        {
          id: "act3",
          type: "project_created",
          entityId: options.projectId || "p1",
          entityType: "project", 
          userId: "u3",
          timestamp: "2025-09-15T14:20:00Z",
          description: "Project created",
          metadata: {
            projectTitle: "Marketing Website",
            userName: "Carol Davis"
          }
        },
        {
          id: "act4",
          type: "member_added",
          entityId: "u4",
          entityType: "project",
          userId: "u1",
          timestamp: "2025-09-14T10:15:00Z", 
          description: "Team member added",
          metadata: {
            memberName: "David Wilson",
            userName: "Alice Johnson",
            role: "Developer"
          }
        },
        {
          id: "act5",
          type: "comment_added",
          entityId: "t2",
          entityType: "task",
          userId: "u2",
          timestamp: "2025-09-13T09:30:00Z",
          description: "Comment added",
          metadata: {
            taskTitle: "Update footer links",
            userName: "Bob Smith",
            comment: "Design looks good, ready for review"
          }
        }
      ]

      let filteredActivities = mockActivities

      // Apply project filter
      if (options.projectId) {
        filteredActivities = filteredActivities.filter(activity => {
          // Include activities that are directly related to the project
          // or activities where the entity belongs to the project
          return activity.entityId === options.projectId ||
            activity.metadata?.projectId === options.projectId ||
            // For project-specific entities, we assume they belong to the project
            (activity.entityType !== 'project' && activity.entityType !== 'comment')
        })
      }

      // Apply type filter
      if (options.types && options.types.length > 0) {
        filteredActivities = filteredActivities.filter(activity =>
          options.types!.includes(activity.type)
        )
      }

      // Apply limit
      if (options.limit) {
        filteredActivities = filteredActivities.slice(0, options.limit)
      }

      // Sort by timestamp (newest first)
      filteredActivities.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )

      setActivities(filteredActivities)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activities')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [options.projectId, options.limit, options.types?.join(',')])

  return {
    activities,
    isLoading,
    error,
    refetch: fetchActivities
  }
}