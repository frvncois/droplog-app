'use client'

import { useState, useMemo } from 'react'
import { DocumentationHeader } from '@/components/documentation/documentation-header'
import { DocumentationGrid } from '@/components/documentation/documentation-grid'
import { CreateDocumentModal } from '@/components/modals/create-document-modal'
import { projects, team } from '@/lib/utils/dummy-data'

// Mock documentation data
const documentation = [
  {
    id: "doc1",
    title: "Project Setup Guide",
    description: "Complete guide for setting up new projects in Droplog",
    category: "Setup",
    type: "Guide",
    status: "published",
    author: "u1",
    projectId: "p1",
    createdAt: "2025-09-01T10:00:00Z",
    updatedAt: "2025-09-10T14:30:00Z",
    tags: ["setup", "projects", "getting-started"],
    wordCount: 1250,
    readTime: 5
  },
  {
    id: "doc2",
    title: "API Documentation",
    description: "RESTful API endpoints and authentication methods",
    category: "API",
    type: "Reference",
    status: "published",
    author: "u2",
    projectId: "p2",
    createdAt: "2025-08-15T09:00:00Z",
    updatedAt: "2025-09-08T16:45:00Z",
    tags: ["api", "endpoints", "authentication"],
    wordCount: 3200,
    readTime: 12
  },
  {
    id: "doc3",
    title: "Design System Guidelines",
    description: "Brand guidelines, color schemes, and component library",
    category: "Design",
    type: "Guidelines",
    status: "draft",
    author: "u3",
    projectId: "p1",
    createdAt: "2025-09-05T11:20:00Z",
    updatedAt: "2025-09-11T10:15:00Z",
    tags: ["design", "branding", "components"],
    wordCount: 890,
    readTime: 4
  },
  {
    id: "doc4",
    title: "User Testing Results",
    description: "Analysis of user feedback and testing sessions",
    category: "Research",
    type: "Report",
    status: "review",
    author: "u1",
    projectId: "p3",
    createdAt: "2025-09-07T13:30:00Z",
    updatedAt: "2025-09-09T09:20:00Z",
    tags: ["user-testing", "feedback", "analysis"],
    wordCount: 2100,
    readTime: 8
  },
  {
    id: "doc5",
    title: "Deployment Checklist",
    description: "Step-by-step deployment and rollback procedures",
    category: "Operations",
    type: "Checklist",
    status: "published",
    author: "u2",
    projectId: "p2",
    createdAt: "2025-08-28T14:00:00Z",
    updatedAt: "2025-09-06T11:30:00Z",
    tags: ["deployment", "operations", "checklist"],
    wordCount: 750,
    readTime: 3
  },
  {
    id: "doc6",
    title: "Security Best Practices",
    description: "Security guidelines and implementation standards",
    category: "Security",
    type: "Guidelines",
    status: "published",
    author: "u4",
    projectId: null,
    createdAt: "2025-08-20T08:45:00Z",
    updatedAt: "2025-09-02T15:20:00Z",
    tags: ["security", "best-practices", "guidelines"],
    wordCount: 1800,
    readTime: 7
  }
]

export default function DocumentationPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const filteredDocumentation = useMemo(() => {
    let filtered = documentation.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter
      const matchesStatus = statusFilter === 'all' || doc.status === statusFilter
      const matchesType = typeFilter === 'all' || doc.type === typeFilter
      
      return matchesSearch && matchesCategory && matchesStatus && matchesType
    })

    // Sort documentation
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
      case 'popular':
        filtered.sort((a, b) => b.readTime - a.readTime)
        break
      default:
        break
    }

    return filtered
  }, [documentation, searchTerm, categoryFilter, statusFilter, typeFilter, sortBy])

  const handleDocumentCreate = (newDocument: any) => {
    console.log('Document created:', newDocument)
    // In a real app, this would update the documentation list
    setCreateModalOpen(false)
  }

  const handleDocumentUpdate = (updatedDocument: any) => {
    console.log('Document updated:', updatedDocument)
    // In a real app, this would update the specific document
  }

  const handleDocumentDelete = (documentId: string) => {
    console.log('Document deleted:', documentId)
    // In a real app, this would remove the document from the list
  }

  return (
    <div className="space-y-6 p-6">
      <DocumentationHeader 
        documentation={documentation}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onCreateDocument={() => setCreateModalOpen(true)}
      />
      
      <DocumentationGrid 
        documentation={filteredDocumentation}
        viewMode={viewMode}
        onDocumentUpdate={handleDocumentUpdate}
        onDocumentDelete={handleDocumentDelete}
      />

      <CreateDocumentModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onDocumentCreated={handleDocumentCreate}
      />
    </div>
  )
}