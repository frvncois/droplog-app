// components/integrations/integration-card.tsx
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  MoreHorizontal,
  Settings,
  Unlink,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'
import { type Integration } from '@/lib/utils/dummy-data-integrations'
import { formatRelativeTime } from '@/lib/utils'

interface IntegrationCardProps {
  integration: Integration
  icon: React.ComponentType<any>
  statusIcon: React.ReactNode
  statusBadge: React.ReactNode
  planBadge: React.ReactNode
}

export function IntegrationCard({ 
  integration, 
  icon: IconComponent, 
  statusIcon, 
  statusBadge, 
  planBadge 
}: IntegrationCardProps) {
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleConnect = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    // In real app, update integration status
  }

  const handleDisconnect = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    // In real app, update integration status
  }

  const handleSync = async () => {
    setIsLoading(true)
    // Simulate sync
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
  }

  return (
    <>
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                <IconComponent className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-base flex items-center gap-2">
                  {integration.name}
                  {statusIcon}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {statusBadge}
                  {planBadge}
                </div>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {integration.status === 'connected' ? (
                  <>
                    <DropdownMenuItem onClick={() => setIsConfigOpen(true)}>
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSync} disabled={isLoading}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync Now
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDisconnect} disabled={isLoading}>
                      <Unlink className="h-4 w-4 mr-2" />
                      Disconnect
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={handleConnect} disabled={isLoading}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Connect
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <CardDescription className="text-sm">
            {integration.description}
          </CardDescription>

          {/* Connection Info */}
          {integration.status === 'connected' && (
            <div className="space-y-2 text-xs text-muted-foreground">
              {integration.lastSync && (
                <div className="flex justify-between">
                  <span>Last synced:</span>
                  <span>{formatRelativeTime(integration.lastSync)}</span>
                </div>
              )}
              {integration.syncFrequency && (
                <div className="flex justify-between">
                  <span>Sync frequency:</span>
                  <span className="capitalize">{integration.syncFrequency}</span>
                </div>
              )}
            </div>
          )}

          {/* Error State */}
          {integration.status === 'error' && (
            <div className="flex items-center gap-2 p-2 bg-red-50 text-red-700 rounded text-xs">
              <AlertCircle className="h-3 w-3" />
              <span>Connection failed. Check settings.</span>
            </div>
          )}

          {/* Features */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">Features:</div>
            <div className="space-y-1">
              {integration.features.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
              {integration.features.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{integration.features.length - 3} more
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            {integration.status === 'connected' ? (
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={() => setIsConfigOpen(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            ) : (
              <Button 
                size="sm" 
                className="w-full" 
                onClick={handleConnect}
                disabled={isLoading}
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ExternalLink className="h-4 w-4 mr-2" />
                )}
                {isLoading ? 'Connecting...' : 'Connect'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Dialog */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IconComponent className="h-5 w-5" />
              Configure {integration.name}
            </DialogTitle>
            <DialogDescription>
              Manage settings and preferences for this integration
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Current Status */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div>{statusIcon}</div>
                <div>
                  <div className="font-medium">Connection Status</div>
                  <div className="text-sm text-muted-foreground">
                    {integration.status === 'connected' ? 'Successfully connected' : 'Not connected'}
                  </div>
                </div>
              </div>
              {statusBadge}
            </div>

            {/* Settings */}
            {integration.settings && (
              <div className="space-y-4">
                <h4 className="font-medium">Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(integration.settings).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</Label>
                      {typeof value === 'boolean' ? (
                        <div className="flex items-center space-x-2">
                          <Switch checked={value} />
                          <span className="text-sm text-muted-foreground">
                            {value ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      ) : (
                        <Input 
                          value={Array.isArray(value) ? value.join(', ') : String(value)}
                          placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Features */}
            <div className="space-y-4">
              <h4 className="font-medium">Available Features</h4>
              <div className="grid grid-cols-2 gap-2">
                {integration.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Types */}
            {integration.dataTypes && (
              <div className="space-y-4">
                <h4 className="font-medium">Synchronized Data</h4>
                <div className="flex flex-wrap gap-2">
                  {integration.dataTypes.map((dataType) => (
                    <Badge key={dataType} variant="secondary">
                      {dataType.replace(/[_-]/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
                Cancel
              </Button>
              <Button>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}