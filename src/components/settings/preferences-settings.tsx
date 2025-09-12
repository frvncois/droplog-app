// components/settings/preferences-settings.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Bell, Eye } from 'lucide-react'

interface AccountSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  marketingEmails: boolean
  weeklyDigest: boolean
  projectUpdates: boolean
  taskAssignments: boolean
  mentions: boolean
  profileVisibility: 'public' | 'private' | 'team'
  activityStatus: boolean
}

export function PreferencesSettings() {
  // Account settings
  const [accountSettings, setAccountSettings] = useState<AccountSettings>({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    weeklyDigest: true,
    projectUpdates: true,
    taskAssignments: true,
    mentions: true,
    profileVisibility: 'team',
    activityStatus: true
  })

  const handleSettingChange = (key: keyof AccountSettings, value: any) => {
    setAccountSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Choose how you want to be notified about activity and updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                checked={accountSettings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive push notifications in your browser
                </p>
              </div>
              <Switch
                checked={accountSettings.pushNotifications}
                onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly digest</Label>
                <p className="text-sm text-muted-foreground">
                  Get a weekly summary of your projects and tasks
                </p>
              </div>
              <Switch
                checked={accountSettings.weeklyDigest}
                onCheckedChange={(checked) => handleSettingChange('weeklyDigest', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Project updates</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when projects you're involved in are updated
                </p>
              </div>
              <Switch
                checked={accountSettings.projectUpdates}
                onCheckedChange={(checked) => handleSettingChange('projectUpdates', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Task assignments</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when tasks are assigned to you
                </p>
              </div>
              <Switch
                checked={accountSettings.taskAssignments}
                onCheckedChange={(checked) => handleSettingChange('taskAssignments', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mentions and comments</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when someone mentions you or comments on your work
                </p>
              </div>
              <Switch
                checked={accountSettings.mentions}
                onCheckedChange={(checked) => handleSettingChange('mentions', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Marketing emails</Label>
                <p className="text-sm text-muted-foreground">
                  Receive occasional emails about new features and updates
                </p>
              </div>
              <Switch
                checked={accountSettings.marketingEmails}
                onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Visibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Privacy & Visibility
          </CardTitle>
          <CardDescription>
            Control who can see your profile and activity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Profile visibility</Label>
              <Select value={accountSettings.profileVisibility} onValueChange={(value: any) => handleSettingChange('profileVisibility', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public - Anyone can see your profile</SelectItem>
                  <SelectItem value="team">Team - Only team members can see your profile</SelectItem>
                  <SelectItem value="private">Private - Only you can see your profile</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show activity status</Label>
                <p className="text-sm text-muted-foreground">
                  Let others see when you're online or active
                </p>
              </div>
              <Switch
                checked={accountSettings.activityStatus}
                onCheckedChange={(checked) => handleSettingChange('activityStatus', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}