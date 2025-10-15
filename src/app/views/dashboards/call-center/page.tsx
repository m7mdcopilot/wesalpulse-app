"use client"

import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { LoadingOverlay } from '@/components/ui/loading-overlay'
import { PageLoading } from '@/components/ui/page-loading'
import { Calendar } from '@/components/ui/calendar'
import { CalendarWithDropdowns } from '@/components/ui/calendar-with-dropdowns'
import { TimePicker } from '@/components/ui/time-picker'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { 
  Phone, 
  MessageSquare, 
  Mail, 
  Clock, 
  Users, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Calendar as CalendarIcon,
  Filter,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCheck,
  Circle,
  CheckCircle,
  Settings,
  GripVertical
} from 'lucide-react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  closestCenter,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DashboardLayoutSimple } from '@/components/dashboard-layout-simple'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

// Import wrapper components
import { DashboardHeader } from '@/components/dashboard-wrappers/DashboardHeader'
import { DashboardFilters } from '@/components/dashboard-wrappers/DashboardFilters'
import { SummaryCardsWidget } from '@/components/dashboard-wrappers/SummaryCardsWidget'
import { PerformanceChartsWidget } from '@/components/dashboard-wrappers/PerformanceChartsWidget'
import { QueueDetailsWidget } from '@/components/dashboard-wrappers/QueueDetailsWidget'
import { WidgetManagementDialog } from '@/components/dashboard-wrappers/WidgetManagementDialog'
import { DateRangeDialog } from '@/components/dashboard-wrappers/DateRangeDialog'

interface QueueMetric {
  queueId: string
  queueName: string
  mediaType: string
  totalInteractions: number
  offered: number
  handled: number
  abandoned: number
  averageWaitTime: number
  averageHandleTime: number
  serviceLevel: number
  longestWaitTime: number
  occupancy: number
  agentsAvailable: number
  agentsOnQueue: number
}

interface SummaryMetrics {
  totalInteractions: number
  totalOffered: number
  totalHandled: number
  totalAbandoned: number
  averageWaitTime: number
  averageHandleTime: number
  overallServiceLevel: number
  totalAgentsAvailable: number
  totalAgentsOnQueue: number
}

interface QueueOption {
  id: string
  name: string
  mediaTypes: string[]
}

// Sortable Widget Component
interface SortableWidgetProps {
  widget: any
  children: (props: { attributes: any; listeners: any }) => React.ReactNode
}

function SortableWidget({ widget, children }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: widget.id,
    data: {
      type: 'widget',
      widget
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      {children({ attributes, listeners })}
    </div>
  )
}

// Sortable Widget Item Component
interface SortableWidgetItemProps {
  item: any
  widgetId: string
  children: (props: { attributes: any; listeners: any }) => React.ReactNode
}

function SortableWidgetItem({ item, widgetId, children }: SortableWidgetItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: `${widgetId}-${item.id}`,
    data: {
      type: 'item',
      item,
      widgetId
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative group/item">
      {children({ attributes, listeners })}
    </div>
  )
}

