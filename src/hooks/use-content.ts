// src/hooks/use-content.ts
import { useState, useEffect } from 'react'
import { Content } from '@/lib/types'

interface UseContentOptions {
  projectId?: string
  status?: Content['status']
  type?: Content['type']
  assignedTo?: string
}

interface UseContentReturn {
  content: Content[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useContent(options: UseContentOptions = {}): UseContentReturn {
  const [content, setContent] = useState<Content[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContent = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await new Promise(resolve => setTimeout(resolve, 200))

      // TODO: Replace with actual API call with query params
      // const params = new URLSearchParams(options)
      // const response = await fetch(`/api/content?${params}`)
      // const data = await response.json()

      const { content: dummyContent } = await import('@/lib/utils/dummy-data')
      
      let filteredContent = dummyContent

      // Apply filters
      if (options.projectId) {
        filteredContent = filteredContent.filter(c => c.projectId === options.projectId)
      }
      if (options.status) {
        filteredContent = filteredContent.filter(c => c.status === options.status)
      }
      if (options.type) {
        filteredContent = filteredContent.filter(c => c.type === options.type)
      }
      if (options.assignedTo) {
        filteredContent = filteredContent.filter(c => c.assignedTo === options.assignedTo)
      }

      setContent(filteredContent)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch content')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchContent()
  }, [options.projectId, options.status, options.type, options.assignedTo])

  return {
    content,
    isLoading,
    error,
    refetch: fetchContent
  }
}

export function useContentItem(id: string) {
  const { content, isLoading, error } = useContent()
  const contentItem = content.find(c => c.id === id)
  
  return {
    content: contentItem,
    isLoading,
    error: contentItem ? error : error || 'Content not found'
  }
}

export function useContentByProject(projectId: string) {
  return useContent({ projectId })
}

export function useContentByStatus(status: Content['status']) {
  return useContent({ status })
}