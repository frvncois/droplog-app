// lib/types/assets.ts

export interface Asset {
  id: string
  projectId: string
  type: 'image' | 'video' | 'document' | 'pdf' | 'audio' | 'other'
  title: string
  fileName?: string
  fileUrl?: string
  size?: number // File size in bytes
  addedBy: string
  updatedAt: string
  createdAt?: string
  description?: string
  tags?: string[]
}

export interface AssetWithProject extends Asset {
  project?: {
    id: string
    title: string
    status: string
  }
}

// Component Props Interfaces
export interface AssetsHeaderProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  typeFilter: string
  setTypeFilter: (type: string) => void
  projectFilter: string
  setProjectFilter: (project: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
  viewMode: 'grid' | 'list'
  setViewMode: (mode: 'grid' | 'list') => void
  onUpload: () => void
}

export interface AssetsGridProps {
  assets: Asset[]
  viewMode: 'grid' | 'list'
  onAssetUpdate: (asset: Asset) => void
  onAssetDelete: (assetId: string) => void
}

export interface UploadAssetModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpload: (assets: any[]) => void
}