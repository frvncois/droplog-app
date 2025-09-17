// src/hooks/use-assets.ts
import { useState, useEffect } from 'react'
import { Asset } from '@/lib/types'

interface UseAssetsOptions {
  projectId?: string
  type?: Asset['type']
}

interface UseAssetsReturn {
  assets: Asset[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useAssets(options: UseAssetsOptions = {}): UseAssetsReturn {
  const [assets, setAssets] = useState<Asset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAssets = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      await new Promise(resolve => setTimeout(resolve, 250))
      
      // TODO: Replace with actual API call
      const { assets: dummyAssets } = await import('@/lib/utils/dummy-data')
      let filteredAssets = dummyAssets

      if (options.projectId) {
        filteredAssets = filteredAssets.filter(a => a.projectId === options.projectId)
      }
      if (options.type) {
        filteredAssets = filteredAssets.filter(a => a.type === options.type)
      }

      setAssets(filteredAssets)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch assets')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAssets()
  }, [options.projectId, options.type])

  return {
    assets,
    isLoading,
    error,
    refetch: fetchAssets
  }
}
