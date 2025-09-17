// src/hooks/use-tasks.ts
import { useState, useEffect } from 'react'
import { Task } from '@/lib/types'

interface UseTasksOptions {
  projectId?: string
  assignedTo?: string
  status?: Task['status']
}

interface UseTasksReturn {
  tasks: Task[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useTasks(options: UseTasksOptions = {}): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // TODO: Replace with actual API call with query params
      // const params = new URLSearchParams(options)
      // const response = await fetch(`/api/tasks?${params}`)
      // const data = await response.json()
      
      const { tasks: dummyTasks } = await import('@/lib/utils/dummy-data')
      let filteredTasks = dummyTasks

      // Apply filters
      if (options.projectId) {
        filteredTasks = filteredTasks.filter(t => t.projectId === options.projectId)
      }
      if (options.assignedTo) {
        filteredTasks = filteredTasks.filter(t => t.assignedTo === options.assignedTo)
      }
      if (options.status) {
        filteredTasks = filteredTasks.filter(t => t.status === options.status)
      }

      setTasks(filteredTasks)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [options.projectId, options.assignedTo, options.status])

  return {
    tasks,
    isLoading,
    error,
    refetch: fetchTasks
  }
}