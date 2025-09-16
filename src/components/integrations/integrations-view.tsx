// components/integrations/integrations-view.tsx
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
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Plug,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  MessageSquare,
  Cloud,
  Github,
  Grid3X3,
  Calendar,
  HardDrive,
  FileText,
  MessageCircle,
  Users,
  Bug,
  Activity,
  Zap,
  Settings2,
  Webhook,
  Trello,
  Droplets,
  GitBranch
} from 'lucide-react'
import { integrations, webhooks } from '@/lib/utils/dummy-data-integrations'
import { IntegrationCard } from './integration-card'

// Icon mapping for integrations
const iconMap = {
  Calendar,
  Grid3X3,
  FileText,
  HardDrive,
  Cloud,
  Droplets,
  MessageSquare,
  MessageCircle,
  Users,
  Github,
  GitBranch,
  Bug,
  BarChart3,
  Activity,
  Zap,
  Settings2,
  Webhook,
  Trello,
  CheckCircle,
  XCircle,
  Clock
}

export function IntegrationsView() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Group integrations by category
  const categories = [
    { key: 'all', label: 'All Integrations', icon: Plug },
    { key: 'productivity', label: 'Productivity', icon: CheckCircle },
    { key: 'storage', label: 'Storage', icon: Cloud },
    { key: 'communication', label: 'Communication', icon: MessageSquare },
    { key: 'development', label: 'Development', icon: Github },
    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
    { key: 'automation', label: 'Automation', icon: Zap }
  ]

  const filteredIntegrations = selectedCategory === 'all' 
    ? integrations 
    : integrations.filter(integration => integration.category === selectedCategory)

  // Statistics
  const connectedCount = integrations.filter(i => i.status === 'connected').length
  const availableCount = integrations.filter(i => i.status === 'disconnected').length
  const errorCount = integrations.filter(i => i.status === 'error').length
  const activeWebhooksCount = webhooks.filter(w => w.status === 'active').length

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />
      default: return <XCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Connected</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge variant="outline">Available</Badge>
    }
  }

  const getPlanBadge = (plan: string | null) => {
    if (!plan) return null
    
    switch (plan) {
      case 'free':
        return <Badge variant="secondary" className="text-xs">Free</Badge>
      case 'pro':
        return <Badge variant="default" className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-100">Pro</Badge>
      case 'enterprise':
        return <Badge variant="default" className="text-xs bg-purple-100 text-purple-800 hover:bg-purple-100">Enterprise</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">


        {/* Integrations Tab */}
        <div className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-4 mb-6">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <Button
                  key={category.key}
                  variant={selectedCategory === category.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.key)}
                  className="flex items-center gap-2"
                >
                  <IconComponent className="h-4 w-4" />
                  {category.label}
                </Button>
              )
            })}
          </div>

          {/* Integrations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIntegrations.map((integration) => {
              const IconComponent = iconMap[integration.icon as keyof typeof iconMap] || Plug
              
              return (
                <IntegrationCard
                  key={integration.id}
                  integration={integration}
                  icon={IconComponent}
                  statusIcon={getStatusIcon(integration.status)}
                  statusBadge={getStatusBadge(integration.status)}
                  planBadge={getPlanBadge(integration.plan)}
                />
              )
            })}
          </div>

          {filteredIntegrations.length === 0 && (
            <div className="text-center py-12">
              <Plug className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No integrations found
              </h3>
              <p className="text-sm text-muted-foreground">
                Try selecting a different category or check back later for new integrations.
              </p>
            </div>
          )}
    </div>
    </div>
  )
}