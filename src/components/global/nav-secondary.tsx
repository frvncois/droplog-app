"use client"

import * as React from "react"
import { type LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url?: string
    icon?: LucideIcon
    component?: React.ReactNode
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname()

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            // If a custom component exists, render it directly
            if (item.component) {
              return (
                <SidebarMenuItem key={item.title}>
                  {item.component}
                </SidebarMenuItem>
              )
            }

            const isActive = item.url ? pathname.startsWith(item.url) : false

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
                  <Link href={item.url!}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
