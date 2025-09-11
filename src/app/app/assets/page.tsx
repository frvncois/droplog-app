'use client'

import { useState, useMemo } from 'react'
import { AssetsHeader } from '@/components/assets/assets-header'
import { AssetsStats } from '@/components/assets/assets-stats'
import { AssetsGrid } from '@/components/assets/assets-grid'
import { UploadAssetModal } from '@/components/modals/upload-asset-modal'
import { assets, projects, team } from '@/lib/utils/dummy-data'

export default function AssetsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [projectFilter, setProjectFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  const filteredAssets = useMemo(() => {
    let filtered = assets.filter(asset => {
      const matchesSearch = asset.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = typeFilter === 'all' || asset.type === typeFilter
      const matchesProject = projectFilter === 'all' || asset.projectId === projectFilter
      
      return matchesSearch && matchesType && matchesProject
    })

    // Sort assets
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
        break
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'size':
        filtered.sort((a, b) => (b.size || 0) - (a.size || 0))
        break
      default:
        break
    }

    return filtered
  }, [assets, searchTerm, typeFilter, projectFilter, sortBy])

  const handleAssetUpload = (uploadedAssets: any[]) => {
    console.log('Assets uploaded:', uploadedAssets)
    // In a real app, this would update the assets list
    setUploadModalOpen(false)
  }

  const handleAssetUpdate = (updatedAsset: any) => {
    console.log('Asset updated:', updatedAsset)
    // In a real app, this would update the specific asset
  }

  const handleAssetDelete = (assetId: string) => {
    console.log('Asset deleted:', assetId)
    // In a real app, this would remove the asset from the list
  }

  return (
    <div className="space-y-6 p-6">
      <AssetsHeader 
        assets={assets}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        projectFilter={projectFilter}
        setProjectFilter={setProjectFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onUpload={() => setUploadModalOpen(true)}
      />
      
      <AssetsGrid 
        assets={filteredAssets}
        viewMode={viewMode}
        onAssetUpdate={handleAssetUpdate}
        onAssetDelete={handleAssetDelete}
      />

      <UploadAssetModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onAssetsUploaded={handleAssetUpload}
      />
    </div>
  )
}