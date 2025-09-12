'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Building2, 
  Globe, 
  Shield, 
  Key, 
  Database, 
  Trash2, 
  AlertTriangle,
  Upload,
  Eye,
  EyeOff,
  Copy,
  Download,
  RotateCcw,
  Settings,
  Users,
  Lock,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'

// Organization settings interface
interface OrganizationSettings {
  general: {
    name: string
    description: string
    website: string
    logo: string
    industry: string
    size: string
    location: string
    timezone: string
    language: string
  }
  security: {
    twoFactorRequired: boolean
    ssoEnabled: boolean
    sessionTimeout: number
    passwordPolicy: {
      minLength: number
      requireUppercase: boolean
      requireLowercase: boolean
      requireNumbers: boolean
      requireSpecialChars: boolean
    }
    ipWhitelist: string[]
  }
  privacy: {
    dataRetention: number
    anonymizeData: boolean
    allowAnalytics: boolean
    shareUsageData: boolean
  }
  integrations: {
    slackEnabled: boolean
    emailNotifications: boolean
    webhookUrl: string
    apiKeys: Array<{
      id: string
      name: string
      key: string
      permissions: string[]
      createdAt: string
      lastUsed?: string
    }>
  }
}

// Dummy organization settings
const initialSettings: OrganizationSettings = {
  general: {
    name: 'Acme Corporation',
    description: 'Leading provider of innovative project management solutions',
    website: 'https://acme-corp.com',
    logo: '/logos/acme-logo.png',
    industry: 'Technology',
    size: '11-50',
    location: 'San Francisco, CA',
    timezone: 'America/Los_Angeles',
    language: 'en'
  },
  security: {
    twoFactorRequired: true,
    ssoEnabled: false,
    sessionTimeout: 480,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: false
    },
    ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8']
  },
  privacy: {
    dataRetention: 365,
    anonymizeData: true,
    allowAnalytics: true,
    shareUsageData: false
  },
  integrations: {
    slackEnabled: true,
    emailNotifications: true,
    webhookUrl: 'https://hooks.acme-corp.com/droplog',
    apiKeys: [
      {
        id: 'ak_1',
        name: 'Production API',
        key: 'sk_live_abc123...',
        permissions: ['read', 'write'],
        createdAt: '2025-08-15T10:00:00Z',
        lastUsed: '2025-09-12T08:30:00Z'
      },
      {
        id: 'ak_2',
        name: 'Analytics Integration',
        key: 'sk_test_def456...',
        permissions: ['read'],
        createdAt: '2025-09-01T14:20:00Z',
        lastUsed: '2025-09-10T16:45:00Z'
      }
    ]
  }
}

