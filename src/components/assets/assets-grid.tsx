// components/assets/assets-grid.tsx
'use client'

import { useState, useMemo } from 'react'
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger, 
  DropdownMenuItem,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu'
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { 
  IconFileText, 
  IconPhoto, 
  IconVideo, 
  IconFileZip, 
  IconDownload, 
  IconEdit, 
  IconTrash, 
  IconEye, 
  IconDotsVertical,
  IconUpload,
  IconFilter,
  IconSearch,
  IconLayoutGrid,
  IconList,
  IconGripVertical,
  IconUser,
  IconCalendar,
  IconFolder
} from '@tabler/icons-react'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'

// Types based on Droplog playbook
interface Asset {
  id: string
  projectId: string
  type: 'image' | 'video' | 'pdf' | 'document' | 'archive' | 'other'
  title: string
  fileName: string
  fileSize: string
  addedBy: string
  assignedTo?: string
  updatedAt: string
  createdAt: string
  description?: string
  tags?: string[]
  url?: string
}

interface TeamMember {
  id: string
  name: string
  role: string
  avatarUrl?: string
}

// Dummy data following camelCase naming convention
const dummyAssets: Asset[] = [
  {
    id: "a1",
    projectId: "p1",
    type: "image",
    title: "Hero Banner",
    fileName: "hero-banner.jpg",
    fileSize: "2.4 MB",
    addedBy: "u2",
    assignedTo: "u1",
    updatedAt: "2025-09-08T15:00:00Z",
    createdAt: "2025-09-08T15:00:00Z",
    description: "Main homepage hero banner image",
    tags: ["homepage", "banner", "hero"]
  },
  {
    id: "a2",
    projectId: "p1",
    type: "video",
    title: "Product Demo",
    fileName: "product-demo.mp4",
    fileSize: "45.2 MB",
    addedBy: "u3",
    updatedAt: "2025-09-09T10:30:00Z",
    createdAt: "2025-09-09T10:30:00Z",
    description: "Product demonstration video for marketing",
    tags: ["demo", "marketing", "product"]
  },
  {
    id: "a3",
    projectId: "p1",
    type: "pdf",
    title: "Design Guidelines",
    fileName: "design-guidelines.pdf",
    fileSize: "1.8 MB",
    addedBy: "u1",
    assignedTo: "u2",
    updatedAt: "2025-09-07T14:20:00Z",
    createdAt: "2025-09-07T14:20:00Z",
    description: "Brand and design guidelines document",
    tags: ["design", "guidelines", "brand"]
  },
  {
    id: "a4",
    projectId: "p2",
    type: "document",
    title: "API Documentation",
    fileName: "api-docs.docx",
    fileSize: "856 KB",
    addedBy: "u4",
    updatedAt: "2025-09-06T09:15:00Z",
    createdAt: "2025-09-06T09:15:00Z",
    description: "Complete API documentation for developers",
    tags: ["api", "documentation", "development"]
  },
  {
    id: "a5",
    projectId: "p1",
    type: "archive",
    title: "Asset Bundle",
    fileName: "assets-bundle.zip",
    fileSize: "12.3 MB",
    addedBy: "u2",
    updatedAt: "2025-09-05T16:45:00Z",
    createdAt: "2025-09-05T16:45:00Z",
    description: "Complete asset bundle for Q3 release",
    tags: ["bundle", "assets", "release"]
  },
  {
    id: "a6",
    projectId: "p2",
    type: "image",
    title: "Logo Variations",
    fileName: "logo-variations.png",
    fileSize: "3.1 MB",
    addedBy: "u1",
    assignedTo: "u3",
    updatedAt: "2025-09-04T11:00:00Z",
    createdAt: "2025-09-04T11:00:00Z",
    description: "Various logo formats and sizes",
    tags: ["logo", "branding", "identity"]
  }
]

const dummyTeam: TeamMember[] = [
  { id: "u1", name: "Alice Johnson", role: "Designer", avatarUrl: "/avatars/alice.png" },
  { id: "u2", name: "Bob Smith", role: "Developer", avatarUrl: "/avatars/bob.png" },
  { id: "u3", name: "Carol Wilson", role: "Project Manager", avatarUrl: "/avatars/carol.png" },
  { id: "u4", name: "David Kim", role: "Content Writer", avatarUrl: "/avatars/david.png" }
]

interface AssetsGridProps {
  projectId?: string
  showProjectFilter?: boolean
  onAssetUpdated?: (asset: Asset) => void
  onAssetDeleted?: (assetId: string) => void
}

