"use client"

import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingOverlayProps {
  isLoading: boolean
  message?: string
  className?: string
}

export function LoadingOverlay({ 
  isLoading, 
  message = "Loading...", 
  className 
}: LoadingOverlayProps) {
  if (!isLoading) return null

  return (
    <div className={cn(
      "fixed inset-0 bg-background/80 backdrop-blur-sm z-50",
      "flex items-center justify-center",
      className
    )}>
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">{message}</p>
      </div>
    </div>
  )
}