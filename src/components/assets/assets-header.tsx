// components/assets/assets-header.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Search, Upload, Grid, List, Filter, SortAsc } from 'lucide-react'
import { AssetsHeaderProps } from '@/lib/types/assets'
import { projects } from '@/lib/utils/dummy-data'

export function AssetsHeader({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  projectFilter,
  setProjectFilter,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  onUpload,
}: AssetsHeaderProps) {
  const assetTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'image', label: 'Images' },
    { value: 'video', label: 'Videos' },
    { value: 'document', label: 'Documents' },
    { value: 'pdf', label: 'PDFs' },
    { value: 'audio', label: 'Audio' },
    { value: 'other', label: 'Other' },
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'alphabetical', label: 'A-Z' },
    { value: 'size', label: 'File Size' },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assets</h1>
          <p className="text-gray-600">Manage all your project assets</p>
        </div>
        <Button onClick={onUpload}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Assets
        </Button>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {assetTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Project Filter */}
          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <SortAsc className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                >
                  {option.label}
                  {sortBy === option.value && (
                    <Badge variant="secondary" className="ml-2">
                      Active
                    </Badge>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Mode */}
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {typeFilter !== 'all' && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Type: {assetTypes.find(t => t.value === typeFilter)?.label}
            <button
              onClick={() => setTypeFilter('all')}
              className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
            >
              ×
            </button>
          </Badge>
        )}
        {projectFilter !== 'all' && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Project: {projects.find(p => p.id === projectFilter)?.title}
            <button
              onClick={() => setProjectFilter('all')}
              className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
            >
              ×
            </button>
          </Badge>
        )}
        {searchTerm && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Search: "{searchTerm}"
            <button
              onClick={() => setSearchTerm('')}
              className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
            >
              ×
            </button>
          </Badge>
        )}
      </div>
    </div>
  )
}