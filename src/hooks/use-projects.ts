// src/hooks/use-projects.ts
import { useState, useEffect } from 'react'
import { Project } from '@/lib/types'

interface UseProjectsReturn {
  projects: Project[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Simulate API call delay for realistic loading states
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/projects')
      // const data = await response.json()
      
      // For now, import dummy data here
      const { projects: dummyProjects } = await import('@/lib/utils/dummy-data')
      setProjects(dummyProjects)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return {
    projects,
    isLoading,
    error,
    refetch: fetchProjects
  }
}

export function useProject(id: string) {
  const { projects, isLoading, error } = useProjects()
  const project = projects.find(p => p.id === id)
  
  return {
    project,
    isLoading,
    error: project ? error : error || 'Project not found'
  }
}

export function useActiveProjects() {
  const { projects, isLoading, error } = useProjects()
  const activeProjects = projects.filter(p => p.status === 'active')
  
  return {
    projects: activeProjects,
    isLoading,
    error
  }
}