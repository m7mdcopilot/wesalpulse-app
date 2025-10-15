"use client"

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Filter, Settings, GripVertical } from 'lucide-react'

interface DashboardHeaderProps {
  showFilters: boolean
  showWidgetDialog: boolean
  availableWidgets: any[]
  setShowFilters: (show: boolean) => void
  setShowWidgetDialog: (show: boolean) => void
  toggleWidget: (widgetId: string, itemId?: string) => void
}

export function DashboardHeader({
  showFilters,
  showWidgetDialog,
  availableWidgets,
  setShowFilters,
  setShowWidgetDialog,
  toggleWidget
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Queue Performance Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor and analyze queue performance metrics across all media types
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          {showFilters ? 'Hide' : 'Show'} Filters
        </Button>
        <Dialog open={showWidgetDialog} onOpenChange={setShowWidgetDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Widgets
            </Button>
          </DialogTrigger>
          <DialogContent key="widget-dialog" className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Manage Dashboard Widgets</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Show or hide widget groups and individual items.
              </p>
              <div className="space-y-3 max-h-96 overflow-y-auto" key="widget-list">
                {availableWidgets.map((widget) => (
                  <div key={`widget-${widget.id}`} className="border rounded-lg overflow-hidden">
                    {/* Widget Group Header */}
                    <div className="flex items-center space-x-3 p-3 bg-muted/30">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">{widget.name}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                              {widget.enabled ? 'Show' : 'Hide'}
                            </span>
                            <Switch
                              checked={widget.enabled}
                              onCheckedChange={() => toggleWidget(widget.id)}
                            />
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{widget.description}</p>
                      </div>
                    </div>
                    
                    {/* Widget Items */}
                    {widget.enabled && widget.items && widget.items.length > 0 && (
                      <div className="p-3 space-y-2 bg-background">
                        <h5 className="text-xs font-medium text-muted-foreground">Items:</h5>
                        <div className="space-y-1">
                          {widget.items.map((item: any) => (
                            <div key={`item-${item.id}`} className="flex items-center justify-between p-2 rounded bg-muted/20">
                              <div className="flex items-center space-x-2">
                                <GripVertical className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">{item.name}</span>
                              </div>
                              <Switch
                                checked={item.enabled}
                                onCheckedChange={() => toggleWidget(widget.id, item.id)}
                                size="sm"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}