const timeRangeOptions = [
  { value: 'last_hour', label: 'Last Hour' },
  { value: 'last_24_hours', label: 'Last 24 Hours' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'this_week', label: 'This Week' },
  { value: 'last_week', label: 'Last Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'last_month', label: 'Last Month' },
  { value: 'last_7_days', label: 'Last 7 Days' },
  { value: 'last_30_days', label: 'Last 30 Days' },
  { value: 'custom', label: 'Custom Range' }
]

const mediaTypeOptions = [
  { value: 'all', label: 'All Media' },
  { value: 'voice', label: 'Voice' },
  { value: 'chat', label: 'Chat' },
  { value: 'email', label: 'Email' },
  { value: 'callback', label: 'Callback' }
]

export default function CallCenterDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('last_24_hours')
  const [selectedMediaTypes, setSelectedMediaTypes] = useState<string[]>(['all'])
  const [selectedQueues, setSelectedQueues] = useState<string[]>(['all'])
  const [loading, setLoading] = useState(true)
  const [queueMetrics, setQueueMetrics] = useState<QueueMetric[]>([])
  const [summaryMetrics, setSummaryMetrics] = useState<SummaryMetrics | null>(null)
  const [trendData, setTrendData] = useState<any[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [showDateRangeDialog, setShowDateRangeDialog] = useState(false)
  const [availableQueues, setAvailableQueues] = useState<QueueOption[]>([])
  const [queueSearchTerm, setQueueSearchTerm] = useState('')
  const [dateRangeError, setDateRangeError] = useState<string | null>(null)
  
  // Save functionality states
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  
  // Setup sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const [activeId, setActiveId] = useState<string | null>(null)

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    console.log('Drag End:', { active: active.id, over: over?.id })

    if (!over) {
      // If there's no over target, just return
      return
    }

    if (active.id !== over.id) {
      // Check if this is a widget drag or item drag
      const activeId = active.id as string
      const overId = over.id as string
      
      console.log('Processing drag:', { activeId, overId, isItemDrag: activeId.includes('-'), isWidgetDrag: !activeId.includes('-') })
      
      if (activeId.includes('-') && overId.includes('-')) {
        // This is an item drag
        const [activeWidgetId, activeItemId] = activeId.split('-')
        const [overWidgetId, overItemId] = overId.split('-')
        
        console.log('Item drag:', { activeWidgetId, activeItemId, overWidgetId, overItemId })
        
        if (activeWidgetId === overWidgetId) {
          // Items are in the same widget, reorder them
          setWidgetItemOrders(prev => {
            const currentOrder = prev[activeWidgetId] || []
            const oldIndex = currentOrder.indexOf(activeItemId)
            const newIndex = currentOrder.indexOf(overItemId)
            
            console.log('Reordering items within same widget:', { currentOrder, oldIndex, newIndex })
            
            if (oldIndex === -1 || newIndex === -1) {
              console.log('Invalid indices, returning previous state')
              return prev // Invalid indices, return previous state
            }
            
            const newOrder = arrayMove(currentOrder, oldIndex, newIndex)
            console.log('New order:', newOrder)
            
            return {
              ...prev,
              [activeWidgetId]: newOrder
            }
          })
        } else {
          // Items are in different widgets - move item from one widget to another
          console.log('Moving item between widgets')
          
          // Update the widget item orders
          setWidgetItemOrders(prev => {
            const activeWidgetOrder = prev[activeWidgetId] || []
            const overWidgetOrder = prev[overWidgetId] || []
            
            // Remove item from source widget
            const newActiveWidgetOrder = activeWidgetOrder.filter(id => id !== activeItemId)
            
            // Add item to target widget (insert at the position of the over item)
            const overIndex = overWidgetOrder.indexOf(overItemId)
            const newOverWidgetOrder = [...overWidgetOrder]
            if (overIndex === -1) {
              // If over item not found, add to end
              newOverWidgetOrder.push(activeItemId)
            } else {
              // Insert at the position of the over item
              newOverWidgetOrder.splice(overIndex, 0, activeItemId)
            }
            
            console.log('Moving item between widgets:', {
              from: { widgetId: activeWidgetId, oldOrder: activeWidgetOrder, newOrder: newActiveWidgetOrder },
              to: { widgetId: overWidgetId, oldOrder: overWidgetOrder, newOrder: newOverWidgetOrder }
            })
            
            return {
              ...prev,
              [activeWidgetId]: newActiveWidgetOrder,
              [overWidgetId]: newOverWidgetOrder
            }
          })
          
          // Also need to update the widget configurations to reflect the item movement
          setAvailableWidgets(prev => {
            return prev.map(widget => {
              if (widget.id === activeWidgetId) {
                // Remove the item from the source widget
                return {
                  ...widget,
                  items: widget.items?.map(item => 
                    item.id === activeItemId ? { ...item, enabled: false } : item
                  )
                }
              } else if (widget.id === overWidgetId) {
                // Add the item to the target widget
                return {
                  ...widget,
                  items: widget.items?.map(item => 
                    item.id === activeItemId ? { ...item, enabled: true } : item
                  )
                }
              }
              return widget
            })
          })
        }
      } else if (!activeId.includes('-') && !overId.includes('-')) {
        // This is a widget drag (both IDs don't contain hyphens)
        setWidgetOrder((items) => {
          const oldIndex = items.indexOf(activeId)
          const newIndex = items.indexOf(overId)

          console.log('Widget drag:', { currentOrder: items, oldIndex, newIndex })

          if (oldIndex === -1 || newIndex === -1) {
            console.log('Invalid indices, returning previous state')
            return items // Invalid indices, return previous state
          }

          const newOrder = arrayMove(items, oldIndex, newIndex)
          console.log('New widget order:', newOrder)

          return newOrder
        })
      }
    }
    setActiveId(null)
    
    // Auto-save after drag operation
    saveWidgetConfiguration()
  }
  
  // Custom date range state
  const [customDateRange, setCustomDateRange] = useState<{
    startDate: Date | undefined
    endDate: Date | undefined
    startTime: string
    endTime: string
  }>({
    startDate: undefined,
    endDate: undefined,
    startTime: '00:00',
    endTime: '23:59'
  })

  // Widget management state
  const [showWidgetDialog, setShowWidgetDialog] = useState(false)
  const [widgetOrder, setWidgetOrder] = useState<string[]>(['summary-cards', 'performance-charts', 'queue-details'])
  const [widgetItemOrders, setWidgetItemOrders] = useState<Record<string, string[]>>({
    'summary-cards': ['total-interactions', 'average-wait-time', 'service-level', 'agents-available', 'abandonment-rate', 'handle-time'],
    'performance-charts': ['interaction-volume', 'service-level-trends', 'agent-performance', 'media-type-breakdown'],
    'queue-details': ['queue-table', 'queue-summary']
  })
  const [availableWidgets, setAvailableWidgets] = useState([
    {
      id: 'summary-cards',
      name: 'Summary Cards',
      description: 'Key performance metrics overview',
      enabled: true,
      items: [
        { id: 'total-interactions', name: 'Total Interactions', description: 'Total number of interactions handled', enabled: true },
        { id: 'average-wait-time', name: 'Average Wait Time', description: 'Average time customers wait for service', enabled: true },
        { id: 'service-level', name: 'Service Level', description: 'Percentage of interactions meeting service targets', enabled: true },
        { id: 'agents-available', name: 'Agents Available', description: 'Number of agents currently available', enabled: true },
        { id: 'abandonment-rate', name: 'Abandonment Rate', description: 'Percentage of abandoned interactions', enabled: true },
        { id: 'handle-time', name: 'Average Handle Time', description: 'Average time to handle interactions', enabled: true },
        // Items from other widgets (initially disabled)
        { id: 'interaction-volume', name: 'Interaction Volume', description: 'Bar chart showing interaction trends', enabled: false },
        { id: 'service-level-trends', name: 'Service Level & Wait Time', description: 'Line chart for service level and wait time', enabled: false },
        { id: 'agent-performance', name: 'Agent Performance', description: 'Agent efficiency and productivity metrics', enabled: false },
        { id: 'media-type-breakdown', name: 'Media Type Breakdown', description: 'Pie chart showing interaction distribution by media type', enabled: false },
        { id: 'queue-table', name: 'Queue Performance Table', description: 'Detailed metrics table for all queues', enabled: false },
        { id: 'queue-summary', name: 'Queue Summary Cards', description: 'Summary cards for key queue metrics', enabled: false }
      ]
    },
    {
      id: 'performance-charts',
      name: 'Performance Charts',
      description: 'Interaction volume and service level trends',
      enabled: true,
      items: [
        // Items from summary cards (initially disabled)
        { id: 'total-interactions', name: 'Total Interactions', description: 'Total number of interactions handled', enabled: false },
        { id: 'average-wait-time', name: 'Average Wait Time', description: 'Average time customers wait for service', enabled: false },
        { id: 'service-level', name: 'Service Level', description: 'Percentage of interactions meeting service targets', enabled: false },
        { id: 'agents-available', name: 'Agents Available', description: 'Number of agents currently available', enabled: false },
        { id: 'abandonment-rate', name: 'Abandonment Rate', description: 'Percentage of abandoned interactions', enabled: false },
        { id: 'handle-time', name: 'Average Handle Time', description: 'Average time to handle interactions', enabled: false },
        // Performance charts items (initially enabled)
        { id: 'interaction-volume', name: 'Interaction Volume', description: 'Bar chart showing interaction trends', enabled: true },
        { id: 'service-level-trends', name: 'Service Level & Wait Time', description: 'Line chart for service level and wait time', enabled: true },
        { id: 'agent-performance', name: 'Agent Performance', description: 'Agent efficiency and productivity metrics', enabled: true },
        { id: 'media-type-breakdown', name: 'Media Type Breakdown', description: 'Pie chart showing interaction distribution by media type', enabled: true },
        // Items from queue details (initially disabled)
        { id: 'queue-table', name: 'Queue Performance Table', description: 'Detailed metrics table for all queues', enabled: false },
        { id: 'queue-summary', name: 'Queue Summary Cards', description: 'Summary cards for key queue metrics', enabled: false }
      ]
    },
    {
      id: 'queue-details',
      name: 'Queue Performance Details',
      description: 'Detailed metrics for each queue and media type',
      enabled: true,
      items: [
        // Items from summary cards (initially disabled)
        { id: 'total-interactions', name: 'Total Interactions', description: 'Total number of interactions handled', enabled: false },
        { id: 'average-wait-time', name: 'Average Wait Time', description: 'Average time customers wait for service', enabled: false },
        { id: 'service-level', name: 'Service Level', description: 'Percentage of interactions meeting service targets', enabled: false },
        { id: 'agents-available', name: 'Agents Available', description: 'Number of agents currently available', enabled: false },
        { id: 'abandonment-rate', name: 'Abandonment Rate', description: 'Percentage of abandoned interactions', enabled: false },
        { id: 'handle-time', name: 'Average Handle Time', description: 'Average time to handle interactions', enabled: false },
        // Items from performance charts (initially disabled)
        { id: 'interaction-volume', name: 'Interaction Volume', description: 'Bar chart showing interaction trends', enabled: false },
        { id: 'service-level-trends', name: 'Service Level & Wait Time', description: 'Line chart for service level and wait time', enabled: false },
        { id: 'agent-performance', name: 'Agent Performance', description: 'Agent efficiency and productivity metrics', enabled: false },
        { id: 'media-type-breakdown', name: 'Media Type Breakdown', description: 'Pie chart showing interaction distribution by media type', enabled: false },
        // Queue details items (initially enabled)
        { id: 'queue-table', name: 'Queue Performance Table', description: 'Detailed metrics table for all queues', enabled: true },
        { id: 'queue-summary', name: 'Queue Summary Cards', description: 'Summary cards for key queue metrics', enabled: true }
      ]
    }
  ])

  // Helper functions
  const getEnabledWidgets = () => {
    return widgetOrder.map(widgetId => availableWidgets.find(w => w.id === widgetId)).filter(Boolean)
  }

  const getEnabledItems = (widgetId: string) => {
    const widget = availableWidgets.find(w => w.id === widgetId)
    if (!widget || !widget.items) return []
    
    const itemOrder = widgetItemOrders[widgetId] || []
    const enabledItems = widget.items.filter(item => item.enabled)
    
    // Sort items according to the order
    return itemOrder
      .map(itemId => enabledItems.find(item => item.id === itemId))
      .filter(Boolean)
      .concat(enabledItems.filter(item => !itemOrder.includes(item.id))) // Add any remaining items
  }

  const toggleWidget = (widgetId: string, itemId?: string) => {
    setAvailableWidgets(prev => 
      prev.map(widget => {
        if (widget.id === widgetId) {
          if (itemId) {
            // Toggle individual item
            return {
              ...widget,
              items: widget.items?.map(item => 
                item.id === itemId ? { ...item, enabled: !item.enabled } : item
              )
            }
          } else {
            // Toggle entire widget
            const newEnabledState = !widget.enabled
            return {
              ...widget,
              enabled: newEnabledState,
              items: widget.items?.map(item => ({ ...item, enabled: newEnabledState }))
            }
          }
        }
        return widget
      })
    )
    
    // Auto-save after widget toggle
    saveWidgetConfiguration()
  }

  const saveWidgetConfiguration = async () => {
    setIsSaving(true)
    try {
      // Simulate API call to save widget configuration
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLastSaved(new Date())
      toast.success('Widget configuration saved successfully')
    } catch (error) {
      toast.error('Failed to save widget configuration')
    } finally {
      setIsSaving(false)
    }
  }

  const getMediaTypeIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'voice': return <Phone className="h-3 w-3" />
      case 'chat': return <MessageSquare className="h-3 w-3" />
      case 'email': return <Mail className="h-3 w-3" />
      case 'callback': return <Phone className="h-3 w-3" />
      default: return <MessageSquare className="h-3 w-3" />
    }
  }

  const getMediaTypeColor = (mediaType: string) => {
    switch (mediaType) {
      case 'voice': return 'bg-blue-100 text-blue-800'
      case 'chat': return 'bg-green-100 text-green-800'
      case 'email': return 'bg-purple-100 text-purple-800'
      case 'callback': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getServiceLevelColor = (serviceLevel: number) => {
    if (serviceLevel >= 80) return 'text-green-600'
    if (serviceLevel >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getFormattedDateRangeDisplay = useCallback(() => {
    if (selectedTimeRange === 'custom' && customDateRange.startDate && customDateRange.endDate) {
      const start = format(customDateRange.startDate, 'MMM dd, yyyy')
      const end = format(customDateRange.endDate, 'MMM dd, yyyy')
      return `${start} - ${end}`
    }
    
    // For preset ranges, return the label
    const option = timeRangeOptions.find(opt => opt.value === selectedTimeRange)
    return option ? option.label : 'Select range'
  }, [selectedTimeRange, customDateRange])

  const getSelectedTimeRangeLabel = () => {
    return getFormattedDateRangeDisplay()
  }

  const getSelectedMediaTypesLabel = () => {
    if (selectedMediaTypes.includes('all')) return 'All Media'
    return selectedMediaTypes.join(', ')
  }

  const getSelectedQueuesLabel = () => {
    if (selectedQueues.includes('all')) return 'All Queues'
    return `${selectedQueues.length} selected`
  }

  const getFilteredQueues = () => {
    return availableQueues.filter(queue => 
      queue.name.toLowerCase().includes(queueSearchTerm.toLowerCase())
    )
  }

  const handleMediaTypeToggle = (mediaType: string) => {
    setSelectedMediaTypes(prev => {
      if (mediaType === 'all') {
        return ['all']
      }
      
      const newSelection = prev.includes(mediaType) 
        ? prev.filter(t => t !== mediaType)
        : [...prev.filter(t => t !== 'all'), mediaType]
      
      // If no media types selected, default to 'all'
      return newSelection.length === 0 ? ['all'] : newSelection
    })
  }

  const handleQueueToggle = (queueId: string) => {
    setSelectedQueues(prev => {
      if (queueId === 'all') {
        return ['all']
      }
      
      const newSelection = prev.includes(queueId) 
        ? prev.filter(q => q !== queueId)
        : [...prev.filter(q => q !== 'all'), queueId]
      
      // If no queues selected, default to 'all'
      return newSelection.length === 0 ? ['all'] : newSelection
    })
  }

  const applyQuickRange = (range: string) => {
    const today = new Date()
    let startDate: Date
    let endDate: Date

    switch (range) {
      case 'today':
        startDate = new Date(today)
        startDate.setHours(0, 0, 0, 0)
        endDate = new Date(today)
        endDate.setHours(23, 59, 59, 999)
        break
      
      case 'yesterday':
        startDate = new Date(today)
        startDate.setDate(today.getDate() - 1)
        startDate.setHours(0, 0, 0, 0)
        endDate = new Date(startDate)
        endDate.setHours(23, 59, 59, 999)
        break
      
      case 'this_week':
        startDate = new Date(today)
        startDate.setDate(today.getDate() - today.getDay()) // Start of week (Sunday)
        endDate = new Date(today)
        endDate.setHours(23, 59, 59, 999)
        break
      
      case 'last_week':
        startDate = new Date(today)
        startDate.setDate(today.getDate() - today.getDay() - 7) // Start of last week
        endDate = new Date(startDate)
        endDate.setDate(startDate.getDate() + 6) // End of last week
        endDate.setHours(23, 59, 59, 999)
        break
      
      case 'this_month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1)
        endDate = new Date(today)
        endDate.setHours(23, 59, 59, 999)
        break
      
      case 'last_month':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        endDate = new Date(today.getFullYear(), today.getMonth(), 0)
        endDate.setHours(23, 59, 59, 999)
        break
      
      case 'last_7_days':
        startDate = new Date(today)
        startDate.setDate(today.getDate() - 7)
        endDate = new Date(today)
        endDate.setHours(23, 59, 59, 999)
        break
      
      case 'last_30_days':
        startDate = new Date(today)
        startDate.setDate(today.getDate() - 30)
        endDate = new Date(today)
        endDate.setHours(23, 59, 59, 999)
        break
      
      default:
        return
    }

    setCustomDateRange({
      startDate,
      endDate,
      startTime: '00:00',
      endTime: '23:59'
    })
    
    setSelectedTimeRange('custom')
    setShowDateRangeDialog(false)
    fetchDashboardData()
  }

  const applyCustomDateRange = () => {
    if (!customDateRange.startDate || !customDateRange.endDate) {
      setDateRangeError('Please select both start and end dates')
      return
    }

    if (customDateRange.startDate > customDateRange.endDate) {
      setDateRangeError('Start date must be before end date')
      return
    }

    setDateRangeError(null)
    setSelectedTimeRange('custom')
    setShowDateRangeDialog(false)
    fetchDashboardData()
  }

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // Fetch data from new API endpoint
      const response = await fetch('/api/call-center-performance')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      const callCenterPerformance = data.callCenterPerformance
      
      // Transform API data to match existing structure
      const mockQueueMetrics: QueueMetric[] = [
        {
          queueId: '1',
          queueName: 'Sales Queue',
          mediaType: 'voice',
          totalInteractions: callCenterPerformance.overview.totalCalls,
          offered: callCenterPerformance.overview.totalCalls,
          handled: callCenterPerformance.overview.answeredCalls,
          abandoned: callCenterPerformance.overview.abandonedCalls,
          averageWaitTime: 45,
          averageHandleTime: 320,
          serviceLevel: parseInt(callCenterPerformance.overview.serviceLevel),
          longestWaitTime: 180,
          occupancy: 78,
          agentsAvailable: 8,
          agentsOnQueue: 12
        },
        {
          queueId: '2',
          queueName: 'Support Queue',
          mediaType: 'chat',
          totalInteractions: 200,
          offered: 195,
          handled: 176,
          abandoned: 19,
          averageWaitTime: 30,
          averageHandleTime: 480,
          serviceLevel: 82,
          longestWaitTime: 120,
          occupancy: 85,
          agentsAvailable: 6,
          agentsOnQueue: 8
        },
        {
          queueId: '3',
          queueName: 'Billing Queue',
          mediaType: 'email',
          totalInteractions: 80,
          offered: 78,
          handled: 75,
          abandoned: 3,
          averageWaitTime: 120,
          averageHandleTime: 600,
          serviceLevel: 92,
          longestWaitTime: 300,
          occupancy: 65,
          agentsAvailable: 4,
          agentsOnQueue: 5
        }
      ]

      const mockSummaryMetrics: SummaryMetrics = {
        totalInteractions: callCenterPerformance.overview.totalCalls,
        totalOffered: callCenterPerformance.overview.totalCalls,
        totalHandled: callCenterPerformance.overview.answeredCalls,
        totalAbandoned: callCenterPerformance.overview.abandonedCalls,
        averageWaitTime: 52,
        averageHandleTime: 420,
        overallServiceLevel: parseInt(callCenterPerformance.overview.serviceLevel),
        totalAgentsAvailable: 18,
        totalAgentsOnQueue: 25
      }

      const mockTrendData = callCenterPerformance.trends.map((trend: any) => ({
        time: trend.period,
        interactions: trend.calls,
        serviceLevel: trend.serviceLevel,
        waitTime: 40
      }))

      const mockAvailableQueues: QueueOption[] = [
        { id: '1', name: 'Sales Queue', mediaTypes: ['voice'] },
        { id: '2', name: 'Support Queue', mediaTypes: ['chat'] },
        { id: '3', name: 'Billing Queue', mediaTypes: ['email'] },
        { id: '4', name: 'Technical Queue', mediaTypes: ['voice', 'chat'] },
        { id: '5', name: 'Customer Service', mediaTypes: ['voice', 'email'] }
      ]

      setQueueMetrics(mockQueueMetrics)
      setSummaryMetrics(mockSummaryMetrics)
      setTrendData(mockTrendData)
      setAvailableQueues(mockAvailableQueues)
      toast.success('Dashboard data refreshed successfully')
    } catch (error) {
      toast.error('Failed to fetch dashboard data')
    } finally {
      setLoading(false)
    }
  }

  // Initialize dashboard data
  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Prepare widget management dialog content
  const widgetManagementDialogContent = (
    <WidgetManagementDialog
      availableWidgets={availableWidgets}
      onToggleWidget={toggleWidget}
    />
  )

  // Prepare date range dialog content
  const dateRangeDialogContent = (
    <DateRangeDialog
      showDateRangeDialog={showDateRangeDialog}
      customDateRange={customDateRange}
      dateRangeError={dateRangeError}
      onDateRangeDialogChange={setShowDateRangeDialog}
      onCustomDateRangeChange={setCustomDateRange}
      onApplyCustomDateRange={applyCustomDateRange}
      onApplyQuickRange={applyQuickRange}
      onDateRangeErrorChange={setDateRangeError}
      formatTime={formatTime}
    />
  )

  return (
    <DashboardLayoutSimple>
      <div className="p-4 space-y-6">
        {/* Header Section */}
        <DashboardHeader
          showFilters={showFilters}
          showWidgetDialog={showWidgetDialog}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onWidgetDialogChange={setShowWidgetDialog}
          widgetDialogContent={widgetManagementDialogContent}
          onRefresh={fetchDashboardData}
          loading={loading}
        />

        {/* Active Filters Display */}
        <Card data-slot="card" className="text-card-foreground flex flex-col gap-6 rounded-xl border py-0 shadow-sm bg-muted/30">
          <CardContent className="p-4">
            <div className="flex flex-col space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-muted-foreground">Active Filters</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setSelectedTimeRange('last_24_hours')
                    setSelectedMediaTypes(['all'])
                    setSelectedQueues(['all'])
                    setCustomDateRange({
                      startDate: undefined,
                      endDate: undefined,
                      startTime: '00:00',
                      endTime: '23:59'
                    })
                  }}
                  className="h-6 px-2 text-xs"
                >
                  Clear All
                </Button>
              </div>
              
              {/* All Filters - Each filter on its own line with horizontal content */}
              <div className="flex flex-col gap-3">
                {/* Date Range Section */}
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm font-medium whitespace-nowrap">
                      <span className="text-muted-foreground mr-2">Date:</span>
                      {selectedTimeRange === 'custom' && customDateRange.startDate && customDateRange.endDate ? (
                        <>
                          <span>{format(customDateRange.startDate, 'MMM dd, yyyy')} at {formatTime(customDateRange.startTime)}</span>
                          <span className="text-muted-foreground flex-shrink-0 mx-1">→</span>
                          <span>{format(customDateRange.endDate, 'MMM dd, yyyy')} at {formatTime(customDateRange.endTime)}</span>
                          <Badge variant="outline" className="ml-2 text-xs flex-shrink-0">
                            {(() => {
                              const startDateTime = new Date(customDateRange.startDate)
                              const endDateTime = new Date(customDateRange.endDate)
                              const [startHour, startMinute] = customDateRange.startTime.split(':').map(Number)
                              const [endHour, endMinute] = customDateRange.endTime.split(':').map(Number)
                              
                              startDateTime.setHours(startHour, startMinute, 0, 0)
                              endDateTime.setHours(endHour, endMinute, 59, 999)
                              
                              const durationMs = endDateTime - startDateTime
                              const durationDays = Math.floor(durationMs / (1000 * 60 * 60 * 24))
                              const durationHours = Math.floor((durationMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
                              
                              if (durationDays > 0) {
                                return `${durationDays}d ${durationHours}h`
                              } else {
                                return `${durationHours}h`
                              }
                            })()}
                          </Badge>
                        </>
                      ) : (
                        <span>{getSelectedTimeRangeLabel()}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Media Type Section */}
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      <span className="text-muted-foreground mr-2">Media:</span>
                      {selectedMediaTypes.includes('all') || selectedMediaTypes.length === 0 ? (
                        <span>All Media Types</span>
                      ) : (
                        <>
                          {selectedMediaTypes.map(type => (
                            <Badge key={type} variant="outline" className={`text-xs ${getMediaTypeColor(type)} mr-1`}>
                              <div className="flex items-center gap-1">
                                {getMediaTypeIcon(type)}
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </div>
                            </Badge>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Queues Section */}
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      <span className="text-muted-foreground mr-2">Queues:</span>
                      {selectedQueues.includes('all') || selectedQueues.length === 0 ? (
                        <span>All Queues</span>
                      ) : (
                        <>
                          {selectedQueues.slice(0, 3).map(queueId => {
                            const queue = availableQueues.find(q => q.id === queueId)
                            const queueName = queue?.name || queueId
                            const displayName = queueName.length > 15 ? queueName.substring(0, 15) + '...' : queueName
                            return (
                              <Badge key={queueId} variant="outline" className="text-xs bg-gray-100 text-gray-800 mr-1" title={queueName}>
                                {displayName}
                              </Badge>
                            )
                          })}
                          {selectedQueues.length > 3 && (
                            <Badge variant="outline" className="text-xs bg-gray-100 text-gray-800">
                              +{selectedQueues.length - 3} more
                            </Badge>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters Section */}
        <DashboardFilters
          showFilters={showFilters}
          selectedTimeRange={selectedTimeRange}
          selectedMediaTypes={selectedMediaTypes}
          selectedQueues={selectedQueues}
          queueSearchTerm={queueSearchTerm}
          customDateRange={customDateRange}
          showDateRangeDialog={showDateRangeDialog}
          loading={loading}
          availableQueues={availableQueues}
          timeRangeOptions={timeRangeOptions}
          mediaTypeOptions={mediaTypeOptions}
          onCloseFilters={() => setShowFilters(false)}
          onTimeRangeChange={setSelectedTimeRange}
          onMediaTypeToggle={handleMediaTypeToggle}
          onQueueToggle={handleQueueToggle}
          onQueueSearchChange={setQueueSearchTerm}
          onDateRangeDialogChange={setShowDateRangeDialog}
          onFetchDashboardData={fetchDashboardData}
          onResetFilters={() => {
            setSelectedTimeRange('last_24_hours')
            setSelectedMediaTypes(['all'])
            setSelectedQueues(['all'])
            setCustomDateRange({
              startDate: undefined,
              endDate: undefined,
              startTime: '00:00',
              endTime: '23:59'
            })
          }}
          getFilteredQueues={getFilteredQueues}
          getMediaTypeIcon={getMediaTypeIcon}
          formatTime={formatTime}
          dateRangeDialogContent={dateRangeDialogContent}
        />

        {/* Dashboard Widgets */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={widgetOrder} strategy={verticalListSortingStrategy}>
            <div className="space-y-6">
              {getEnabledWidgets().map((widget) => {
                if (!widget) return null
                
                switch (widget.id) {
                  case 'summary-cards':
                    return (
                      <SummaryCardsWidget
                        key={widget.id}
                        widget={widget}
                        loading={loading}
                        summaryMetrics={summaryMetrics}
                        queueMetrics={queueMetrics}
                        enabledItems={getEnabledItems('summary-cards')}
                        formatDuration={formatDuration}
                        formatPercentage={formatPercentage}
                        getServiceLevelColor={getServiceLevelColor}
                        SortableWidget={SortableWidget}
                        SortableWidgetItem={SortableWidgetItem}
                        SortableContext={SortableContext}
                        rectSortingStrategy={rectSortingStrategy}
                      />
                    )

                  case 'performance-charts':
                    return (
                      <PerformanceChartsWidget
                        key={widget.id}
                        widget={widget}
                        loading={loading}
                        trendData={trendData}
                        queueMetrics={queueMetrics}
                        enabledItems={getEnabledItems('performance-charts')}
                        formatPercentage={formatPercentage}
                        getMediaTypeIcon={getMediaTypeIcon}
                        SortableWidget={SortableWidget}
                        SortableWidgetItem={SortableWidgetItem}
                        SortableContext={SortableContext}
                        rectSortingStrategy={rectSortingStrategy}
                      />
                    )

                  case 'queue-details':
                    return (
                      <QueueDetailsWidget
                        key={widget.id}
                        widget={widget}
                        loading={loading}
                        queueMetrics={queueMetrics}
                        enabledItems={getEnabledItems('queue-details')}
                        formatDuration={formatDuration}
                        formatPercentage={formatPercentage}
                        getServiceLevelColor={getServiceLevelColor}
                        getMediaTypeColor={getMediaTypeColor}
                        getMediaTypeIcon={getMediaTypeIcon}
                        SortableWidget={SortableWidget}
                        SortableWidgetItem={SortableWidgetItem}
                        SortableContext={SortableContext}
                        verticalListSortingStrategy={verticalListSortingStrategy}
                      />
                    )

                  default:
                    return null
                }
              })}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeId ? (
              <div className="opacity-50">
                {activeId.includes('-') ? (
                  <div className="p-4 border rounded-lg bg-card">
                    <div className="text-sm text-muted-foreground">Dragging item...</div>
                  </div>
                ) : (
                  <div className="p-4 border rounded-lg bg-card">
                    <div className="text-sm font-medium">Dragging widget...</div>
                  </div>
                )}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </DashboardLayoutSimple>
  )
}