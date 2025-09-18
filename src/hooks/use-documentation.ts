// src/hooks/use-documentation.ts
import { useState, useEffect } from 'react'
import { Documentation } from '@/lib/types'

interface UseDocumentationOptions {
  projectId?: string
  category?: string
  status?: Documentation['status']
  author?: string
}

interface UseDocumentationReturn {
  documentation: Documentation[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useDocumentation(options: UseDocumentationOptions = {}): UseDocumentationReturn {
  const [documentation, setDocumentation] = useState<Documentation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDocumentation = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await new Promise(resolve => setTimeout(resolve, 200))

      // TODO: Replace with actual API call with query params
      // const params = new URLSearchParams(options)
      // const response = await fetch(`/api/documentation?${params}`)
      // const data = await response.json()

      const { documentation: dummyDocumentation } = await import('@/lib/utils/dummy-data')
      
      let filteredDocumentation = dummyDocumentation

      // Apply filters
      if (options.projectId) {
        filteredDocumentation = filteredDocumentation.filter((doc: Documentation) => doc.projectId === options.projectId)
      }
      if (options.category) {
        filteredDocumentation = filteredDocumentation.filter((doc: Documentation) => doc.category === options.category)
      }
      if (options.status) {
        filteredDocumentation = filteredDocumentation.filter((doc: Documentation) => doc.status === options.status)
      }
      if (options.author) {
        filteredDocumentation = filteredDocumentation.filter((doc: Documentation) => doc.author === options.author)
      }

      setDocumentation(filteredDocumentation)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch documentation')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDocumentation()
  }, [options.projectId, options.category, options.status, options.author])

  return {
    documentation,
    isLoading,
    error,
    refetch: fetchDocumentation
  }
}

export function useDocumentationItem(id: string) {
  const { documentation, isLoading, error } = useDocumentation()
  const documentationItem = documentation.find((doc: Documentation) => doc.id === id)
  
  return {
    documentation: documentationItem,
    isLoading,
    error: documentationItem ? error : error || 'Documentation not found'
  }
}

export function useDocumentationByProject(projectId: string) {
  return useDocumentation({ projectId })
}

export function useDocumentationByCategory(category: string) {
  return useDocumentation({ category })
}