// app/help/page.tsx
'use client'

import { HelpHeader } from '@/components/help/help-header'
import { HelpSearch } from '@/components/help/help-search'
import { HelpQuickActions } from '@/components/help/help-quick-actions'
import { HelpTabs } from '@/components/help/help-tabs'

export default function HelpPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <HelpHeader />
      <HelpSearch />
      <HelpQuickActions />
      <HelpTabs />
    </div>
  )
}