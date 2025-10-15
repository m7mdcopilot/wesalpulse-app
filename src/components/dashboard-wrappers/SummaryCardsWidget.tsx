"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, Clock, TrendingUp, X, Phone, PhoneIncoming, PhoneOff } from 'lucide-react'
import { GripVertical } from 'lucide-react'
import { SortableWidget, SortableWidgetItem } from './SortableComponents'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'

interface SummaryCardsWidgetProps {
  widget: any
  loading: boolean
  summaryMetrics: {
    totalInteractions: number
    totalHandled: number
    totalAbandoned: number
    totalOffered: number
    averageWaitTime: number
    averageHandleTime: number
    overallServiceLevel: number
    totalAgentsAvailable: number
    totalAgentsOnQueue: number
  } | null
  queueMetrics: Array<{
    longestWaitTime: number
  }>
  enabledItems: Array<{
    id: string
    name: string
    description: string
    enabled: boolean
  }>
  formatDuration: (seconds: number) => string
  formatPercentage: (value: number) => string
  getServiceLevelColor: (serviceLevel: number) => string
}

export function SummaryCardsWidget({
  widget,
  loading,
  summaryMetrics,
  queueMetrics,
  enabledItems,
  formatDuration,
  formatPercentage,
  getServiceLevelColor
}: SummaryCardsWidgetProps) {
  // Hide entire widget section if widget is disabled
  if (!widget.enabled) {
    return null
  }

  return (
    <SortableWidget widget={widget}>
      {({ attributes, listeners }: any) => (
        <Card className="relative">
          <div 
            className="absolute left-2 top-2 z-10 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity" 
            {...attributes} 
            {...listeners}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <CardHeader>
            <div>
              <CardTitle>Summary Cards</CardTitle>
              <CardDescription>Key performance metrics overview</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array.from({ length: enabledItems.length || 4 }).map((_, i) => (
                    <Card key={i}>
                      <CardHeader className="pb-2">
                        <Skeleton className="h-4 w-20" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-8 w-16" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : summaryMetrics && (
                <SortableContext 
                  items={enabledItems.map(item => `${widget.id}-${item.id}`)} 
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {enabledItems.map((item) => (
                      <SortableWidgetItem key={item.id} item={item} widgetId={widget.id}>
                        {({ attributes: itemAttributes, listeners: itemListeners }: any) => (
                          <>
                            {item.id === 'total-interactions' && (
                              <Card className="group/item relative">
                                <div 
                                  className="absolute left-2 top-2 z-10 cursor-grab active:cursor-grabbing opacity-0 group-hover/item:opacity-100 transition-opacity" 
                                  {...itemAttributes} 
                                  {...itemListeners}
                                >
                                  <GripVertical className="h-3 w-3 text-muted-foreground" />
                                </div>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                  <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
                                  <Phone className="h-4 w-4 text-muted-foreground" style={{ width: '30px', height: '30px' }} />
                                </CardHeader>
                                <CardContent>
                                  <div className="text-2xl font-bold truncate">{summaryMetrics?.totalInteractions || 0}</div>
                                  <p className="text-xs text-muted-foreground">
                                    {summaryMetrics?.totalHandled || 0} handled, {summaryMetrics?.totalAbandoned || 0} abandoned
                                  </p>
                                </CardContent>
                              </Card>
                            )}

                            {item.id === 'average-wait-time' && (
                              <Card className="group/item relative">
                                <div 
                                  className="absolute left-2 top-2 z-10 cursor-grab active:cursor-grabbing opacity-0 group-hover/item:opacity-100 transition-opacity" 
                                  {...itemAttributes} 
                                  {...itemListeners}
                                >
                                  <GripVertical className="h-3 w-3 text-muted-foreground" />
                                </div>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                  <CardTitle className="text-sm font-medium">Average Wait Time</CardTitle>
                                  <Clock className="h-4 w-4 text-muted-foreground" style={{ width: '30px', height: '30px' }} />
                                </CardHeader>
                                <CardContent>
                                  <div className="text-2xl font-bold">{formatDuration(summaryMetrics?.averageWaitTime || 0)}</div>
                                  <p className="text-xs text-muted-foreground">
                                    Longest: {queueMetrics.length > 0 ? formatDuration(Math.max(...queueMetrics.map(q => q.longestWaitTime))) : '0:00'}
                                  </p>
                                </CardContent>
                              </Card>
                            )}

                            {item.id === 'service-level' && (
                              <Card className="group/item relative">
                                <div 
                                  className="absolute left-2 top-2 z-10 cursor-grab active:cursor-grabbing opacity-0 group-hover/item:opacity-100 transition-opacity" 
                                  {...itemAttributes} 
                                  {...itemListeners}
                                >
                                  <GripVertical className="h-3 w-3 text-muted-foreground" />
                                </div>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                  <CardTitle className="text-sm font-medium">Service Level</CardTitle>
                                  <TrendingUp className="h-4 w-4 text-muted-foreground" style={{ width: '30px', height: '30px' }} />
                                </CardHeader>
                                <CardContent>
                                  <div className={`text-2xl font-bold ${getServiceLevelColor(summaryMetrics?.overallServiceLevel || 0)}`}>
                                    {formatPercentage(summaryMetrics?.overallServiceLevel || 0)}
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    Target: 80%
                                  </p>
                                </CardContent>
                              </Card>
                            )}

                            {item.id === 'agents-available' && (
                              <Card className="group/item relative">
                                <div 
                                  className="absolute left-2 top-2 z-10 cursor-grab active:cursor-grabbing opacity-0 group-hover/item:opacity-100 transition-opacity" 
                                  {...itemAttributes} 
                                  {...itemListeners}
                                >
                                  <GripVertical className="h-3 w-3 text-muted-foreground" />
                                </div>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                  <CardTitle className="text-sm font-medium">Agents Available</CardTitle>
                                  <Users className="h-4 w-4 text-muted-foreground" style={{ width: '30px', height: '30px' }} />
                                </CardHeader>
                                <CardContent>
                                  <div className="text-2xl font-bold">{summaryMetrics?.totalAgentsAvailable || 0}</div>
                                  <p className="text-xs text-muted-foreground">
                                    {summaryMetrics?.totalAgentsOnQueue || 0} total on queue
                                  </p>
                                </CardContent>
                              </Card>
                            )}
                            {item.id === 'abandonment-rate' && (
                              <Card className="group/item relative">
                                <div 
                                  className="absolute left-2 top-2 z-10 cursor-grab active:cursor-grabbing opacity-0 group-hover/item:opacity-100 transition-opacity" 
                                  {...itemAttributes} 
                                  {...itemListeners}
                                >
                                  <GripVertical className="h-3 w-3 text-muted-foreground" />
                                </div>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                  <CardTitle className="text-sm font-medium">Abandonment Rate</CardTitle>
                                  <PhoneOff className="h-4 w-4 text-muted-foreground" style={{ width: '30px', height: '30px' }} />
                                </CardHeader>
                                <CardContent>
                                  <div className="text-2xl font-bold text-red-600">
                                    {summaryMetrics?.totalOffered && summaryMetrics?.totalAbandoned 
                                      ? formatPercentage((summaryMetrics.totalAbandoned / summaryMetrics.totalOffered) * 100)
                                      : '0%'
                                    }
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {summaryMetrics?.totalAbandoned || 0} abandoned of {summaryMetrics?.totalOffered || 0} offered
                                  </p>
                                </CardContent>
                              </Card>
                            )}
                            {item.id === 'handle-time' && (
                              <Card className="group/item relative">
                                <div 
                                  className="absolute left-2 top-2 z-10 cursor-grab active:cursor-grabbing opacity-0 group-hover/item:opacity-100 transition-opacity" 
                                  {...itemAttributes} 
                                  {...itemListeners}
                                >
                                  <GripVertical className="h-3 w-3 text-muted-foreground" />
                                </div>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                  <CardTitle className="text-sm font-medium">Avg Handle Time</CardTitle>
                                  <PhoneIncoming className="h-4 w-4 text-muted-foreground" style={{ width: '30px', height: '30px' }} />
                                </CardHeader>
                                <CardContent>
                                  <div className="text-2xl font-bold">{formatDuration(summaryMetrics?.averageHandleTime || 0)}</div>
                                  <p className="text-xs text-muted-foreground">
                                    Average time per interaction
                                  </p>
                                </CardContent>
                              </Card>
                            )}
                          </>
                        )}
                      </SortableWidgetItem>
                    ))}
                  </div>
                </SortableContext>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </SortableWidget>
  )
}