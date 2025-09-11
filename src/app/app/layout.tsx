'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { GlobalCommandBar } from "@/components/global-command-bar"
import { Search, Command } from "lucide-react"
import { projects } from '@/lib/utils/dummy-data'

interface BreadcrumbItem {
  label: string
  href?: string
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [commandOpen, setCommandOpen] = useState(false)

  // Generate dynamic breadcrumbs based on current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Droplog', href: '/app' }
    ]

    if (segments.length <= 1) {
      breadcrumbs.push({ label: 'Dashboard' })
      return breadcrumbs
    }

    // Remove 'app' from segments if it exists
    const appSegments = segments[0] === 'app' ? segments.slice(1) : segments

    for (let i = 0; i < appSegments.length; i++) {
      const segment = appSegments[i]
      const isLast = i === appSegments.length - 1
      
      // Build the href for non-last segments
      const href = isLast ? undefined : `/app/${appSegments.slice(0, i + 1).join('/')}`
      
      switch (segment) {
        case 'workspace':
          breadcrumbs.push({ label: 'Workspace', href })
          break
        case 'projects':
          if (i + 1 < appSegments.length && appSegments[i + 1] !== 'new') {
            // This is a project ID
            const projectId = appSegments[i + 1]
            const project = projects.find(p => p.id === projectId)
            breadcrumbs.push({ label: 'Projects', href: '/app/projects' })
            breadcrumbs.push({ 
              label: project?.title || 'Project', 
              href: isLast || i + 1 === appSegments.length - 1 ? undefined : `/app/projects/${projectId}`
            })
            i++ // Skip the next segment since we handled it
          } else {
            breadcrumbs.push({ label: 'Projects', href })
          }
          break
        case 'tasks':
          breadcrumbs.push({ label: 'Tasks', href })
          break
        case 'assets':
          breadcrumbs.push({ label: 'Assets', href })
          break
        case 'team':
          breadcrumbs.push({ label: 'Team', href })
          break
        case 'documentation':
          breadcrumbs.push({ label: 'Documentation', href })
          break
        case 'integrations':
          breadcrumbs.push({ label: 'Integrations', href })
          break
        case 'settings':
          breadcrumbs.push({ label: 'Settings', href })
          break
        case 'new':
          breadcrumbs.push({ label: 'New' })
          break
        case 'edit':
          breadcrumbs.push({ label: 'Edit' })
          break
        case 'preview':
          breadcrumbs.push({ label: 'Preview' })
          break
        default:
          // Capitalize first letter for unknown segments
          breadcrumbs.push({ 
            label: segment.charAt(0).toUpperCase() + segment.slice(1), 
            href 
          })
      }
    }

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  // Handle keyboard shortcut for command bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-4 px-4 flex-1">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            
            {/* Dynamic Breadcrumbs */}
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center">
                    {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                    <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                      {crumb.href ? (
                        <BreadcrumbLink href={crumb.href}>
                          {crumb.label}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Command Bar Trigger */}
          <div className="flex items-center gap-2 px-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCommandOpen(true)}
              className="relative h-8 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
            >
              <Search className="mr-2 h-4 w-4" />
              <span className="hidden lg:inline-flex">Search everything...</span>
              <span className="inline-flex lg:hidden">Search...</span>
              <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>

      {/* Global Command Bar */}
      <GlobalCommandBar open={commandOpen} onOpenChange={setCommandOpen} />
    </SidebarProvider>
  )
}