"use client"

import { ReactNode } from 'react'
import { SidebarNavigation } from './sidebar-navigation'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <SidebarNavigation />
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}