'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { projects, team } from '@/lib/utils/dummy-data'
import { X, Plus } from 'lucide-react'

interface CreateDocumentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDocumentCreated: (document: any) => void
}

export function CreateDocumentModal({
  open,
  onOpenChange,
  onDocumentCreated
}: CreateDocumentModalProps) {
  const [loading, setLoading] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'Guide',
    type: 'Guide',
    status: 'draft',
    projectId: '',
    tags: [] as string[]
  })

  const categories = [
    'Setup', 'API', 'Design', 'Research', 'Operations', 'Security', 'General'
  ]

  const types = [
    'Guide', 'Reference', 'Tutorial', 'FAQ', 'Checklist', 'Report', 'Guidelines'
  ]

  const statuses = [
    { value: 'draft', label: 'Draft' },
    { value: 'review', label: 'In Review' },
    { value: 'published', label: 'Published' }
  ]

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      return
    }

    setLoading(true)

    try {
      const newDocument = {
        id: `doc_${Date.now()}`,
        title: formData.title,
        description: formData.description,
        content: formData.content,
        category: formData.category,
        type: formData.type,
        status: formData.status,
        author: 'u1', // Current user ID
        projectId: formData.projectId || null,
        tags: formData.tags,
        wordCount: formData.content.split(' ').length,
        readTime: Math.max(1, Math.ceil(formData.content.split(' ').length / 200)),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      onDocumentCreated(newDocument)
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        content: '',
        category: 'Guide',
        type: 'Guide',
        status: 'draft',
        projectId: '',
        tags: []
      })
      setTagInput('')
    } catch (error) {
      console.error('Error creating document:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Document</DialogTitle>
          <DialogDescription>
            Add new documentation to your knowledge base
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Document title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the document"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          {/* Category and Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Project and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project">Project (Optional)</Label>
              <Select
                value={formData.projectId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, projectId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Project</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTag}
                disabled={!tagInput.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Document content (Markdown supported)"
              rows={8}
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">
              Word count: {formData.content.split(' ').filter(word => word.length > 0).length} words
              {formData.content && ` • Est. read time: ${Math.max(1, Math.ceil(formData.content.split(' ').filter(word => word.length > 0).length / 200))} min`}
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !formData.title.trim() || !formData.description.trim()}
          >
            {loading ? 'Creating...' : 'Create Document'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}