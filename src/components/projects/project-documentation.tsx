'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { 
  Search, 
  Plus, 
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
  BookOpen,
  Filter
} from 'lucide-react'
import { team } from '@/lib/utils/dummy-data'
import { format } from 'date-fns'
import { CreateDocumentModal } from '@/components/modals/create-document-modal'

interface ProjectDocumentationProps {
  projectId: string
}

// Mock project documentation data - filter by projectId
const getProjectDocumentation = (projectId: string) => [
  {
    id: "doc1",
    title: "Project Setup Guide",
    description: "Complete guide for setting up this project",
    category: "Setup",
    type: "Guide",
    status: "published",
    author: "u1",
    projectId: projectId,
    createdAt: "2025-09-01T10:00:00Z",
    updatedAt: "2025-09-10T14:30:00Z",
    tags: ["setup", "getting-started", "configuration"],
    wordCount: 1250,
    readTime: 5
  },
  {
    id: "doc2",
    title: "API Documentation",
    description: "RESTful API endpoints for this project",
    category: "API",
    type: "Reference",
    status: "published",
    author: "u2",
    projectId: projectId,
    createdAt: "2025-08-15T09:00:00Z",
    updatedAt: "2025-09-08T16:45:00Z",
    tags: ["api", "endpoints", "integration"],
    wordCount: 3200,
    readTime: 12
  },
  {
    id: "doc3",
    title: "Design System",
    description: "Brand guidelines and component library",
    category: "Design",
    type: "Guidelines",
    status: "draft",
    author: "u3",
    projectId: projectId,
    createdAt: "2025-09-05T11:20:00Z",
    updatedAt: "2025-09-11T10:15:00Z",
    tags: ["design", "branding", "components"],
    wordCount: 890,
    readTime: 4
  },
  {
    id: "doc4",
    title: "Deployment Guide",
    description: "Step-by-step deployment procedures",
    category: "Operations",
    type: "Guide",
    status: "review",
    author: "u2",
    projectId: projectId,
    createdAt: "2025-09-07T13:30:00Z",
    updatedAt: "2025-09-09T09:20:00Z",
    tags: ["deployment", "operations", "production"],
    wordCount: 1800,
    readTime: 7
  }
]

export function ProjectDocumentation({ projectId }: ProjectDocumentationProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const documentation = getProjectDocumentation(projectId)

  const filteredDocumentation = useMemo(() => {
    return documentation.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || doc.status === statusFilter
      const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter
      
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [documentation, searchTerm, statusFilter, categoryFilter])

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
      case 'Setup':
        return '🚀'
      case 'Operations':
        return '⚙️'
      default:
        return '📄'
    }
  }

  const getAuthor = (userId: string) => team.find(t => t.id === userId)

  const handleDocumentAction = (action: string, document: any) => {
    switch (action) {
      case 'view':
        console.log('View document:', document.id)
        break
      case 'edit':
        console.log('Edit document:', document.id)
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
        console.log('Delete document:', document.id)
        break
      default:
        break
    }
  }

  const handleDocumentCreate = (newDocument: any) => {
    console.log('Document created for project:', projectId, newDocument)
    setCreateModalOpen(false)
  }

  // Calculate stats
  const totalDocs = documentation.length
  const publishedDocs = documentation.filter(d => d.status === 'published').length
  const draftDocs = documentation.filter(d => d.status === 'draft').length
  const totalWords = documentation.reduce((sum, doc) => sum + doc.wordCount, 0)

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search documentation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="review">In Review</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Setup">Setup</SelectItem>
            <SelectItem value="API">API</SelectItem>
            <SelectItem value="Design">Design</SelectItem>
            <SelectItem value="Operations">Operations</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Documentation Grid */}
      {filteredDocumentation.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {documentation.length === 0 ? 'No documentation yet' : 'No documentation matches your search'}
            </h3>
            <p className="text-gray-500 mb-4">
              {documentation.length === 0 
                ? 'Create your first document to get started'
                : 'Try adjusting your search or filters'
              }
            </p>
            {documentation.length === 0 && (
              <Button onClick={() => setCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Document
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocumentation.map((doc) => {
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
                    {doc.tags.slice(0, 3).map((tag) => (
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
      )}

      <CreateDocumentModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onDocumentCreated={handleDocumentCreate}
      />
    </div>
  )
}