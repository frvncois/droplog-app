// components/assets/assets-grid.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  FileText,
  Image,
  Video,
  File,
  Music,
  Download,
  Edit,
  Trash2,
  MoreVertical,
  Eye,
} from 'lucide-react'
import { AssetsGridProps } from '@/lib/types/assets'
import { projects, team } from '@/lib/utils/dummy-data'

export function AssetsGrid({
  assets,
  viewMode,
  onAssetUpdate,
  onAssetDelete,
}: AssetsGridProps) {
  const getAssetIcon = (type: string, size: 'sm' | 'lg' = 'sm') => {
    const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-8 w-8'
    
    switch (type) {
      case 'image':
        return <Image className={`${iconSize} text-blue-500`} />
      case 'video':
        return <Video className={`${iconSize} text-purple-500`} />
      case 'pdf':
      case 'document':
        return <FileText className={`${iconSize} text-red-500`} />
      case 'audio':
        return <Music className={`${iconSize} text-green-500`} />
      default:
        return <File className={`${iconSize} text-gray-500`} />
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getProjectName = (projectId: string) => {
    return projects.find(p => p.id === projectId)?.title || 'Unknown Project'
  }

  const getUserName = (userId: string) => {
    return team.find(u => u.id === userId)?.name || 'Unknown User'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const handlePreview = (asset: any) => {
    console.log('Preview asset:', asset)
    // In a real app, this would open a preview modal
  }

  const handleDownload = (asset: any) => {
    console.log('Download asset:', asset)
    // In a real app, this would trigger file download
  }

  if (assets.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
        <p className="text-gray-500">Try adjusting your filters or upload some assets to get started.</p>
      </div>
    )
  }

  if (viewMode === 'list') {
    return (
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Added By</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {getAssetIcon(asset.type)}
                    <div>
                      <div className="font-medium">{asset.title}</div>
                      {asset.fileName && (
                        <div className="text-sm text-gray-500">{asset.fileName}</div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">{asset.type}</Badge>
                </TableCell>
                <TableCell>{getProjectName(asset.projectId)}</TableCell>
                <TableCell>{formatFileSize(asset.size)}</TableCell>
                <TableCell>{getUserName(asset.addedBy)}</TableCell>
                <TableCell>{formatDate(asset.updatedAt)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handlePreview(asset)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload(asset)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAssetUpdate(asset)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Asset</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{asset.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => onAssetDelete(asset.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  // Grid view
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {assets.map((asset) => (
        <Card key={asset.id} className="group hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {getAssetIcon(asset.type, 'lg')}
                <Badge variant="outline" className="text-xs capitalize">
                  {asset.type}
                </Badge>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handlePreview(asset)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload(asset)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAssetUpdate(asset)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Asset</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{asset.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => onAssetDelete(asset.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-sm line-clamp-2" title={asset.title}>
                {asset.title}
              </h3>
              
              {asset.fileName && (
                <p className="text-xs text-gray-500 truncate" title={asset.fileName}>
                  {asset.fileName}
                </p>
              )}
              
              {asset.description && (
                <p className="text-xs text-gray-600 line-clamp-2" title={asset.description}>
                  {asset.description}
                </p>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{formatFileSize(asset.size)}</span>
                <span>{formatDate(asset.updatedAt)}</span>
              </div>
              
              <div className="pt-2 border-t space-y-1">
                <p className="text-xs text-gray-600">
                  <span className="font-medium">{getProjectName(asset.projectId)}</span>
                </p>
                <p className="text-xs text-gray-500">
                  by {getUserName(asset.addedBy)}
                </p>
              </div>
              
              {asset.tags && asset.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2">
                  {asset.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                      {tag}
                    </Badge>
                  ))}
                  {asset.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      +{asset.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}