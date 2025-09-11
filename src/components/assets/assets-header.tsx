'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Upload, 
  Search, 
  Filter, 
  Plug,
  Bell,
  Users,
  Plus,
  Settings,
  ArrowUpDown, 
  Grid3X3, 
  List,
  Download,
  MoreHorizontal 
} from 'lucide-react'
import { projects } from '@/lib/utils/dummy-data'

interface AssetsHeaderProps {
  assets: any[]
  searchTerm: string
  setSearchTerm: (term: string) => void
  typeFilter: string
  setTypeFilter: (filter: string) => void
  projectFilter: string
  setProjectFilter: (filter: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
  viewMode: 'grid' | 'list'
  setViewMode: (mode: 'grid' | 'list') => void
  onUpload: () => void
}

export function AssetsHeader({
  assets,
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
  onUpload
}: AssetsHeaderProps) {
  const totalAssets = assets.length
  const totalSize = assets.reduce((acc, asset) => acc + (asset.size || 0), 0)
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-0">
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-semibold tracking-tight">Assets</h1>
            </div>
            <p className="text-muted-foreground text-sm max-w-2xl">
              Manage and organize all your projects assets
            </p>
          </div>
          <div className="space-y-0">
          <div className="flex items-center space-x-2">
            <Button variant="default" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Upload assets
            </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Assets settings</DropdownMenuLabel>
              <DropdownMenuSeparator/>
              <DropdownMenuItem>
                <Plug className="mr-2 h-4 w-4" />
                Integrations
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                Authorizations
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
          </div>
        </div>
      </div>
  )
}