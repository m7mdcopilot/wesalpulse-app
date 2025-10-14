"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { GripVertical, Phone, MessageSquare, Mail, Headphones } from 'lucide-react'
import { SortableWidget, SortableWidgetItem } from './SortableComponents'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'

interface PerformanceChartsWidgetProps {
  widget: any
  loading: boolean
  trendData: any[]
  queueMetrics: Array<{
    queueName: string
    mediaType: string
    offered: number
    serviceLevel: number
    occupancy: number
    agentsAvailable: number
  }>
  enabledItems: Array<{
    id: string
    name: string
    description: string
    enabled: boolean
  }>
  formatPercentage: (value: number) => string
}

export function PerformanceChartsWidget({
  widget,
  loading,
  trendData,
  queueMetrics,
  enabledItems,
  formatPercentage
}: PerformanceChartsWidgetProps) {
  // Hide entire widget section if widget is disabled
  if (!widget.enabled) {
    return null
  }

  const getMediaTypeIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'voice':
        return <Phone className="h-4 w-4" />
      case 'chat':
        return <MessageSquare className="h-4 w-4" />
      case 'email':
        return <Mail className="h-4 w-4" />
      case 'callback':
        return <Headphones className="h-4 w-4" />
      default:
        return <Phone className="h-4 w-4" />
    }
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
              <CardTitle>Performance Charts</CardTitle>
              <CardDescription>Interaction volume and service level trends</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <SortableContext 
              items={enabledItems.map(item => `${widget.id}-${item.id}`)} 
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {enabledItems.map((item) => (
                  <SortableWidgetItem key={item.id} item={item} widgetId={widget.id}>
                    {({ attributes: itemAttributes, listeners: itemListeners }: any) => (
                      <>
                        {item.id === 'interaction-volume' && (
                          <Card className="group/item relative">
                            <div 
                              className="absolute left-2 top-2 z-10 cursor-grab active:cursor-grabbing opacity-0 group-hover/item:opacity-100 transition-opacity" 
                              {...itemAttributes} 
                              {...itemListeners}
                            >
                              <GripVertical className="h-3 w-3 text-muted-foreground" />
                            </div>
                            <CardHeader>
                              <div>
                                <CardTitle>Interaction Volume</CardTitle>
                                <CardDescription>Number of interactions over time</CardDescription>
                              </div>
                            </CardHeader>
                            <CardContent>
                              {loading ? (
                                <Skeleton className="h-[300px] w-full" />
                              ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                  <BarChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="time" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="interactions" fill="#8884d8" />
                                  </BarChart>
                                </ResponsiveContainer>
                              )}
                            </CardContent>
                          </Card>
                        )}

                        {item.id === 'service-level-trends' && (
                          <Card className="group/item relative">
                            <div 
                              className="absolute left-2 top-2 z-10 cursor-grab active:cursor-grabbing opacity-0 group-hover/item:opacity-100 transition-opacity" 
                              {...itemAttributes} 
                              {...itemListeners}
                            >
                              <GripVertical className="h-3 w-3 text-muted-foreground" />
                            </div>
                            <CardHeader>
                              <div>
                                <CardTitle>Service Level & Wait Time</CardTitle>
                                <CardDescription>Service level percentage and average wait time trends</CardDescription>
                              </div>
                            </CardHeader>
                            <CardContent>
                              {loading ? (
                                <Skeleton className="h-[300px] w-full" />
                              ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                  <LineChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="time" />
                                    <YAxis yAxisId="left" />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <Tooltip />
                                    <Line yAxisId="left" type="monotone" dataKey="serviceLevel" stroke="#82ca9d" name="Service Level %" />
                                    <Line yAxisId="right" type="monotone" dataKey="waitTime" stroke="#8884d8" name="Wait Time (s)" />
                                  </LineChart>
                                </ResponsiveContainer>
                              )}
                            </CardContent>
                          </Card>
                        )}
                        {item.id === 'agent-performance' && (
                          <Card className="group/item relative">
                            <div 
                              className="absolute left-2 top-2 z-10 cursor-grab active:cursor-grabbing opacity-0 group-hover/item:opacity-100 transition-opacity" 
                              {...itemAttributes} 
                              {...itemListeners}
                            >
                              <GripVertical className="h-3 w-3 text-muted-foreground" />
                            </div>
                            <CardHeader>
                              <div>
                                <CardTitle>Agent Performance</CardTitle>
                                <CardDescription>Agent efficiency and productivity metrics</CardDescription>
                              </div>
                            </CardHeader>
                            <CardContent>
                              {loading ? (
                                <Skeleton className="h-[300px] w-full" />
                              ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                  <BarChart data={queueMetrics.slice(0, 10)}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="queueName" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="occupancy" fill="#8884d8" name="Occupancy %" />
                                    <Bar dataKey="agentsAvailable" fill="#82ca9d" name="Available Agents" />
                                  </BarChart>
                                </ResponsiveContainer>
                              )}
                            </CardContent>
                          </Card>
                        )}
                        {item.id === 'media-type-breakdown' && (
                          <Card className="group/item relative">
                            <div 
                              className="absolute left-2 top-2 z-10 cursor-grab active:cursor-grabbing opacity-0 group-hover/item:opacity-100 transition-opacity" 
                              {...itemAttributes} 
                              {...itemListeners}
                            >
                              <GripVertical className="h-3 w-3 text-muted-foreground" />
                            </div>
                            <CardHeader>
                              <div>
                                <CardTitle>Media Type Breakdown</CardTitle>
                                <CardDescription>Interaction distribution by media type</CardDescription>
                              </div>
                            </CardHeader>
                            <CardContent>
                              {loading ? (
                                <Skeleton className="h-[300px] w-full" />
                              ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <h4 className="font-medium">By Volume</h4>
                                    {Object.entries(
                                      queueMetrics.reduce((acc, q) => {
                                        acc[q.mediaType] = (acc[q.mediaType] || 0) + q.offered
                                        return acc
                                      }, {} as Record<string, number>)
                                    ).map(([mediaType, count]) => (
                                      <div key={mediaType} className="flex justify-between">
                                        <div className="flex items-center gap-2">
                                          {getMediaTypeIcon(mediaType)}
                                          <span className="capitalize">{mediaType}</span>
                                        </div>
                                        <span className="font-medium">{count}</span>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="space-y-2">
                                    <h4 className="font-medium">Service Level</h4>
                                    {Object.entries(
                                      queueMetrics.reduce((acc, q) => {
                                        if (!acc[q.mediaType]) {
                                          acc[q.mediaType] = { total: 0, count: 0 }
                                        }
                                        acc[q.mediaType].total += q.serviceLevel
                                        acc[q.mediaType].count += 1
                                        return acc
                                      }, {} as Record<string, { total: number; count: number }>)
                                    ).map(([mediaType, data]) => (
                                      <div key={mediaType} className="flex justify-between">
                                        <div className="flex items-center gap-2">
                                          {getMediaTypeIcon(mediaType)}
                                          <span className="capitalize">{mediaType}</span>
                                        </div>
                                        <span className="font-medium">
                                          {formatPercentage(data.total / data.count)}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )}
                      </>
                    )}
                  </SortableWidgetItem>
                ))}
              </div>
            </SortableContext>
          </CardContent>
        </Card>
      )}
    </SortableWidget>
  )
}