export function OrganizationSettings() {
  const [settings, setSettings] = useState<OrganizationSettings>(initialSettings)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({})
  const [newApiKeyDialogOpen, setNewApiKeyDialogOpen] = useState(false)

  const updateGeneralSetting = (key: keyof OrganizationSettings['general'], value: string) => {
    setSettings(prev => ({
      ...prev,
      general: { ...prev.general, [key]: value }
    }))
  }

  const updateSecuritySetting = (key: keyof OrganizationSettings['security'], value: any) => {
    setSettings(prev => ({
      ...prev,
      security: { ...prev.security, [key]: value }
    }))
  }

  const updatePrivacySetting = (key: keyof OrganizationSettings['privacy'], value: any) => {
    setSettings(prev => ({
      ...prev,
      privacy: { ...prev.privacy, [key]: value }
    }))
  }

  const updateIntegrationSetting = (key: keyof OrganizationSettings['integrations'], value: any) => {
    setSettings(prev => ({
      ...prev,
      integrations: { ...prev.integrations, [key]: value }
    }))
  }

  const toggleApiKeyVisibility = (keyId: string) => {
    setShowApiKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* Organization Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Organization Profile
              </CardTitle>
              <CardDescription>Basic information about your organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={settings.general.logo} />
                  <AvatarFallback className="text-lg">
                    {settings.general.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Recommended: Square image, at least 200x200px
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input
                    id="org-name"
                    value={settings.general.name}
                    onChange={(e) => updateGeneralSetting('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-website">Website</Label>
                  <Input
                    id="org-website"
                    value={settings.general.website}
                    onChange={(e) => updateGeneralSetting('website', e.target.value)}
                    placeholder="https://your-website.com"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="org-description">Description</Label>
                  <Textarea
                    id="org-description"
                    value={settings.general.description}
                    onChange={(e) => updateGeneralSetting('description', e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-industry">Industry</Label>
                  <Select value={settings.general.industry} onValueChange={(value) => updateGeneralSetting('industry', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-size">Organization Size</Label>
                  <Select value={settings.general.size} onValueChange={(value) => updateGeneralSetting('size', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-500">201-500 employees</SelectItem>
                      <SelectItem value="500+">500+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-location">Location</Label>
                  <Input
                    id="org-location"
                    value={settings.general.location}
                    onChange={(e) => updateGeneralSetting('location', e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-timezone">Timezone</Label>
                  <Select value={settings.general.timezone} onValueChange={(value) => updateGeneralSetting('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Los_Angeles">Pacific Time (US & Canada)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (US & Canada)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (US & Canada)</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time (US & Canada)</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Europe/Paris">Paris</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Configure security policies for your organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="two-factor">Require Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require all team members to enable 2FA</p>
                  </div>
                  <Switch
                    id="two-factor"
                    checked={settings.security.twoFactorRequired}
                    onCheckedChange={(value) => updateSecuritySetting('twoFactorRequired', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sso">Single Sign-On (SSO)</Label>
                    <p className="text-sm text-muted-foreground">Enable SSO authentication</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Enterprise</Badge>
                    <Switch
                      id="sso"
                      checked={settings.security.ssoEnabled}
                      onCheckedChange={(value) => updateSecuritySetting('ssoEnabled', value)}
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSecuritySetting('sessionTimeout', parseInt(e.target.value))}
                    className="w-40"
                  />
                  <p className="text-sm text-muted-foreground">
                    Users will be logged out after this period of inactivity
                  </p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold mb-4">Password Policy</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-length">Minimum Password Length</Label>
                    <Input
                      id="min-length"
                      type="number"
                      value={settings.security.passwordPolicy.minLength}
                      onChange={(e) => updateSecuritySetting('passwordPolicy', {
                        ...settings.security.passwordPolicy,
                        minLength: parseInt(e.target.value)
                      })}
                      className="w-40"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="require-uppercase">Require Uppercase</Label>
                      <Switch
                        id="require-uppercase"
                        checked={settings.security.passwordPolicy.requireUppercase}
                        onCheckedChange={(value) => updateSecuritySetting('passwordPolicy', {
                          ...settings.security.passwordPolicy,
                          requireUppercase: value
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="require-lowercase">Require Lowercase</Label>
                      <Switch
                        id="require-lowercase"
                        checked={settings.security.passwordPolicy.requireLowercase}
                        onCheckedChange={(value) => updateSecuritySetting('passwordPolicy', {
                          ...settings.security.passwordPolicy,
                          requireLowercase: value
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="require-numbers">Require Numbers</Label>
                      <Switch
                        id="require-numbers"
                        checked={settings.security.passwordPolicy.requireNumbers}
                        onCheckedChange={(value) => updateSecuritySetting('passwordPolicy', {
                          ...settings.security.passwordPolicy,
                          requireNumbers: value
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="require-special">Require Special Characters</Label>
                      <Switch
                        id="require-special"
                        checked={settings.security.passwordPolicy.requireSpecialChars}
                        onCheckedChange={(value) => updateSecuritySetting('passwordPolicy', {
                          ...settings.security.passwordPolicy,
                          requireSpecialChars: value
                        })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold mb-4">IP Whitelist</h4>
                <div className="space-y-2">
                  {settings.security.ipWhitelist.map((ip, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input value={ip} readOnly className="flex-1" />
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm">Add IP Range</Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Security Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Privacy & Data Management
              </CardTitle>
              <CardDescription>Control how your organization's data is handled</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="data-retention">Data Retention Period (days)</Label>
                  <Input
                    id="data-retention"
                    type="number"
                    value={settings.privacy.dataRetention}
                    onChange={(e) => updatePrivacySetting('dataRetention', parseInt(e.target.value))}
                    className="w-40"
                  />
                  <p className="text-sm text-muted-foreground">
                    How long to keep deleted data before permanent removal
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="anonymize-data">Anonymize User Data</Label>
                    <p className="text-sm text-muted-foreground">Remove personal identifiers from analytics</p>
                  </div>
                  <Switch
                    id="anonymize-data"
                    checked={settings.privacy.anonymizeData}
                    onCheckedChange={(value) => updatePrivacySetting('anonymizeData', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allow-analytics">Allow Analytics</Label>
                    <p className="text-sm text-muted-foreground">Enable usage analytics and insights</p>
                  </div>
                  <Switch
                    id="allow-analytics"
                    checked={settings.privacy.allowAnalytics}
                    onCheckedChange={(value) => updatePrivacySetting('allowAnalytics', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="share-usage">Share Usage Data</Label>
                    <p className="text-sm text-muted-foreground">Help improve Droplog by sharing anonymous usage data</p>
                  </div>
                  <Switch
                    id="share-usage"
                    checked={settings.privacy.shareUsageData}
                    onCheckedChange={(value) => updatePrivacySetting('shareUsageData', value)}
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold mb-4">Data Export & Deletion</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Export Organization Data</p>
                      <p className="text-sm text-muted-foreground">Download all your organization's data</p>
                    </div>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Request Data Deletion</p>
                      <p className="text-sm text-muted-foreground">Permanently delete all organization data</p>
                    </div>
                    <Button variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Request Deletion
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Privacy Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          {/* API Keys */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Keys
              </CardTitle>
              <CardDescription>Manage API keys for external integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-end">
                <Dialog open={newApiKeyDialogOpen} onOpenChange={setNewApiKeyDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>Create API Key</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New API Key</DialogTitle>
                      <DialogDescription>Generate a new API key for integrations</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="api-name">Key Name</Label>
                        <Input id="api-name" placeholder="Production API" />
                      </div>
                      <div>
                        <Label>Permissions</Label>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="read" />
                            <Label htmlFor="read">Read</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="write" />
                            <Label htmlFor="write">Write</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="delete" />
                            <Label htmlFor="delete">Delete</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setNewApiKeyDialogOpen(false)}>Cancel</Button>
                      <Button onClick={() => setNewApiKeyDialogOpen(false)}>Create Key</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-3">
                {settings.integrations.apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{apiKey.name}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {apiKey.permissions.join(', ')}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleApiKeyVisibility(apiKey.id)}
                        >
                          {showApiKeys[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(apiKey.key)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="font-mono text-sm bg-muted p-2 rounded">
                      {showApiKeys[apiKey.id] ? apiKey.key : '••••••••••••••••••••••••••••••••'}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>Created: {formatDate(apiKey.createdAt)}</span>
                      {apiKey.lastUsed && <span>Last used: {formatDate(apiKey.lastUsed)}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Integrations */}
          <Card>
            <CardHeader>
              <CardTitle>External Integrations</CardTitle>
              <CardDescription>Connect with external services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="slack-integration">Slack Integration</Label>
                  <p className="text-sm text-muted-foreground">Send notifications to Slack channels</p>
                </div>
                <Switch
                  id="slack-integration"
                  checked={settings.integrations.slackEnabled}
                  onCheckedChange={(value) => updateIntegrationSetting('slackEnabled', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send email notifications for important events</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.integrations.emailNotifications}
                  onCheckedChange={(value) => updateIntegrationSetting('emailNotifications', value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  value={settings.integrations.webhookUrl}
                  onChange={(e) => updateIntegrationSetting('webhookUrl', e.target.value)}
                  placeholder="https://hooks.your-service.com/webhook"
                />
                <p className="text-sm text-muted-foreground">
                  Receive real-time notifications about organization events
                </p>
              </div>

              <div className="flex justify-end">
                <Button>Save Integration Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="danger" className="space-y-6">
          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible actions that will affect your entire organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-red-800">Transfer Organization Ownership</h4>
                      <p className="text-sm text-red-600">
                        Transfer ownership to another team member
                      </p>
                    </div>
                    <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-100">
                      Transfer Ownership
                    </Button>
                  </div>
                </div>

                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-red-800">Archive Organization</h4>
                      <p className="text-sm text-red-600">
                        Archive this organization and all its data (reversible)
                      </p>
                    </div>
                    <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-100">
                      Archive Organization
                    </Button>
                  </div>
                </div>

                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-red-800">Delete Organization</h4>
                      <p className="text-sm text-red-600">
                        Permanently delete this organization and all its data
                      </p>
                    </div>
                    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="destructive">
                          Delete Organization
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-red-600">Delete Organization</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently delete your organization
                            and remove all data associated with it.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="p-4 bg-red-50 border border-red-200 rounded">
                            <h4 className="font-medium text-red-800 mb-2">This will delete:</h4>
                            <ul className="text-sm text-red-600 space-y-1">
                              <li>• All projects and tasks</li>
                              <li>• All team members and their access</li>
                              <li>• All files and assets</li>
                              <li>• All billing information</li>
                              <li>• All organization settings</li>
                            </ul>
                          </div>
                          <div>
                            <Label htmlFor="confirm-delete">
                              Type <strong>{settings.general.name}</strong> to confirm
                            </Label>
                            <Input id="confirm-delete" placeholder={settings.general.name} />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button variant="destructive" onClick={() => setDeleteDialogOpen(false)}>
                            I understand, delete this organization
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}