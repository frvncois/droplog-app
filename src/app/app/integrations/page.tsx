// app/integrations/page.tsx
'use client'

import { IntegrationsView } from '@/components/integrations/integrations-view'

export default function IntegrationsPage() {
  return (
    <div className="container p-6 max-w-6xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Integrations</h1>
        <p className="text-gray-600">
          Connect your favorite tools and services to streamline your workflow across all projects
        </p>
      </div>

      <IntegrationsView />
    </div>
  )
}