// components/integrations/api-keys-list.tsx
'use client'

import { useState } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Key,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Calendar,
  Activity,
  Shield
} from 'lucide-react'
import { type ApiKey } from '@/lib/utils/dummy-data-integrations'
import { formatRelativeTime, formatDate } from '@/lib/utils'

interface ApiKeysListProps {
  apiKeys: ApiKey[]
}

const availablePermissions = [
  'projects.read',
  'projects.write',
  'tasks.read',
  'tasks.write',
  'content.read',
  'content.write',
  'assets.read',
  'assets.write',
  'team.read',
  'analytics.read',
  'webhooks.read',
  'webhooks.write',
  'webhooks.manage'
]

export function ApiKeysList({ apiKeys }: ApiKeysListProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedApiKey, setSelectedApiKey] = useState<ApiKey | null>(null)
  const [newApiKey, setNewApiKey] = useState({
    name: '',
    permissions: [] as string[],
    expiresAt: ''
  })
  const [showKey, setShowKey] = useState<string | null>(null)
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'expired':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'inactive':
        return <XCircle className="h-4 w-4 text-gray-400" />
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setNewApiKey(prev => ({
      ...prev,
      permissions: checked 
        ? [...prev.permissions, permission]
        : prev.permissions.filter(p => p !== permission)
    }))
  }

  const handleCreateApiKey = () => {
    // In real app, this would make an API call and return the actual key
    const generatedKey = `pk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    setNewlyCreatedKey(generatedKey)
    console.log('Creating API key:', newApiKey)
    setNewApiKey({ name: '', permissions: [], expiresAt: '' })
    setIsCreateOpen(false)
  }

  const handleViewApiKey = (apiKey: ApiKey) => {
    setSelectedApiKey(apiKey)
    setIsViewOpen(true)
  }

  const handleDeleteApiKey = (apiKeyId: string) => {
    // In real app, this would make an API call
    console.log('Deleting API key:', apiKeyId)
  }

  const handleRevokeApiKey = (apiKeyId: string) => {
    console.log('Revoking API key:', apiKeyId)
  }

  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key)
  }

  const toggleKeyVisibility = (keyId: string) => {
    setShowKey(showKey === keyId ? null : keyId)
  }

  const isExpiringSoon = (expiresAt?: string) => {
    if (!expiresAt) return false
    const expiryDate = new Date(expiresAt)
    const now = new Date()
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Keys
              </CardTitle>
              <CardDescription>
                Manage API keys for programmatic access to your Droplog data
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create API Key
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Newly Created Key Alert */}
      {newlyCreatedKey && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="font-medium">Your new API key has been created!</div>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                  {newlyCreatedKey}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyApiKey(newlyCreatedKey)}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Make sure to copy this key now. You won't be able to see it again for security reasons.
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setNewlyCreatedKey(null)}
              >
                Got it, dismiss
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Expiring Keys Alert */}
      {apiKeys.some(key => isExpiringSoon(key.expiresAt)) && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Some of your API keys are expiring soon. Review and renew them to avoid service interruption.
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">
                  {apiKeys.filter(k => k.status === 'active').length}
                </div>
                <div className="text-sm text-muted-foreground">Active Keys</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">
                  {apiKeys.filter(k => isExpiringSoon(k.expiresAt)).length}
                </div>
                <div className="text-sm text-muted-foreground">Expiring Soon</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <div>
                <div className="text-2xl font-bold">
                  {apiKeys.filter(k => k.status === 'expired').length}
                </div>
                <div className="text-sm text-muted-foreground">Expired</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              <div>
                <div className="text-2xl font-bold">
                  {apiKeys.reduce((sum, key) => sum + key.usageCount, 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Calls</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Keys Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell>
                    <div className="font-medium">{apiKey.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                        {showKey === apiKey.id ? apiKey.key : `${apiKey.key.substring(0, 8)}${'*'.repeat(15)}`}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                      >
                        {showKey === apiKey.id ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => copyApiKey(apiKey.key)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {apiKey.permissions.slice(0, 2).map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                      {apiKey.permissions.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{apiKey.permissions.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(apiKey.status)}
                      {getStatusBadge(apiKey.status)}
                      {isExpiringSoon(apiKey.expiresAt) && (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {apiKey.usageCount.toLocaleString()} calls
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {apiKey.lastUsed 
                        ? formatRelativeTime(apiKey.lastUsed)
                        : 'Never'
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {apiKey.expiresAt ? (
                        <div className={isExpiringSoon(apiKey.expiresAt) ? 'text-yellow-600' : ''}>
                          {formatDate(apiKey.expiresAt)}
                        </div>
                      ) : (
                        'Never'
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewApiKey(apiKey)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyApiKey(apiKey.key)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Key
                        </DropdownMenuItem>
                        {apiKey.status === 'active' && (
                          <DropdownMenuItem onClick={() => handleRevokeApiKey(apiKey.id)}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Revoke
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => handleDeleteApiKey(apiKey.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create API Key Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New API Key</DialogTitle>
            <DialogDescription>
              Generate a new API key for programmatic access to your Droplog data
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key-name">Name</Label>
              <Input
                id="api-key-name"
                placeholder="e.g., Mobile App, Analytics Dashboard"
                value={newApiKey.name}
                onChange={(e) => setNewApiKey(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-key-expires">Expires At (Optional)</Label>
              <Input
                id="api-key-expires"
                type="date"
                value={newApiKey.expiresAt}
                onChange={(e) => setNewApiKey(prev => ({ ...prev, expiresAt: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                {availablePermissions.map((permission) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <Checkbox
                      id={permission}
                      checked={newApiKey.permissions.includes(permission)}
                      onCheckedChange={(checked) => handlePermissionChange(permission, checked as boolean)}
                    />
                    <Label htmlFor={permission} className="text-sm font-normal">
                      {permission}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Make sure to copy your API key after creation. You won't be able to see it again for security reasons.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateApiKey}
                disabled={!newApiKey.name || newApiKey.permissions.length === 0}
              >
                Create API Key
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View API Key Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>API Key Details</DialogTitle>
            <DialogDescription>
              View detailed information about this API key
            </DialogDescription>
          </DialogHeader>
          
          {selectedApiKey && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <div className="font-medium">{selectedApiKey.name}</div>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedApiKey.status)}
                    {getStatusBadge(selectedApiKey.status)}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-3 py-2 rounded font-mono flex-1">
                    {showKey === selectedApiKey.id ? selectedApiKey.key : `${selectedApiKey.key.substring(0, 8)}${'*'.repeat(15)}`}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleKeyVisibility(selectedApiKey.id)}
                  >
                    {showKey === selectedApiKey.id ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyApiKey(selectedApiKey.key)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Created</Label>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(selectedApiKey.createdAt)}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Last Used</Label>
                  <div className="text-sm text-muted-foreground">
                    {selectedApiKey.lastUsed 
                      ? formatRelativeTime(selectedApiKey.lastUsed)
                      : 'Never'
                    }
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Usage Count</Label>
                  <div className="text-sm">{selectedApiKey.usageCount.toLocaleString()} calls</div>
                </div>
                <div className="space-y-2">
                  <Label>Expires</Label>
                  <div className="text-sm text-muted-foreground">
                    {selectedApiKey.expiresAt ? formatDate(selectedApiKey.expiresAt) : 'Never'}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedApiKey.permissions.map((permission) => (
                    <Badge key={permission} variant="secondary">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsViewOpen(false)}>
                  Close
                </Button>
                {selectedApiKey.status === 'active' && (
                  <Button 
                    variant="destructive" 
                    onClick={() => handleRevokeApiKey(selectedApiKey.id)}
                  >
                    Revoke Key
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* API Documentation Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            API Documentation
          </CardTitle>
          <CardDescription>
            Learn how to use the Droplog API with your newly created keys
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Base URL</h4>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                https://api.droplog.com/v1
              </code>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Authentication</h4>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                Authorization: Bearer YOUR_API_KEY
              </code>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Example Usage</h4>
            <div className="bg-muted p-3 rounded-lg">
              <code className="text-xs">
                curl -H "Authorization: Bearer YOUR_API_KEY" \<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;https://api.droplog.com/v1/projects
              </code>
            </div>
          </div>
          
          <Button variant="outline" className="w-full">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Full API Documentation
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}