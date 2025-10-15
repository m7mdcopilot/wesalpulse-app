"use client"

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SlideInProps {
  children: ReactNode
  className?: string
  direction?: 'left' | 'right' | 'up' | 'down'
  delay?: number
  duration?: number
}

export function SlideIn({ 
  children, 
  className, 
  direction = 'left',
  delay = 0, 
  duration = 300 
}: SlideInProps) {
  const getAnimationClass = () => {
    switch (direction) {
      case 'left':
        return 'slide-in-from-left'
      case 'right':
        return 'slide-in-from-right'
      case 'up':
        return 'slide-in-from-top'
      case 'down':
        return 'slide-in-from-bottom'
      default:
        return 'slide-in-from-left'
    }
  }

  return (
    <div
      className={cn(
        "animate-in",
        getAnimationClass(),
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