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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Grid3X3, 
  List,
  Download,
  MoreHorizontal,
  FileText,
  BookOpen
} from 'lucide-react'

interface DocumentationHeaderProps {
  documentation: any[]
  searchTerm: string
  setSearchTerm: (term: string) => void
  categoryFilter: string
  setCategoryFilter: (filter: string) => void
  statusFilter: string
  setStatusFilter: (filter: string) => void
  typeFilter: string
  setTypeFilter: (filter: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
  viewMode: 'grid' | 'list'
  setViewMode: (mode: 'grid' | 'list') => void
  onCreateDocument: () => void
}

export function DocumentationHeader({
  documentation,
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  onCreateDocument
}: DocumentationHeaderProps) {
  const totalDocs = documentation.length
  const publishedDocs = documentation.filter(d => d.status === 'published').length
  const draftDocs = documentation.filter(d => d.status === 'draft').length

  // Get unique categories and types for filters
  const categories = Array.from(new Set(documentation.map(d => d.category)))
  const types = Array.from(new Set(documentation.map(d => d.type)))

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Documentation</h1>
              <p className="text-muted-foreground">
                Knowledge base and project documentation
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
          <Button onClick={onCreateDocument}>
            <Plus className="h-4 w-4 mr-2" />
            New Document
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="flex items-center gap-4">
        <Badge variant="secondary" className="py-1 px-3">
          {totalDocs} Documents
        </Badge>
        <Badge variant="outline" className="py-1 px-3">
          {publishedDocs} Published
        </Badge>
        <Badge variant="outline" className="py-1 px-3">
          {draftDocs} Drafts
        </Badge>
        <Badge variant="outline" className="py-1 px-3">
          {documentation.filter(d => d.status === 'review').length} In Review
        </Badge>
      </div>

      {/* Filters and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search documentation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="review">In Review</SelectItem>
            </SelectContent>
          </Select>

          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort by
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={sortBy === 'newest'}
                onCheckedChange={() => setSortBy('newest')}
              >
                Newest
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortBy === 'oldest'}
                onCheckedChange={() => setSortBy('oldest')}
              >
                Oldest
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortBy === 'alphabetical'}
                onCheckedChange={() => setSortBy('alphabetical')}
              >
                Alphabetical
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortBy === 'popular'}
                onCheckedChange={() => setSortBy('popular')}
              >
                Most Read
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Mode Toggle */}
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
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

          {/* More Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem>
                Show Word Count
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                Show Read Time
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                Show Author Info
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}