// Drag Handle Component (following your pattern)
function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

// Draggable Row Component (following your pattern)
function DraggableRow({ 
  asset, 
  onView, 
  onEdit, 
  onDelete, 
  onDownload,
  getTeamMember 
}: {
  asset: Asset
  onView: (asset: Asset) => void
  onEdit: (asset: Asset) => void
  onDelete: (assetId: string) => void
  onDownload: (asset: Asset) => void
  getTeamMember: (userId: string) => TeamMember | undefined
}) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: asset.id,
  })

  const getFileIcon = (type: Asset['type']) => {
    switch (type) {
      case 'image': return IconPhoto
      case 'video': return IconVideo
      case 'pdf': return IconFileText
      case 'document': return IconFileText
      case 'archive': return IconFileZip
      default: return IconFileText
    }
  }

  const getFileTypeColor = (type: Asset['type']) => {
    switch (type) {
      case 'image': return 'text-blue-600'
      case 'video': return 'text-purple-600'
      case 'pdf': return 'text-red-600'
      case 'document': return 'text-green-600'
      case 'archive': return 'text-orange-600'
      default: return 'text-gray-600'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (error) {
      return 'Unknown'
    }
  }

  const FileIcon = getFileIcon(asset.type)
  const addedByMember = getTeamMember(asset.addedBy)
  const assignedToMember = asset.assignedTo ? getTeamMember(asset.assignedTo) : null

  return (
    <TableRow
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {/* Drag Handle */}
      <TableCell>
        <DragHandle id={asset.id} />
      </TableCell>

      {/* Asset */}
      <TableCell>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg bg-gray-100 ${getFileTypeColor(asset.type)}`}>
            <FileIcon className="size-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div 
              className="font-medium truncate hover:text-blue-600 cursor-pointer"
              onClick={() => onView(asset)}
            >
              {asset.title}
            </div>
            <div className="text-sm text-gray-500 truncate">{asset.fileName}</div>
          </div>
        </div>
      </TableCell>

      {/* Type */}
      <TableCell>
        <Badge variant="outline" className="text-xs">
          {asset.type}
        </Badge>
      </TableCell>

      {/* Size */}
      <TableCell>
        <span className="text-sm text-gray-600">{asset.fileSize}</span>
      </TableCell>

      {/* Added By */}
      <TableCell>
        <div className="flex items-center space-x-2">
          {addedByMember && (
            <>
              <Avatar className="size-6">
                <AvatarImage src={addedByMember.avatarUrl} />
                <AvatarFallback className="text-xs">
                  {addedByMember.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600 truncate">{addedByMember.name}</span>
            </>
          )}
        </div>
      </TableCell>

      {/* Assigned To */}
      <TableCell>
        {assignedToMember ? (
          <div className="flex items-center space-x-2">
            <Avatar className="size-6">
              <AvatarImage src={assignedToMember.avatarUrl} />
              <AvatarFallback className="text-xs">
                {assignedToMember.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600 truncate">{assignedToMember.name}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">Unassigned</span>
        )}
      </TableCell>

      {/* Updated */}
      <TableCell>
        <div className="flex items-center text-sm text-gray-500">
          <IconCalendar className="size-4 mr-1" />
          {formatTimeAgo(asset.updatedAt)}
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <IconDotsVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(asset)}>
              <IconEye className="size-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDownload(asset)}>
              <IconDownload className="size-4 mr-2" />
              Download
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(asset)}>
              <IconEdit className="size-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(asset.id)}
              className="text-red-600"
            >
              <IconTrash className="size-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}

// Asset View Modal Component
function AssetViewModal({ 
  asset, 
  onEdit,
  getTeamMember 
}: { 
  asset: Asset
  onEdit: (asset: Asset) => void
  getTeamMember: (userId: string) => TeamMember | undefined
}) {
  const getFileIcon = (type: Asset['type']) => {
    switch (type) {
      case 'image': return IconPhoto
      case 'video': return IconVideo
      case 'pdf': return IconFileText
      case 'document': return IconFileText
      case 'archive': return IconFileZip
      default: return IconFileText
    }
  }

  const FileIcon = getFileIcon(asset.type)
  const addedByMember = getTeamMember(asset.addedBy)
  const assignedToMember = asset.assignedTo ? getTeamMember(asset.assignedTo) : null

  return (
    <div className="space-y-6 py-4">
      {/* Asset Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
          <FileIcon className="size-6 text-gray-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{asset.title}</h3>
          <p className="text-sm text-gray-500">{asset.fileName}</p>
        </div>
        <Badge variant="outline" className="capitalize">
          {asset.type}
        </Badge>
      </div>

      {/* Asset Details Grid */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700">File Size</Label>
            <p className="text-sm text-gray-900 mt-1">{asset.fileSize}</p>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-700">Added By</Label>
            <div className="flex items-center gap-4 mt-1">
              {addedByMember && (
                <>
                  <Avatar className="size-6">
                    <AvatarImage src={addedByMember.avatarUrl} />
                    <AvatarFallback className="text-xs">
                      {addedByMember.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-900">{addedByMember.name}</span>
                </>
              )}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">Assigned To</Label>
            <div className="flex items-center gap-4 mt-1">
              {assignedToMember ? (
                <>
                  <Avatar className="size-6">
                    <AvatarImage src={assignedToMember.avatarUrl} />
                    <AvatarFallback className="text-xs">
                      {assignedToMember.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-900">{assignedToMember.name}</span>
                </>
              ) : (
                <span className="text-sm text-gray-500">Unassigned</span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700">Created</Label>
            <p className="text-sm text-gray-900 mt-1">
              {formatDistanceToNow(new Date(asset.createdAt), { addSuffix: true })}
            </p>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-700">Last Updated</Label>
            <p className="text-sm text-gray-900 mt-1">
              {formatDistanceToNow(new Date(asset.updatedAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      {asset.description && (
        <div>
          <Label className="text-sm font-medium text-gray-700">Description</Label>
          <p className="text-sm text-gray-900 mt-1">{asset.description}</p>
        </div>
      )}

      {/* Tags */}
      {asset.tags && asset.tags.length > 0 && (
        <div>
          <Label className="text-sm font-medium text-gray-700">Tags</Label>
          <div className="flex gap-1 mt-1 flex-wrap">
            {asset.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4 border-t">
        <Button>
          <IconDownload className="size-4 mr-2" />
          Download
        </Button>
        <Button variant="outline" onClick={() => onEdit(asset)}>
          <IconEdit className="size-4 mr-2" />
          Edit Asset
        </Button>
      </div>
    </div>
  )
}

// Asset Edit Form Component
function AssetEditForm({ 
  asset, 
  onAssetUpdated, 
  onClose,
  getTeamMember 
}: { 
  asset: Asset
  onAssetUpdated: (asset: Asset) => void
  onClose: () => void
  getTeamMember: (userId: string) => TeamMember | undefined
}) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: asset.title,
    description: asset.description || '',
    assignedTo: asset.assignedTo || 'none',
    tags: asset.tags?.join(', ') || ''
  })

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // In real implementation, this would call an API
      const updatedAsset = {
        ...asset,
        title: formData.title,
        description: formData.description || undefined,
        assignedTo: formData.assignedTo === 'none' ? undefined : formData.assignedTo,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : undefined,
        updatedAt: new Date().toISOString()
      }
      
      onAssetUpdated(updatedAsset)
      toast.success('Asset updated successfully')
      onClose()
    } catch (error) {
      toast.error('Failed to update asset')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Asset title"
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Asset description (optional)"
            rows={3}
          />
        </div>
        
        <div>
          <Label htmlFor="assignedTo">Assigned To</Label>
          <Select value={formData.assignedTo} onValueChange={(value) => setFormData(prev => ({ ...prev, assignedTo: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Unassigned</SelectItem>
              {dummyTeam.map(member => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
            placeholder="Enter tags separated by commas"
          />
          <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
        </div>
      </div>

      <div className="flex gap-4 pt-4 border-t">
        <Button onClick={handleSubmit} disabled={loading || !formData.title.trim()}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

export function AssetsGrid({ projectId, showProjectFilter = false, onAssetUpdated, onAssetDeleted }: AssetsGridProps) {
  const [data, setData] = useState(dummyAssets)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('recent')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table')
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [viewSheetOpen, setViewSheetOpen] = useState(false)
  const [editSheetOpen, setEditSheetOpen] = useState(false)

  // Sensors for drag and drop (following your pattern)
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  )

  // Filter and sort assets
  const filteredAssets = useMemo(() => {
    let assets = projectId 
      ? data.filter(asset => asset.projectId === projectId)
      : data

    // Apply search filter
    if (searchTerm) {
      assets = assets.filter(asset =>
        asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      assets = assets.filter(asset => asset.type === typeFilter)
    }

    // Apply assignee filter
    if (assigneeFilter !== 'all') {
      assets = assets.filter(asset => asset.assignedTo === assigneeFilter)
    }

    // Apply sorting
    switch (sortBy) {
      case 'recent':
        return assets.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      case 'oldest':
        return assets.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
      case 'alphabetical':
        return assets.sort((a, b) => a.title.localeCompare(b.title))
      case 'size':
        return assets.sort((a, b) => parseFloat(b.fileSize) - parseFloat(a.fileSize))
      default:
        return assets
    }
  }, [data, searchTerm, typeFilter, assigneeFilter, sortBy, projectId])

  const dataIds = useMemo(() => filteredAssets.map(asset => asset.id), [filteredAssets])

  const getTeamMember = (userId: string) => {
    return dummyTeam.find(member => member.id === userId)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id as string)
        const newIndex = dataIds.indexOf(over.id as string)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  const handleView = (asset: Asset) => {
    setSelectedAsset(asset)
    setViewSheetOpen(true)
  }

  const handleEdit = (asset: Asset) => {
    setSelectedAsset(asset)
    setEditSheetOpen(true)
  }

  const handleDelete = (assetId: string) => {
    setData(prev => prev.filter(asset => asset.id !== assetId))
    toast.success('Asset deleted successfully')
    onAssetDeleted?.(assetId)
  }

  const handleDownload = (asset: Asset) => {
    // In real implementation, this would trigger file download
    toast.success(`Downloading ${asset.fileName}`)
  }

  const handleAssetUpdated = (updatedAsset: Asset) => {
    setData(prev => prev.map(asset => 
      asset.id === updatedAsset.id ? updatedAsset : asset
    ))
    onAssetUpdated?.(updatedAsset)
  }

  // Asset type counts for tabs
  const imagesCount = filteredAssets.filter(a => a.type === 'image').length
  const videosCount = filteredAssets.filter(a => a.type === 'video').length
  const documentsCount = filteredAssets.filter(a => a.type === 'pdf' || a.type === 'document').length
  const archivesCount = filteredAssets.filter(a => a.type === 'archive').length

  if (filteredAssets.length === 0 && (searchTerm || typeFilter !== 'all' || assigneeFilter !== 'all')) {
    return (
      <div className="space-y-6">

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
            <Input
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="pdf">PDFs</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
              <SelectItem value="archive">Archives</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignees</SelectItem>
              {dummyTeam.map(member => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Empty State */}
        <Card>
          <CardContent className="text-center py-12">
            <IconFileText className="size-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your filters or search terms
            </p>
            <Button onClick={() => {
              setSearchTerm('')
              setTypeFilter('all')
              setAssigneeFilter('all')
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (filteredAssets.length === 0) {
    return (
      <div className="space-y-6">
        {/* Empty State */}
        <Card>
          <CardContent className="text-center py-12">
            <IconFileText className="size-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assets yet</h3>
            <p className="text-gray-500 mb-4">
              Upload your first asset to get started
            </p>
            <Button>
              <IconUpload className="size-4 mr-2" />
              Upload Assets
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">

        {/* Tabs and Controls */}
        <Tabs defaultValue="all" className="w-full">
          <div className="flex items-center justify-between">
            {/* Filter Tabs */}
            <TabsList className="hidden md:flex">
              <TabsTrigger value="all">
                All Assets ({filteredAssets.length})
              </TabsTrigger>
              <TabsTrigger value="images">
                Images <Badge variant="secondary" className="ml-1">{imagesCount}</Badge>
              </TabsTrigger>
              <TabsTrigger value="videos">
                Videos <Badge variant="secondary" className="ml-1">{videosCount}</Badge>
              </TabsTrigger>
              <TabsTrigger value="documents">
                Documents <Badge variant="secondary" className="ml-1">{documentsCount}</Badge>
              </TabsTrigger>
              <TabsTrigger value="archives">
                Archives <Badge variant="secondary" className="ml-1">{archivesCount}</Badge>
              </TabsTrigger>
            </TabsList>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
                <Input
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              
              <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignees</SelectItem>
                  {dummyTeam.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                  <SelectItem value="size">File Size</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <IconLayoutGrid className="size-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                <IconList className="size-4" />
              </Button>
            </div>
          </div>

          {/* All Assets Tab */}
          <TabsContent value="all" className="relative flex flex-col gap-4 overflow-auto">
            {viewMode === 'table' ? (
              <div className="overflow-hidden rounded-lg border">
                <DndContext
                  collisionDetection={closestCenter}
                  modifiers={[restrictToVerticalAxis]}
                  onDragEnd={handleDragEnd}
                  sensors={sensors}
                >
                  <Table>
                    <TableHeader className="bg-muted sticky top-0 z-10">
                      <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Asset</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Added By</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <SortableContext
                        items={dataIds}
                        strategy={verticalListSortingStrategy}
                      >
                        {filteredAssets.map((asset) => (
                          <DraggableRow
                            key={asset.id}
                            asset={asset}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onDownload={handleDownload}
                            getTeamMember={getTeamMember}
                          />
                        ))}
                      </SortableContext>
                    </TableBody>
                  </Table>
                </DndContext>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredAssets.map((asset) => {
                  const FileIcon = (() => {
                    switch (asset.type) {
                      case 'image': return IconPhoto
                      case 'video': return IconVideo
                      case 'pdf': return IconFileText
                      case 'document': return IconFileText
                      case 'archive': return IconFileZip
                      default: return IconFileText
                    }
                  })()
                  
                  const addedByMember = getTeamMember(asset.addedBy)
                  const assignedToMember = asset.assignedTo ? getTeamMember(asset.assignedTo) : null

                  return (
                    <Card key={asset.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <FileIcon className="size-5 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-sm font-medium truncate">{asset.title}</CardTitle>
                              <p className="text-xs text-gray-500 truncate">{asset.fileName}</p>
                            </div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <IconDotsVertical className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleView(asset)}>
                                <IconEye className="size-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownload(asset)}>
                                <IconDownload className="size-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEdit(asset)}>
                                <IconEdit className="size-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDelete(asset.id)}
                                className="text-red-600"
                              >
                                <IconTrash className="size-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="flex items-center gap-4">
                            <Badge variant="outline" className="text-xs capitalize">
                              {asset.type}
                            </Badge>
                            <span className="text-sm text-gray-500">{asset.fileSize}</span>
                          </div>
                          
                          {asset.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">{asset.description}</p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              {addedByMember && (
                                <>
                                  <Avatar className="size-6">
                                    <AvatarImage src={addedByMember.avatarUrl} />
                                    <AvatarFallback className="text-xs">
                                      {addedByMember.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs text-gray-500 truncate">
                                    {addedByMember.name}
                                  </span>
                                </>
                              )}
                            </div>
                            
                            {assignedToMember && (
                              <div className="flex items-center gap-1">
                                <Avatar className="size-5">
                                  <AvatarImage src={assignedToMember.avatarUrl} />
                                  <AvatarFallback className="text-xs">
                                    {assignedToMember.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                            )}
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            Updated {formatDistanceToNow(new Date(asset.updatedAt), { addSuffix: true })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* Individual Type Tabs */}
          <TabsContent value="images">
            <div className="text-center py-8">
              <IconPhoto className="size-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Filter by images will be implemented here</p>
            </div>
          </TabsContent>

          <TabsContent value="videos">
            <div className="text-center py-8">
              <IconVideo className="size-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Filter by videos will be implemented here</p>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <div className="text-center py-8">
              <IconFileText className="size-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Filter by documents will be implemented here</p>
            </div>
          </TabsContent>

          <TabsContent value="archives">
            <div className="text-center py-8">
              <IconFileZip className="size-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Filter by archives will be implemented here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Asset View Sheet */}
      <Sheet open={viewSheetOpen} onOpenChange={setViewSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>Asset Details</SheetTitle>
            <SheetDescription>
              View asset information and details
            </SheetDescription>
          </SheetHeader>
          {selectedAsset && (
            <AssetViewModal
              asset={selectedAsset}
              onEdit={() => {
                setViewSheetOpen(false)
                setEditSheetOpen(true)
              }}
              getTeamMember={getTeamMember}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Asset Edit Sheet */}
      <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>Edit Asset</SheetTitle>
            <SheetDescription>
              Update asset details and information
            </SheetDescription>
          </SheetHeader>
          {selectedAsset && (
            <AssetEditForm
              asset={selectedAsset}
              onAssetUpdated={(updatedAsset) => {
                handleAssetUpdated(updatedAsset)
                setEditSheetOpen(false)
              }}
              onClose={() => setEditSheetOpen(false)}
              getTeamMember={getTeamMember}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}