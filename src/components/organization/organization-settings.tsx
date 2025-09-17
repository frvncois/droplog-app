// components/organization/organization-settings.tsx

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Settings,
  Building2,
  Shield,
  Bell,
  Users,
  Key,
  Globe,
  Palette,
  Database,
  AlertTriangle,
  Upload,
  Download,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Plus,
  X
} from "lucide-react";

interface Organization {
  id: string;
  name: string;
  description?: string;
  plan: string;
  members: number;
  projects: number;
  createdAt: string;
  updatedAt: string;
}

interface OrganizationSettingsProps {
  organization: Organization;
}

// Mock settings data
const organizationSettings = {
  general: {
    name: "Acme Corporation",
    description: "Leading innovation in digital transformation and technology solutions",
    website: "https://acme.com",
    industry: "Technology",
    size: "50-100 employees",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    currency: "USD"
  },
  security: {
    twoFactorRequired: true,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSymbols: true
    },
    sessionTimeout: 480, // minutes
    ipWhitelisting: false,
    ssoEnabled: false,
    auditLogging: true
  },
  notifications: {
    email: {
      projectUpdates: true,
      taskAssignments: true,
      teamInvitations: true,
      systemUpdates: true,
      weeklyReports: false
    },
    slack: {
      enabled: false,
      webhookUrl: "",
      channels: ["#general", "#projects"]
    }
  },
  integrations: {
    googleWorkspace: { enabled: true, domain: "acme.com" },
    microsoftOffice: { enabled: false },
    slack: { enabled: false },
    zapier: { enabled: true },
    githubActions: { enabled: false }
  },
  branding: {
    logo: "/logos/acme-logo.png",
    primaryColor: "#3b82f6",
    secondaryColor: "#64748b",
    customDomain: "",
    favicon: "/favicon.ico"
  },
  data: {
    backupFrequency: "daily",
    dataRetention: 365, // days
    exportFormat: "json",
    autoBackup: true
  }
};

