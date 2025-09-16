// app/settings/account/page.tsx
'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileSettings } from '@/components/settings/profile-settings'
import { PreferencesSettings } from '@/components/settings/preferences-settings'
import { SecuritySettings } from '@/components/settings/security-settings'
import { ActivitySettings } from '@/components/settings/activity-settings'
import { DangerZone } from '@/components/settings/danger-zone'
import { Separator } from '@/components/ui/separator'
import { 
  User, 
  SettingsIcon, 
  Shield, 
  Monitor
} from 'lucide-react'

export default function AccountSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div className="container p-6 max-w-6xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Account Settings</h1>
        <p className="text-gray-600">
          Manage your personal information, preferences, and account security
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="preferences">
          <PreferencesSettings />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="activity">
          <ActivitySettings />
        </TabsContent>
      </Tabs>

      <Separator className="my-8" />

      <DangerZone />
    </div>
  )
}