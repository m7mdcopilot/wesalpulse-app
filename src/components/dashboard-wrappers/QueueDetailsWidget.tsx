"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { GripVertical, Phone, Users, X, TrendingUp, PhoneIncoming, PhoneOff, MessageSquare, Mail, Headphones } from 'lucide-react'
import { SortableWidget, SortableWidgetItem } from './SortableComponents'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

interface QueueDetailsWidgetProps {
  widget: any
  loading: boolean
  queueMetrics: Array<{
    queueId: string
    queueName: string
    mediaType: string
    offered: number
    handled: number
    abandoned: number
    averageWaitTime: number
    averageHandleTime: number
    serviceLevel: number
    occupancy: number
    agentsAvailable: number
    agentsOnQueue: number
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

export function QueueDetailsWidget({
  widget,
  loading,
  queueMetrics,
  enabledItems,
  formatDuration,
  formatPercentage,
  getServiceLevelColor
}: QueueDetailsWidgetProps) {
  // Hide entire widget section if widget is disabled
  if (!widget.enabled) {
    return null
  }

  const getMediaTypeColor = (mediaType: string) => {
    switch (mediaType) {
      case 'voice':
        return 'border-blue-200 text-blue-700 bg-blue-50'
      case 'chat':
        return 'border-green-200 text-green-700 bg-green-50'
      case 'email':
        return 'border-purple-200 text-purple-700 bg-purple-50'
      case 'callback':
        return 'border-orange-200 text-orange-700 bg-orange-50'
      default:
        return 'border-gray-200 text-gray-700 bg-gray-50'
    }
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
              <CardTitle>Queue Performance Details</CardTitle>
              <CardDescription>Detailed metrics for each queue and media type</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <SortableContext 
              items={enabledItems.map(item => `${widget.id}-${item.id}`)} 
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {enabledItems.map((item) => (
                  <SortableWidgetItem key={item.id} item={item} widgetId={widget.id}>
                    {({ attributes: itemAttributes, listeners: itemListeners }: any) => (
                      <>
                        {item.id === 'queue-table' && (
                          <Card className="group/item relative">
                            <div 
                              className="absolute left-2 top-2 z-10 cursor-grab active:cursor-grabbing opacity-0 group-hover/item:opacity-100 transition-opacity" 
                              {...itemAttributes} 
                              {...itemListeners}
                            >
                              <GripVertical className="h-3 w-3 text-muted-foreground" />
                            </div>
                            <div className="pt-6">
                              {loading ? (
                                <div className="space-y-2">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Skeleton key={i} className="h-12 w-full" />
                                  ))}
                                </div>
                              ) : (
                                <div className="overflow-x-auto">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Queue</TableHead>
                                        <TableHead>Media Type</TableHead>
                                        <TableHead className="hidden sm:table-cell">Offered</TableHead>
                                        <TableHead className="hidden sm:table-cell">Handled</TableHead>
                                        <TableHead className="hidden md:table-cell">Abandoned</TableHead>
                                        <TableHead className="hidden lg:table-cell">Avg Wait</TableHead>
                                        <TableHead className="hidden xl:table-cell">Avg Handle</TableHead>
                                        <TableHead className="hidden 2xl:table-cell">Service Level</TableHead>
                                        <TableHead className="hidden 3xl:table-cell">Occupancy</TableHead>
                                        <TableHead>Agents</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {queueMetrics.map((queue) => (
                                        <TableRow key={queue.queueId}>
                                          <TableCell className="font-medium min-w-[100px] max-w-[150px] truncate">
                                            <span className="block truncate" title={queue.queueName}>
                                              {queue.queueName}
                                            </span>
                                          </TableCell>
                                          <TableCell>
                                            <Badge variant="outline" className={getMediaTypeColor(queue.mediaType)}>
                                              <div className="flex items-center gap-1">
                                                {getMediaTypeIcon(queue.mediaType)}
                                                <span className="hidden sm:inline">{queue.mediaType}</span>
                                                <span className="sm:hidden">{queue.mediaType.charAt(0).toUpperCase()}</span>
                                              </div>
                                            </Badge>
                                          </TableCell>
                                          <TableCell className="hidden sm:table-cell">{queue.offered}</TableCell>
                                          <TableCell className="hidden sm:table-cell">{queue.handled}</TableCell>
                                          <TableCell className="hidden md:table-cell text-red-600">{queue.abandoned}</TableCell>
                                          <TableCell className="hidden lg:table-cell">{formatDuration(queue.averageWaitTime)}</TableCell>
                                          <TableCell className="hidden xl:table-cell">{formatDuration(queue.averageHandleTime)}</TableCell>
                                          <TableCell className={`hidden 2xl:table-cell ${getServiceLevelColor(queue.serviceLevel)}`}>
                                            {formatPercentage(queue.serviceLevel)}
                                          </TableCell>
                                          <TableCell className="hidden 3xl:table-cell">{formatPercentage(queue.occupancy)}</TableCell>
                                          <TableCell>
                                            <div className="text-sm">
                                              <div className="text-green-600">{queue.agentsAvailable} available</div>
                                              <div className="text-muted-foreground hidden sm:block">{queue.agentsOnQueue} total</div>
                                            </div>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              )}
                            </div>
                          </Card>
                        )}
                        {item.id === 'queue-summary' && (
                          <Card className="group/item relative">
                            <div 
                              className="absolute left-2 top-2 z-10 cursor-grab active:cursor-grabbing opacity-0 group-hover/item:opacity-100 transition-opacity" 
                              {...itemAttributes} 
                              {...itemListeners}
                            >
                              <GripVertical className="h-3 w-3 text-muted-foreground" />
                            </div>
                            <CardHeader>
                              <CardTitle className="text-lg">Queue Summary</CardTitle>
                              <CardDescription>Key queue performance metrics overview</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Card className="group/item relative">
                                  <div 
                                    className="absolute left-2 top-2 z-10 cursor-grab active:cursor-grabbing opacity-0 group-hover/item:opacity-100 transition-opacity" 
                                    {...itemAttributes} 
                                    {...itemListeners}
                                  >
                                    <GripVertical className="h-3 w-3 text-muted-foreground" />
                                  </div>
                                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Offered</CardTitle>
                                    <Phone className="h-4 w-4 text-muted-foreground" style={{ width: '30px', height: '30px' }} />
                                  </CardHeader>
                                  <CardContent>
                                    <div className="text-2xl font-bold text-blue-600 truncate">
                                      {queueMetrics.reduce((sum, q) => sum + q.offered, 0)}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      Total interactions offered
                                    </p>
                                  </CardContent>
                                </Card>

                                <Card className="group/item relative">
                                  <div 
                                    className="absolute left-2 top-2 z-10 cursor-grab active:cursor-grabbing opacity-0 group-hover/item:opacity-100 transition-opacity" 
                                    {...itemAttributes} 
                                    {...itemListeners}
                                  >
                                    <GripVertical className="h-3 w-3 text-muted-foreground" />
                                  </div>
                                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Handled</CardTitle>
                                    <PhoneIncoming className="h-4 w-4 text-muted-foreground" style={{ width: '30px', height: '30px' }} />
                                  </CardHeader>
                                  <CardContent>
                                    <div className="text-2xl font-bold text-green-600 truncate">
                                      {queueMetrics.reduce((sum, q) => sum + q.handled, 0)}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      Successfully handled
                                    </p>
                                  </CardContent>
                                </Card>

                                <Card className="group/item relative">
                                  <div 
                                    className="absolute left-2 top-2 z-10 cursor-grab active:cursor-grabbing opacity-0 group-hover/item:opacity-100 transition-opacity" 
                                    {...itemAttributes} 
                                    {...itemListeners}
                                  >
                                    <GripVertical className="h-3 w-3 text-muted-foreground" />
                                  </div>
                                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Abandoned</CardTitle>
                                    <PhoneOff className="h-4 w-4 text-muted-foreground" style={{ width: '30px', height: '30px' }} />
                                  </CardHeader>
                                  <CardContent>
                                    <div className="text-2xl font-bold text-red-600 truncate">
                                      {queueMetrics.reduce((sum, q) => sum + q.abandoned, 0)}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      Abandoned interactions
                                    </p>
                                  </CardContent>
                                </Card>

                                <Card className="group/item relative">
                                  <div 
                                    className="absolute left-2 top-2 z-10 cursor-grab active:cursor-grabbing opacity-0 group-hover/item:opacity-100 transition-opacity" 
                                    {...itemAttributes} 
                                    {...itemListeners}
                                  >
                                    <GripVertical className="h-3 w-3 text-muted-foreground" />
                                  </div>
                                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Avg Service Level</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" style={{ width: '30px', height: '30px' }} />
                                  </CardHeader>
                                  <CardContent>
                                    <div className="text-2xl font-bold text-purple-600 truncate">
                                      {queueMetrics.length > 0 
                                        ? formatPercentage(queueMetrics.reduce((sum, q) => sum + q.serviceLevel, 0) / queueMetrics.length)
                                        : '0%'
                                      }
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      Average service level
                                    </p>
                                  </CardContent>
                                </Card>
                              </div>
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