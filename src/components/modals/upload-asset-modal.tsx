// components/modals/upload-asset-modal.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Upload,
  X,
  FileText,
  Image,
  Video,
  File,
  Music,
} from 'lucide-react'
import { UploadAssetModalProps } from '@/lib/types/assets'
import { projects } from '@/lib/utils/dummy-data'

interface UploadedFile {
  id: string
  file: File
  title: string
  description: string
  projectId: string
  tags: string[]
  type: 'image' | 'video' | 'document' | 'pdf' | 'audio' | 'other'
}

export function UploadAssetModal({
  open,
  onOpenChange,
  onUpload,
}: UploadAssetModalProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [currentTag, setCurrentTag] = useState('')

  const getFileType = (file: File): UploadedFile['type'] => {
    const type = file.type.toLowerCase()
    if (type.startsWith('image/')) return 'image'
    if (type.startsWith('video/')) return 'video'
    if (type.startsWith('audio/')) return 'audio'
    if (type === 'application/pdf') return 'pdf'
    if (type.includes('document') || type.includes('text')) return 'document'
    return 'other'
  }

  const getFileIcon = (type: UploadedFile['type']) => {
    switch (type) {
      case 'image':
        return <Image className="h-6 w-6 text-blue-500" />
      case 'video':
        return <Video className="h-6 w-6 text-purple-500" />
      case 'pdf':
      case 'document':
        return <FileText className="h-6 w-6 text-red-500" />
      case 'audio':
        return <Music className="h-6 w-6 text-green-500" />
      default:
        return <File className="h-6 w-6 text-gray-500" />
    }
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }

  const handleFiles = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
      description: '',
      projectId: projects[0]?.id || '',
      tags: [],
      type: getFileType(file),
    }))

    setUploadedFiles((prev) => [...prev, ...newFiles])
  }

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const updateFile = (id: string, updates: Partial<UploadedFile>) => {
    setUploadedFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    )
  }

  const addTag = (fileId: string, tag: string) => {
    if (!tag.trim()) return
    updateFile(fileId, {
      tags: [...(uploadedFiles.find(f => f.id === fileId)?.tags || []), tag.trim()]
    })
  }

  const removeTag = (fileId: string, tagIndex: number) => {
    const file = uploadedFiles.find(f => f.id === fileId)
    if (!file) return
    const newTags = file.tags.filter((_, index) => index !== tagIndex)
    updateFile(fileId, { tags: newTags })
  }

  const handleSubmit = () => {
    const assetsToUpload = uploadedFiles.map((file) => ({
      ...file,
      size: file.file.size,
      fileName: file.file.name,
      addedBy: 'current-user', // In real app, get from auth
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }))

    onUpload(assetsToUpload)
    setUploadedFiles([])
  }

  const handleCancel = () => {
    setUploadedFiles([])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Assets</DialogTitle>
          <DialogDescription>
            Add files to your project assets. You can drag and drop files or click to browse.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop your files here, or click to browse
            </p>
            <input
              type="file"
              multiple
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="outline" className="cursor-pointer">
                Choose Files
              </Button>
            </label>
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium">Uploaded Files ({uploadedFiles.length})</h3>
              
              {uploadedFiles.map((uploadedFile) => (
                <Card key={uploadedFile.id}>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {/* File Info */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {getFileIcon(uploadedFile.type)}
                          <div>
                            <p className="font-medium text-sm">{uploadedFile.file.name}</p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(uploadedFile.file.size)} • {uploadedFile.type}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(uploadedFile.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* File Details Form */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`title-${uploadedFile.id}`}>Title</Label>
                          <Input
                            id={`title-${uploadedFile.id}`}
                            value={uploadedFile.title}
                            onChange={(e) => updateFile(uploadedFile.id, { title: e.target.value })}
                            placeholder="Asset title"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`project-${uploadedFile.id}`}>Project</Label>
                          <Select
                            value={uploadedFile.projectId}
                            onValueChange={(value) => updateFile(uploadedFile.id, { projectId: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select project" />
                            </SelectTrigger>
                            <SelectContent>
                              {projects.map((project) => (
                                <SelectItem key={project.id} value={project.id}>
                                  {project.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`description-${uploadedFile.id}`}>Description</Label>
                        <Textarea
                          id={`description-${uploadedFile.id}`}
                          value={uploadedFile.description}
                          onChange={(e) => updateFile(uploadedFile.id, { description: e.target.value })}
                          placeholder="Asset description"
                          rows={2}
                        />
                      </div>

                      {/* Tags */}
                      <div className="space-y-2">
                        <Label>Tags</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {uploadedFile.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {tag}
                              <button
                                onClick={() => removeTag(uploadedFile.id, index)}
                                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            placeholder="Add tag"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                addTag(uploadedFile.id, currentTag)
                                setCurrentTag('')
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              addTag(uploadedFile.id, currentTag)
                              setCurrentTag('')
                            }}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={uploadedFiles.length === 0}
          >
            Upload {uploadedFiles.length} {uploadedFiles.length === 1 ? 'Asset' : 'Assets'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}