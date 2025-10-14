"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Filter, Settings, RefreshCw, Maximize, Minimize } from 'lucide-react'
import { FadeIn } from '@/components/ui/fade-in'

interface AgentsDashboardHeaderProps {
  showFilters: boolean
  showWidgetDialog: boolean
  onToggleFilters: () => void
  onWidgetDialogChange: (open: boolean) => void
  widgetDialogContent: React.ReactNode
  onRefresh: () => void
  loading: boolean
}

export function AgentsDashboardHeader({
  showFilters,
  showWidgetDialog,
  onToggleFilters,
  onWidgetDialogChange,
  widgetDialogContent,
  onRefresh,
  loading
}: AgentsDashboardHeaderProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  return (
    <FadeIn delay={100}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" role="region" aria-label="Dashboard Controls">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Agents Performance</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Monitor and analyze agent performance metrics and productivity
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto" role="group" aria-label="Dashboard Actions">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onToggleFilters}
            className="cursor-pointer flex-shrink-0 transition-all duration-200 hover:scale-105"
            aria-label={`${showFilters ? 'Hide' : 'Show'} filters panel`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onToggleFilters()
              }
            }}
          >
            <Filter className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{showFilters ? 'Hide' : 'Show'} Filters</span>
            <span className="sm:hidden">{showFilters ? 'Hide' : 'Show'}</span>
          </Button>
          <Dialog open={showWidgetDialog} onOpenChange={onWidgetDialogChange}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="cursor-pointer flex-shrink-0 transition-all duration-200 hover:scale-105"
                aria-label="Manage widgets"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onWidgetDialogChange(true)
                  }
                }}
              >
                <Settings className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Widgets</span>
                <span className="sm:hidden">Widgets</span>
              </Button>
            </DialogTrigger>
            {widgetDialogContent}
          </Dialog>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Toggle Fullscreen"}
            className="cursor-pointer flex-shrink-0 hidden sm:flex transition-all duration-200 hover:scale-105"
            aria-label={isFullscreen ? "Exit fullscreen mode" : "Enter fullscreen mode"}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                toggleFullscreen()
              }
            }}
          >
            {isFullscreen ? (
              <Minimize className="h-4 w-4 mr-2" />
            ) : (
              <Maximize className="h-4 w-4 mr-2" />
            )}
            <span className="hidden sm:inline">{isFullscreen ? 'Minimize' : 'Full Screen'}</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            disabled={loading}
            className="cursor-pointer flex-shrink-0 transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
            aria-label="Refresh dashboard data"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onRefresh()
              }
            }}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
            <span className="sm:hidden">Refresh</span>
          </Button>
        </div>
      </div>
    </FadeIn>
  )
}