export function OrganizationSettings({ organization }: OrganizationSettingsProps) {
  const [settings, setSettings] = useState(organizationSettings);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSettingChange = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleNestedSettingChange = (section: string, subsection: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [subsection]: {
          ...(prev[section as keyof typeof prev] as any)[subsection],
          [key]: value
        }
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveSettings = () => {
    // Mock save functionality
    console.log("Saving settings:", settings);
    setHasUnsavedChanges(false);
  };

  const handleExportData = () => {
    // Mock export functionality
    console.log("Exporting organization data...");
  };

  const handleDeleteOrganization = () => {
    // Mock delete functionality
    console.log("Deleting organization...");
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Save Banner */}
      {hasUnsavedChanges && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                You have unsaved changes
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setHasUnsavedChanges(false)}>
                Discard
              </Button>
              <Button size="sm" onClick={handleSaveSettings}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Organization Details
              </CardTitle>
              <CardDescription>
                Basic information about your organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input
                    id="org-name"
                    value={settings.general.name}
                    onChange={(e) => handleSettingChange("general", "name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-website">Website</Label>
                  <Input
                    id="org-website"
                    value={settings.general.website}
                    onChange={(e) => handleSettingChange("general", "website", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-description">Description</Label>
                <Textarea
                  id="org-description"
                  value={settings.general.description}
                  onChange={(e) => handleSettingChange("general", "description", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="org-industry">Industry</Label>
                  <Select value={settings.general.industry} onValueChange={(value) => handleSettingChange("general", "industry", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-size">Organization Size</Label>
                  <Select value={settings.general.size} onValueChange={(value) => handleSettingChange("general", "size", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10 employees">1-10 employees</SelectItem>
                      <SelectItem value="11-50 employees">11-50 employees</SelectItem>
                      <SelectItem value="51-100 employees">51-100 employees</SelectItem>
                      <SelectItem value="101-500 employees">101-500 employees</SelectItem>
                      <SelectItem value="500+ employees">500+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="org-timezone">Timezone</Label>
                  <Select value={settings.general.timezone} onValueChange={(value) => handleSettingChange("general", "timezone", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Europe/Paris">Paris</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-date-format">Date Format</Label>
                  <Select value={settings.general.dateFormat} onValueChange={(value) => handleSettingChange("general", "dateFormat", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-currency">Currency</Label>
                  <Select value={settings.general.currency} onValueChange={(value) => handleSettingChange("general", "currency", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD (C$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Access
              </CardTitle>
              <CardDescription>
                Configure security policies and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for all organization members
                  </p>
                </div>
                <Switch
                  checked={settings.security.twoFactorRequired}
                  onCheckedChange={(checked) => handleSettingChange("security", "twoFactorRequired", checked)}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Password Policy</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-length">Minimum Length</Label>
                    <Input
                      id="min-length"
                      type="number"
                      value={settings.security.passwordPolicy.minLength}
                      onChange={(e) => handleNestedSettingChange("security", "passwordPolicy", "minLength", parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Input
                      id="session-timeout"
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleSettingChange("security", "sessionTimeout", parseInt(e.target.value))}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Require Uppercase Letters</Label>
                    <Switch
                      checked={settings.security.passwordPolicy.requireUppercase}
                      onCheckedChange={(checked) => handleNestedSettingChange("security", "passwordPolicy", "requireUppercase", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Require Numbers</Label>
                    <Switch
                      checked={settings.security.passwordPolicy.requireNumbers}
                      onCheckedChange={(checked) => handleNestedSettingChange("security", "passwordPolicy", "requireNumbers", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Require Symbols</Label>
                    <Switch
                      checked={settings.security.passwordPolicy.requireSymbols}
                      onCheckedChange={(checked) => handleNestedSettingChange("security", "passwordPolicy", "requireSymbols", checked)}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>IP Whitelisting</Label>
                    <p className="text-sm text-muted-foreground">
                      Restrict access to specific IP addresses
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.ipWhitelisting}
                    onCheckedChange={(checked) => handleSettingChange("security", "ipWhitelisting", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Single Sign-On (SSO)</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable SAML/OAuth SSO integration
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.ssoEnabled}
                    onCheckedChange={(checked) => handleSettingChange("security", "ssoEnabled", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Audit Logging</Label>
                    <p className="text-sm text-muted-foreground">
                      Track all user actions and changes
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.auditLogging}
                    onCheckedChange={(checked) => handleSettingChange("security", "auditLogging", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Access
              </CardTitle>
              <CardDescription>
                Manage API keys for external integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Primary API Key</h4>
                  <p className="text-sm text-muted-foreground">
                    {showApiKey ? "pk_live_1234567890abcdef..." : "pk_live_••••••••••••••••"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Generate New API Key
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Email Notifications
              </CardTitle>
              <CardDescription>
                Configure when to send email notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(settings.notifications.email).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <Label className="capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </Label>
                  </div>
                  <Switch
                    checked={value as boolean}
                    onCheckedChange={(checked) => handleNestedSettingChange("notifications", "email", key, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Slack Integration</CardTitle>
              <CardDescription>
                Send notifications to your Slack workspace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Slack Notifications</Label>
                <Switch
                  checked={settings.notifications.slack.enabled}
                  onCheckedChange={(checked) => handleNestedSettingChange("notifications", "slack", "enabled", checked)}
                />
              </div>
              {settings.notifications.slack.enabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="slack-webhook">Webhook URL</Label>
                    <Input
                      id="slack-webhook"
                      placeholder="https://hooks.slack.com/services/..."
                      value={settings.notifications.slack.webhookUrl}
                      onChange={(e) => handleNestedSettingChange("notifications", "slack", "webhookUrl", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Default Channels</Label>
                    <div className="flex gap-2">
                      {settings.notifications.slack.channels.map((channel, index) => (
                        <Badge key={index} variant="secondary">
                          {channel}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-1 ml-2"
                            onClick={() => {
                              const newChannels = settings.notifications.slack.channels.filter((_, i) => i !== index);
                              handleNestedSettingChange("notifications", "slack", "channels", newChannels);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Channel
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Settings */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                External Integrations
              </CardTitle>
              <CardDescription>
                Connect with external services and tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(settings.integrations).map(([key, integration]) => (
                <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium capitalize">
                        {key.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {(integration as any).domain && `Domain: ${(integration as any).domain}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={(integration as any).enabled ? "secondary" : "outline"}>
                      {(integration as any).enabled ? "Connected" : "Disabled"}
                    </Badge>
                    <Button variant="outline" size="sm">
                      {(integration as any).enabled ? "Configure" : "Connect"}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding Settings */}
        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Brand Customization
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Organization Logo</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Avatar className="h-16 w-16 rounded-lg">
                      <AvatarImage src={settings.branding.logo} />
                      <AvatarFallback>
                        <Building2 className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload New Logo
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG up to 2MB. Recommended: 200x200px
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-10 h-10 rounded border"
                        style={{ backgroundColor: settings.branding.primaryColor }}
                      />
                      <Input
                        id="primary-color"
                        value={settings.branding.primaryColor}
                        onChange={(e) => handleSettingChange("branding", "primaryColor", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-10 h-10 rounded border"
                        style={{ backgroundColor: settings.branding.secondaryColor }}
                      />
                      <Input
                        id="secondary-color"
                        value={settings.branding.secondaryColor}
                        onChange={(e) => handleSettingChange("branding", "secondaryColor", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-domain">Custom Domain</Label>
                  <Input
                    id="custom-domain"
                    placeholder="your-org.droplog.com"
                    value={settings.branding.customDomain}
                    onChange={(e) => handleSettingChange("branding", "customDomain", e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Use your own domain for the organization workspace
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Settings */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription>
                Manage your organization's data and backups
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="backup-frequency">Backup Frequency</Label>
                    <Select 
                      value={settings.data.backupFrequency} 
                      onValueChange={(value) => handleSettingChange("data", "backupFrequency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="data-retention">Data Retention (days)</Label>
                    <Input
                      id="data-retention"
                      type="number"
                      value={settings.data.dataRetention}
                      onChange={(e) => handleSettingChange("data", "dataRetention", parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Automatic Backups</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically backup organization data
                    </p>
                  </div>
                  <Switch
                    checked={settings.data.autoBackup}
                    onCheckedChange={(checked) => handleSettingChange("data", "autoBackup", checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Data Export & Import</h4>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Organization Data
                  </Button>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Export includes projects, tasks, team members, and settings. 
                  Files and assets are not included in the export.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <h4 className="font-medium text-red-800 mb-2">Delete Organization</h4>
                  <p className="text-sm text-red-700 mb-4">
                    Permanently delete this organization and all associated data. 
                    This action cannot be undone.
                  </p>
                  <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Organization
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Organization</DialogTitle>
                        <DialogDescription>
                          This will permanently delete "{organization.name}" and all associated data including:
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span>All projects and tasks</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span>All team members and permissions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span>All files and assets</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span>All settings and configurations</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="delete-confirmation">
                          Type "{organization.name}" to confirm:
                        </Label>
                        <Input id="delete-confirmation" placeholder={organization.name} />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteOrganization}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Organization
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}