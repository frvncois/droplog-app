// components/settings/activity-settings.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Monitor, Download, LogOut, Key, Mail, User } from 'lucide-react'

interface SecurityEvent {
  id: string
  type: 'login' | 'password_change' | 'email_change' | 'profile_update'
  description: string
  timestamp: string
  ipAddress?: string
  location?: string
  device?: string
}

export function ActivitySettings() {
  // Security activity (dummy data)
  const [securityEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      type: 'login',
      description: 'Successful login',
      timestamp: '2025-09-12T10:30:00Z',
      ipAddress: '192.168.1.100',
      location: 'San Francisco, CA',
      device: 'MacBook Pro - Chrome'
    },
    {
      id: '2',
      type: 'profile_update',
      description: 'Profile information updated',
      timestamp: '2025-09-11T14:20:00Z',
      ipAddress: '192.168.1.100',
      location: 'San Francisco, CA',
      device: 'MacBook Pro - Chrome'
    },
    {
      id: '3',
      type: 'login',
      description: 'Successful login',
      timestamp: '2025-09-10T09:15:00Z',
      ipAddress: '10.0.1.55',
      location: 'San Francisco, CA',
      device: 'iPhone - Safari'
    },
    {
      id: '4',
      type: 'password_change',
      description: 'Password changed successfully',
      timestamp: '2025-09-05T16:45:00Z',
      ipAddress: '192.168.1.100',
      location: 'San Francisco, CA',
      device: 'MacBook Pro - Chrome'
    },
    {
      id: '5',
      type: 'email_change',
      description: 'Email address updated',
      timestamp: '2025-08-28T11:30:00Z',
      ipAddress: '192.168.1.100',
      location: 'San Francisco, CA',
      device: 'MacBook Pro - Chrome'
    }
  ])

  const handleDataExport = async () => {
    // Simulate data export request
    console.log('Data export requested')
    alert('Data export request submitted. You will receive an email when your data is ready for download.')
  }

  return (
    <div className="space-y-6">
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            View your recent account activity and security events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityEvents.map((event) => (
              <div key={event.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  {event.type === 'login' && <LogOut className="h-4 w-4 text-blue-600" />}
                  {event.type === 'password_change' && <Key className="h-4 w-4 text-orange-600" />}
                  {event.type === 'email_change' && <Mail className="h-4 w-4 text-purple-600" />}
                  {event.type === 'profile_update' && <User className="h-4 w-4 text-green-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{event.description}</p>
                  <div className="mt-1 text-xs text-muted-foreground space-y-1">
                    <p>{new Date(event.timestamp).toLocaleString()}</p>
                    {event.ipAddress && (
                      <p>IP: {event.ipAddress} • {event.location}</p>
                    )}
                    {event.device && <p>{event.device}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Data Export
          </CardTitle>
          <CardDescription>
            Download a copy of your account data and activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You can request an export of your personal data, including profile information, 
              projects, tasks, and activity history. The export will be sent to your email address.
            </p>
            <Button variant="outline" onClick={handleDataExport}>
              <Download className="h-4 w-4 mr-2" />
              Request Data Export
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}