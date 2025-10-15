"use client"

import { useState, useCallback } from 'react'
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface WidgetManagementDialogProps {
  availableWidgets: Array<{
    id: string
    name: string
    description: string
    enabled: boolean
    items: Array<{
      id: string
      name: string
      description: string
      enabled: boolean
    }>
  }>
  onToggleWidget: (widgetId: string, itemId?: string) => void
  onWidgetOrderChange?: (widgetOrder: string[]) => void
  onWidgetItemOrdersChange?: (widgetItemOrders: Record<string, string[]>) => void
  onAvailableWidgetsChange?: (availableWidgets: any[]) => void
  widgetOrder?: string[]
  widgetItemOrders?: Record<string, string[]>
  isSaving?: boolean
  lastSaved?: Date | null
}

export function WidgetManagementDialog({
  availableWidgets,
  onToggleWidget,
  onWidgetOrderChange,
  onWidgetItemOrdersChange,
  onAvailableWidgetsChange,
  widgetOrder = [],
  widgetItemOrders = {},
  isSaving = false,
  lastSaved = null
}: WidgetManagementDialogProps) {
  const [localAvailableWidgets, setLocalAvailableWidgets] = useState(availableWidgets)
  const [localWidgetOrder, setLocalWidgetOrder] = useState(widgetOrder)
  const [localWidgetItemOrders, setLocalWidgetItemOrders] = useState(widgetItemOrders)
  const [openSections, setOpenSections] = useState({
    'summary-cards': false,
    'performance-charts': false,
    'queue-details': false
  })

  const toggleSection = useCallback((sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }, [])

  // Define the ordered widget structure with only requested items
  const widgetStructure = [
    {
      id: 'summary-cards',
      name: 'Summary Cards',
      description: 'Key performance metrics overview',
      items: [
        { id: 'total-interactions', name: 'Total Interactions', description: 'Total number of interactions handled' },
        { id: 'average-wait-time', name: 'Average Wait Time', description: 'Average time customers wait for service' },
        { id: 'service-level', name: 'Service Level', description: 'Percentage of interactions meeting service targets' },
        { id: 'agents-available', name: 'Agents Available', description: 'Number of agents currently available' },
        { id: 'abandonment-rate', name: 'Abandonment Rate', description: 'Percentage of abandoned interactions' },
        { id: 'handle-time', name: 'Average Handle Time', description: 'Average time to handle interactions' }
      ]
    },
    {
      id: 'performance-charts',
      name: 'Performance Charts',
      description: 'Interaction volume and service level trends',
      items: [
        { id: 'interaction-volume', name: 'Interaction Volume', description: 'Bar chart showing interaction trends' },
        { id: 'service-level-trends', name: 'Service Level & Wait Time', description: 'Line chart for service level and wait time' },
        { id: 'agent-performance', name: 'Agent Performance', description: 'Agent efficiency and productivity metrics' },
        { id: 'media-type-breakdown', name: 'Media Type Breakdown', description: 'Pie chart showing interaction distribution by media type' }
      ]
    },
    {
      id: 'queue-details',
      name: 'Queue Details',
      description: 'Detailed metrics for each queue and media type',
      items: [
        { id: 'queue-table', name: 'Queue Performance Table', description: 'Detailed metrics table for all queues' },
        { id: 'queue-summary', name: 'Queue Summary Cards', description: 'Summary cards for key queue metrics' }
      ]
    }
  ]

  // Get widget data from available widgets
  const getWidgetData = (widgetId: string) => {
    return localAvailableWidgets.find(w => w.id === widgetId)
  }

  // Get item data from widget
  const getItemData = (widgetId: string, itemId: string) => {
    const widget = getWidgetData(widgetId)
    return widget?.items?.find(item => item.id === itemId)
  }

  const handleToggleWidget = useCallback((widgetId: string, itemId?: string) => {
    setLocalAvailableWidgets(prev => {
      return prev.map(widget => {
        if (widget.id === widgetId) {
          if (itemId && widget.items) {
            // Find and toggle the specific item
            const updatedItems = widget.items.map(item => {
              if (item.id === itemId) {
                // Check if this is the last enabled item
                const otherEnabledItems = widget.items.filter(i => i.id !== itemId && i.enabled)
                if (item.enabled && otherEnabledItems.length === 0) {
                  return item // Don't disable the last item
                }
                return { ...item, enabled: !item.enabled }
              }
              return item
            })
            return { ...widget, items: updatedItems }
          } else {
            // Toggle the entire widget group
            const newEnabledState = !widget.enabled
            let updatedItems = widget.items
            
            // If enabling and no items are enabled, enable the first one
            if (newEnabledState && widget.items && widget.items.length > 0) {
              const hasEnabledItems = widget.items.some(item => item.enabled)
              if (!hasEnabledItems) {
                updatedItems = widget.items.map((item, index) => 
                  index === 0 ? { ...item, enabled: true } : item
                )
              }
            }
            
            return { ...widget, enabled: newEnabledState, items: updatedItems }
          }
        }
        return widget
      })
    })
    
    // Also call the parent's toggle function
    onToggleWidget(widgetId, itemId)
  }, [onToggleWidget])

  const getEnabledWidgets = () => {
    const enabled = localAvailableWidgets.filter(widget => {
      if (!widget) return false
      
      // If widget has no items (like queue-details), use widget.enabled
      if (!widget.items || widget.items.length === 0) {
        return widget.enabled
      }
      
      // If widget has items, it should be enabled only if:
      // 1. Widget itself is enabled, AND
      // 2. At least one item is enabled
      return widget.enabled && widget.items.some(item => item.enabled)
    })
    
    // Sort enabled widgets according to widgetOrder
    return enabled.sort((a, b) => {
      const indexA = localWidgetOrder.indexOf(a.id)
      const indexB = localWidgetOrder.indexOf(b.id)
      return indexA - indexB
    })
  }

  const getEnabledItems = (widgetId: string) => {
    const widget = localAvailableWidgets.find(w => w.id === widgetId)
    const enabledItems = widget?.items?.filter(item => item.enabled) || []
    
    // Sort enabled items according to widgetItemOrders
    const itemOrder = localWidgetItemOrders[widgetId] || []
    return enabledItems.sort((a, b) => {
      const indexA = itemOrder.indexOf(a.id)
      const indexB = itemOrder.indexOf(b.id)
      return indexA - indexB
    })
  }

  const handleSaveConfiguration = useCallback(async () => {
    try {
      // Update parent state
      if (onAvailableWidgetsChange) {
        onAvailableWidgetsChange(localAvailableWidgets)
      }
      if (onWidgetOrderChange) {
        onWidgetOrderChange(localWidgetOrder)
      }
      if (onWidgetItemOrdersChange) {
        onWidgetItemOrdersChange(localWidgetItemOrders)
      }

      // Save to localStorage
      const widgetConfig = {
        widgetOrder: localWidgetOrder,
        widgetItemOrders: localWidgetItemOrders,
        availableWidgets: localAvailableWidgets,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem('dashboardWidgetConfig', JSON.stringify(widgetConfig))

      // Try to save to backend API
      const response = await fetch('/api/widgets/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          widgetOrder: localWidgetOrder,
          widgetItemOrders: localWidgetItemOrders,
          availableWidgets: localAvailableWidgets
        }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast.success('Widget layout saved successfully')
      } else {
        toast.error('Failed to save widget layout to server')
      }
    } catch (error) {
      console.error('Error saving widget configuration:', error)
      toast.error('Failed to save widget layout')
    }
  }, [localAvailableWidgets, localWidgetOrder, localWidgetItemOrders, onAvailableWidgetsChange, onWidgetOrderChange, onWidgetItemOrdersChange])

  return (
    <DialogContent key="widget-dialog" className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Manage Dashboard Widgets</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Show or hide widget groups and individual items.
        </p>
        <div className="space-y-3 max-h-96 overflow-y-auto" key="widget-list">
          {widgetStructure.map((widgetGroup) => {
            const widgetData = getWidgetData(widgetGroup.id)
            const isWidgetEnabled = widgetData?.enabled || false
            
            return (
              <Collapsible key={`widget-${widgetGroup.id}`} open={openSections[widgetGroup.id]} onOpenChange={() => toggleSection(widgetGroup.id)}>
                <div className="border rounded-lg overflow-hidden">
                  {/* Widget Group Header */}
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center space-x-3 p-3 bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {openSections[widgetGroup.id] ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                            <h4 className="text-sm font-medium">{widgetGroup.name}</h4>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                              {isWidgetEnabled ? 'Show' : 'Hide'}
                            </span>
                            <Switch
                              checked={isWidgetEnabled}
                              onCheckedChange={() => handleToggleWidget(widgetGroup.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground ml-6">{widgetGroup.description}</p>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  
                  {/* Widget Items */}
                  <CollapsibleContent>
                    <div className="p-3 space-y-2 border-t bg-background">
                      <h5 className="text-xs font-medium text-muted-foreground mb-2">Individual Items:</h5>
                      {widgetGroup.items.map((item) => {
                        const itemData = getItemData(widgetGroup.id, item.id)
                        const isItemEnabled = itemData?.enabled || false
                        
                        return (
                          <div key={`item-${item.id}`} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                            <div className="space-y-1">
                              <div className="text-sm font-medium">{item.name}</div>
                              <div className="text-xs text-muted-foreground">{item.description}</div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-muted-foreground">
                                {isItemEnabled ? 'Show' : 'Hide'}
                              </span>
                              <Switch
                                checked={isItemEnabled}
                                onCheckedChange={() => handleToggleWidget(widgetGroup.id, item.id)}
                                disabled={!isWidgetEnabled}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            )
          })}
        </div>
        
        {/* Save Configuration */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {lastSaved && (
              <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
            )}
          </div>
          <button
            onClick={handleSaveConfiguration}
            disabled={isSaving}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </DialogContent>
  )
}