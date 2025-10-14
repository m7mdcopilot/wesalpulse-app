"use client"

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ScaleInProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
}

export function ScaleIn({ 
  children, 
  className, 
  delay = 0, 
  duration = 200 
}: ScaleInProps) {
  return (
    <div
      className={cn(
        "animate-in zoom-in",
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  )
}