'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  FileText, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Copy,
  Download,
  Share,
  Trash2,
  Clock,
  User,
  Tag,
  BookOpen
} from 'lucide-react'
import { projects, team } from '@/lib/utils/dummy-data'
import { format } from 'date-fns'

interface DocumentationGridProps {
  documentation: any[]
  viewMode: 'grid' | 'list'
  onDocumentUpdate: (document: any) => void
  onDocumentDelete: (documentId: string) => void
}

export function DocumentationGrid({ 
  documentation, 
  viewMode, 
  onDocumentUpdate, 
  onDocumentDelete 
}: DocumentationGridProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
      case 'review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'API':
        return '🔌'
      case 'Design':
        return '🎨'
      case 'Research':
        return '🔬'
      case 'Operations':
        return '⚙️'
      case 'Security':
        return '🔒'
      case 'Setup':
        return '🚀'
      default:
        return '📄'
    }
  }

  const getProject = (projectId: string) => projects.find(p => p.id === projectId)
  const getAuthor = (userId: string) => team.find(t => t.id === userId)

  const handleDocumentAction = (action: string, document: any) => {
    switch (action) {
      case 'view':
        console.log('View document:', document.id)
        break
      case 'edit':
        onDocumentUpdate(document)
        break
      case 'copy':
        console.log('Copy document link:', document.id)
        break
      case 'download':
        console.log('Download document:', document.id)
        break
      case 'share':
        console.log('Share document:', document.id)
        break
      case 'delete':
        onDocumentDelete(document.id)
        break
      default:
        break
    }
  }

  if (documentation.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documentation found</h3>
          <p className="text-gray-500 mb-4">
            Create your first document to get started
          </p>
          <Button>Create Document</Button>
        </CardContent>
      </Card>
    )
  }

  if (viewMode === 'list') {
    return (
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Read Time</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documentation.map((doc) => {
              const project = getProject(doc.projectId)
              const author = getAuthor(doc.author)
              
              return (
                <TableRow key={doc.id} className="group">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="text-lg">{getCategoryIcon(doc.category)}</div>
                      <div>
                        <p className="font-medium">{doc.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {doc.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {doc.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(doc.status)}>
                      {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={author?.avatarUrl} />
                        <AvatarFallback className="text-xs">
                          {author?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{author?.name || 'Unknown User'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(doc.updatedAt), 'MMM d, yyyy')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{doc.readTime}m</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDocumentAction('view', doc)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDocumentAction('edit', doc)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDocumentAction('copy', doc)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDocumentAction('download', doc)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDocumentAction('share', doc)}>
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDocumentAction('delete', doc)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documentation.map((doc) => {
        const project = getProject(doc.projectId)
        const author = getAuthor(doc.author)
        
        return (
          <Card key={doc.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getCategoryIcon(doc.category)}</div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg line-clamp-2">{doc.title}</CardTitle>
                    <Badge className={`mt-1 ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDocumentAction('view', doc)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDocumentAction('edit', doc)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDocumentAction('copy', doc)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDocumentAction('download', doc)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDocumentAction('share', doc)}>
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDocumentAction('delete', doc)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                {doc.description}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {doc.tags.slice(0, 3).map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {doc.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{doc.tags.length - 3}
                  </Badge>
                )}
              </div>
              
              {/* Project Link */}
              {project && (
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-muted-foreground">{project.title}</span>
                </div>
              )}
              
              {/* Meta Information */}
              <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{author?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{doc.readTime}m read</span>
                  </div>
                </div>
                <span>{format(new Date(doc.updatedAt), 'MMM d')}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}