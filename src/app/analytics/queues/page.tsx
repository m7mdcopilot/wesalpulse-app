"use client"

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Area,
  AreaChart,
  Legend
} from 'recharts'
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
  CheckCircle,
  AlertCircle,
  Activity,
  Target,
  LayoutDashboard,
  BarChart3,
  Timer,
  Zap,
  Award,
  ArrowRight,
  ChevronDown,
  Settings,
  Maximize,
  Minimize,
  X,
  Bell,
  Check,
  User,
  RotateCw,
  Building
} from 'lucide-react'
import { DashboardLayoutSimple } from '@/components/dashboard-layout-simple'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DateRangeDialog } from '@/components/dashboard-wrappers/DateRangeDialog'

interface QueueOption {
  id: string
  name: string
  mediaTypes: string[]
}

interface QueueMetric {
  queueId: string
  queueName: string
  mediaType: string
  offer: number
  answer: number
  abandon: number
  answerRate: number
  abandonRate: number
  asa: number
  serviceLevel: number
  serviceLevelPercent: number
  avgWait: number
  avgHandle: number
  avgTalk: number
  avgHold: number
  avgAcw: number
  hold: number
  transfer: number
  metSLA: boolean
  metSLACount: number
}

interface SummaryMetrics {
  totalOffered: number
  totalAnswered: number
  totalAbandoned: number
  overallAnswerRate: number
  overallAbandonRate: number
  overallASA: number
  overallServiceLevel: number
  overallAvgWait: number
  overallAvgHandle: number
  overallAvgTalk: number
  overallAvgHold: number
  overallAvgAcw: number
  totalHold: number
  totalTransfer: number
  totalMetSLA: number
  lastUpdated: string
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
  { value: 'custom', label: 'Custom Range' }
]

const mediaTypeOptions = [
  { value: 'all', label: 'All Media' },
  { value: 'voice', label: 'Voice' },
  { value: 'chat', label: 'Chat' },
  { value: 'email', label: 'Email' },
  { value: 'callback', label: 'Callback' }
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export default function QueuesPerformance() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('last_24_hours')
  const [selectedMediaTypes, setSelectedMediaTypes] = useState<string[]>(['all'])
  const [selectedQueues, setSelectedQueues] = useState<string[]>(['all'])
  const [queueSearchTerm, setQueueSearchTerm] = useState('')
  const [availableQueues, setAvailableQueues] = useState<QueueOption[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [showWidgetDialog, setShowWidgetDialog] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showDateRangeDialog, setShowDateRangeDialog] = useState(false)
  const [dateRangeError, setDateRangeError] = useState<string | null>(null)
  
  // Custom date range state
  const [customDateRange, setCustomDateRange] = useState<{
    startDate: Date | undefined
    endDate: Date | undefined
    startTime: string
    endTime: string
  }>(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    return {
      startDate: yesterday,
      endDate: today,
      startTime: '00:00',
      endTime: '23:59'
    };
  })
  const [queueMetrics, setQueueMetrics] = useState<QueueMetric[]>([
    {
      queueId: '1',
      queueName: 'Sales Support',
      mediaType: 'voice',
      offer: 156,
      answer: 142,
      abandon: 14,
      answerRate: 91.0,
      abandonRate: 9.0,
      asa: 28,
      serviceLevel: 85.3,
      serviceLevelPercent: 85.3,
      avgWait: 32,
      avgHandle: 245,
      avgTalk: 195,
      avgHold: 35,
      avgAcw: 15,
      hold: 28,
      transfer: 12,
      metSLA: true,
      metSLACount: 133
    },
    {
      queueId: '2',
      queueName: 'Technical Support',
      mediaType: 'voice',
      offer: 203,
      answer: 187,
      abandon: 16,
      answerRate: 92.1,
      abandonRate: 7.9,
      asa: 35,
      serviceLevel: 78.8,
      serviceLevelPercent: 78.8,
      avgWait: 42,
      avgHandle: 312,
      avgTalk: 265,
      avgHold: 42,
      avgAcw: 25,
      hold: 45,
      transfer: 18,
      metSLA: false,
      metSLACount: 160
    },
    {
      queueId: '3',
      queueName: 'Customer Service',
      mediaType: 'voice',
      offer: 189,
      answer: 178,
      abandon: 11,
      answerRate: 94.2,
      abandonRate: 5.8,
      asa: 22,
      serviceLevel: 92.1,
      serviceLevelPercent: 92.1,
      avgWait: 26,
      avgHandle: 198,
      avgTalk: 165,
      avgHold: 28,
      avgAcw: 15,
      hold: 32,
      transfer: 8,
      metSLA: true,
      metSLACount: 174
    },
    {
      queueId: '4',
      queueName: 'Billing Support',
      mediaType: 'voice',
      offer: 98,
      answer: 89,
      abandon: 9,
      answerRate: 90.8,
      abandonRate: 9.2,
      asa: 45,
      serviceLevel: 72.4,
      serviceLevelPercent: 72.4,
      avgWait: 58,
      avgHandle: 285,
      avgTalk: 235,
      avgHold: 38,
      avgAcw: 22,
      hold: 15,
      transfer: 6,
      metSLA: false,
      metSLACount: 71
    },
    {
      queueId: '5',
      queueName: 'Chat Support',
      mediaType: 'chat',
      offer: 267,
      answer: 254,
      abandon: 13,
      answerRate: 95.1,
      abandonRate: 4.9,
      asa: 15,
      serviceLevel: 96.3,
      serviceLevelPercent: 96.3,
      avgWait: 18,
      avgHandle: 185,
      avgTalk: 145,
      avgHold: 25,
      avgAcw: 15,
      hold: 22,
      transfer: 5,
      metSLA: true,
      metSLACount: 245
    }
  ])
  const [summaryMetrics, setSummaryMetrics] = useState<SummaryMetrics>({
    totalOffered: 913,
    totalAnswered: 850,
    totalAbandoned: 63,
    overallAnswerRate: 93.1,
    overallAbandonRate: 6.9,
    overallASA: 29,
    overallServiceLevel: 85.0,
    overallAvgWait: 35,
    overallAvgHandle: 245,
    overallAvgTalk: 201,
    overallAvgHold: 34,
    overallAvgAcw: 18,
    totalHold: 142,
    totalTransfer: 49,
    totalMetSLA: 783,
    lastUpdated: new Date().toISOString()
  })

  useEffect(() => {
    // Initialize available queues
    setAvailableQueues([
      { id: 'sales', name: 'Sales Queue', mediaTypes: ['voice', 'chat'] },
      { id: 'support', name: 'Support Queue', mediaTypes: ['voice', 'email', 'chat'] },
      { id: 'billing', name: 'Billing Queue', mediaTypes: ['voice', 'email'] },
      { id: 'technical', name: 'Technical Support', mediaTypes: ['voice', 'chat'] },
      { id: 'retention', name: 'Customer Retention', mediaTypes: ['voice'] }
    ])

    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [selectedTimeRange, selectedMediaTypes, selectedQueues])

  // Fullscreen handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

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

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
  }

  const handleMediaTypeToggle = (value: string) => {
    if (value === 'all') {
      setSelectedMediaTypes(['all'])
    } else {
      setSelectedMediaTypes(prev => {
        const newTypes = prev.filter(type => type !== 'all')
        if (newTypes.includes(value)) {
          return newTypes.length > 0 ? newTypes.filter(type => type !== value) : ['all']
        } else {
          return [...newTypes, value]
        }
      })
    }
  }

  const handleQueueToggle = (value: string) => {
    if (value === 'all') {
      setSelectedQueues(['all'])
    } else {
      setSelectedQueues(prev => {
        const newQueues = prev.filter(queue => queue !== 'all')
        if (newQueues.includes(value)) {
          return newQueues.length > 0 ? newQueues.filter(queue => queue !== value) : ['all']
        } else {
          return [...newQueues, value]
        }
      })
    }
  }

  const getFilteredQueues = () => {
    return availableQueues.filter(queue =>
      queue.name.toLowerCase().includes(queueSearchTerm.toLowerCase())
    )
  }

  const resetFilters = () => {
    setSelectedTimeRange('last_24_hours')
    setSelectedMediaTypes(['all'])
    setSelectedQueues(['all'])
    setQueueSearchTerm('')
    setDateRangeError(null)
  }

  // Date range handlers
  const handleCustomDateRangeChange = (range: {
    startDate: Date | undefined
    endDate: Date | undefined
    startTime: string
    endTime: string
  }) => {
    setCustomDateRange(range)
  }

  const handleDateRangeErrorChange = (error: string | null) => {
    setDateRangeError(error)
  }

  const handleApplyDateRange = () => {
    // This will be called when the date range is applied
    handleRefresh()
  }

  const formatTime = (time: number | string) => {
    if (typeof time === 'number') {
      const mins = Math.floor(time / 60)
      const secs = time % 60
      return `${mins}:${secs.toString().padStart(2, '0')} min`
    } else {
      // Handle time string format (HH:MM)
      return time
    }
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getMediaTypeIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'voice': return <Phone className="h-3 w-3" />
      case 'chat': return <MessageSquare className="h-3 w-3" />
      case 'email': return <Bell className="h-3 w-3" />
      case 'callback': return <RotateCw className="h-3 w-3" />
      default: return <Users className="h-3 w-3" />
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

  const getSelectedMediaTypesLabel = () => {
    if (selectedMediaTypes.includes('all')) return 'All Media'
    return selectedMediaTypes.join(', ')
  }

  const getSelectedQueuesLabel = () => {
    if (selectedQueues.includes('all')) return 'All Queues'
    return selectedQueues.map(id => availableQueues.find(q => q.id === id)?.name || id).join(', ')
  }

  // Prepare data for charts
  const answerAbandonData = queueMetrics.map(queue => ({
    name: queue.queueName,
    Answer: queue.answerRate,
    Abandon: queue.abandonRate
  }))

  const timeMetricsData = queueMetrics.map(queue => ({
    name: queue.queueName,
    'Avg Wait': queue.avgWait,
    'Avg Handle': queue.avgHandle,
    'Avg Talk': queue.avgTalk,
    'Avg Hold': queue.avgHold,
    'Avg ACW': queue.avgAcw
  }))

  const serviceLevelData = queueMetrics.map(queue => ({
    name: queue.queueName,
    'Service Level': queue.serviceLevelPercent,
    'Met SLA': queue.metSLA ? 100 : 0
  }))

  const holdTransferData = queueMetrics.map(queue => ({
    name: queue.queueName,
    Hold: queue.hold,
    Transfer: queue.transfer
  }))

  const asaData = queueMetrics.map(queue => ({
    name: queue.queueName,
    ASA: queue.asa
  }))

  // Widget Management Dialog Content
  const widgetManagementDialogContent = (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Manage Widgets</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Configure which widgets and metrics are displayed on your dashboard.
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h4 className="font-medium">Summary Cards</h4>
              <p className="text-sm text-muted-foreground">Key performance metrics overview</p>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h4 className="font-medium">Performance Charts</h4>
              <p className="text-sm text-muted-foreground">Interactive charts and trends</p>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h4 className="font-medium">Queue Details</h4>
              <p className="text-sm text-muted-foreground">Detailed queue metrics table</p>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
        </div>
      </div>
    </DialogContent>
  )

  // Date Range Dialog Content - Using the sophisticated DateRangeDialog component
  const dateRangeDialogContent = (
    <DateRangeDialog
      showDateRangeDialog={showDateRangeDialog}
      customDateRange={customDateRange}
      dateRangeError={dateRangeError}
      selectedTimeRange={selectedTimeRange}
      onDateRangeDialogChange={setShowDateRangeDialog}
      onCustomDateRangeChange={handleCustomDateRangeChange}
      onSelectedTimeRangeChange={setSelectedTimeRange}
      onDateRangeErrorChange={handleDateRangeErrorChange}
      onApplyDateRange={handleApplyDateRange}
      formatTime={formatTime}
      onFetchDashboardData={handleRefresh}
      isLoading={loading}
    />
  )

  if (loading) {
    return (
      <DashboardLayoutSimple>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96 mt-2" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </DashboardLayoutSimple>
    )
  }

  return (
    <DashboardLayoutSimple>
      <div className="space-y-6">
        {/* Header with Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold tracking-tight">Queues Performance</h1>
            <p className="text-muted-foreground">
              Comprehensive queue performance metrics and analytics
            </p>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowFilters(!showFilters)}
              className="cursor-pointer transition-all duration-200 hover:scale-105"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
            <Dialog open={showWidgetDialog} onOpenChange={setShowWidgetDialog}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="cursor-pointer transition-all duration-200 hover:scale-105"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Widgets
                </Button>
              </DialogTrigger>
              {widgetManagementDialogContent}
            </Dialog>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleFullscreen}
              className="cursor-pointer transition-all duration-200 hover:scale-105"
            >
              {isFullscreen ? (
                <>
                  <Minimize className="h-4 w-4 mr-2" />
                  Minimize
                </>
              ) : (
                <>
                  <Maximize className="h-4 w-4 mr-2" />
                  Full Screen
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={loading}
              className="cursor-pointer transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Active Filters Display - Show on top in one line */}
        <div className="flex flex-wrap gap-2 items-center p-1 mb-1 bg-muted/50 rounded-lg">
          <span className="text-sm font-bold text-muted-foreground">Active Filters</span>
          
          {/* Date Range Section */}
          <CalendarIcon className="h-4 w-4 ml-2 text-muted-foreground flex-shrink-0" />
          <span className="text-sm font-medium text-muted-foreground">Date:</span>
          <Badge variant="secondary">
            {selectedTimeRange === 'custom' && customDateRange.startDate && customDateRange.endDate ? (
              <span>
                {(() => {
                  const startDateTime = new Date(customDateRange.startDate);
                  const endDateTime = new Date(customDateRange.endDate);
                  const [startHour, startMinute, startSecond] = customDateRange.startTime.split(':').map(Number);
                  const [endHour, endMinute, endSecond] = customDateRange.endTime.split(':').map(Number);
                  
                  startDateTime.setHours(startHour, startMinute, startSecond || 0);
                  endDateTime.setHours(endHour, endMinute, endSecond || 59);
                  
                  return `${format(startDateTime, 'MMM dd, yyyy HH:mm:ss')} - ${format(endDateTime, 'MMM dd, yyyy HH:mm:ss')}`;
                })()}
              </span>
            ) : (
              timeRangeOptions.find(opt => opt.value === selectedTimeRange)?.label || 'Select range'
            )}
          </Badge>
          
          {/* Media Type Section */}
          <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm font-medium text-muted-foreground">Media Type:</span>
          
          {/* Individual Media Type Badges */}
          {selectedMediaTypes.includes('all') ? (
            <Badge variant="secondary">
              All Media
            </Badge>
          ) : (
            <div className="flex gap-1">
              {selectedMediaTypes.map(type => (
                <Badge key={type} variant="outline" className={getMediaTypeColor(type)}>
                  <div className="flex items-center gap-1">
                    {getMediaTypeIcon(type)}
                    {type}
                  </div>
                </Badge>
              ))}
            </div>
          )}
          
          {/* Queues Section */}
          <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm font-medium text-muted-foreground">Queues:</span>
          
          {/* Individual Queue Badges */}
          {selectedQueues.includes('all') ? (
            <Badge variant="secondary">
              All Queues
            </Badge>
          ) : (
            <div className="flex gap-1">
              {selectedQueues.map(queueId => {
                const queue = availableQueues.find(q => q.id === queueId)
                return (
                  <Badge key={queueId} variant="outline" className="bg-gray-100 text-gray-800">
                    {queue?.name || queueId}
                  </Badge>
                )
              })}
            </div>
          )}
          
          {/* Reset Filters Button */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={resetFilters}
            className="ml-auto h-6 px-2 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Offered</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryMetrics.totalOffered}</div>
              <p className="text-xs text-muted-foreground">
                {summaryMetrics.totalAnswered} answered, {summaryMetrics.totalAbandoned} abandoned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Answer Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPercentage(summaryMetrics.overallAnswerRate)}</div>
              <p className="text-xs text-muted-foreground">
                {formatPercentage(summaryMetrics.overallAbandonRate)} abandon rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Service Level</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPercentage(summaryMetrics.overallServiceLevel)}</div>
              <p className="text-xs text-muted-foreground">
                {summaryMetrics.totalMetSLA} met SLA
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatTime(summaryMetrics.overallAvgWait)}</div>
              <p className="text-xs text-muted-foreground">
                across all queues
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Tables */}
        <Tabs defaultValue="summary-table" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="summary-table">Summary Table</TabsTrigger>
            <TabsTrigger value="answer-abandon">Answer vs Abandon</TabsTrigger>
            <TabsTrigger value="time-metrics">Time Metrics</TabsTrigger>
            <TabsTrigger value="service-level">Service Level</TabsTrigger>
            <TabsTrigger value="hold-transfer">Hold & Transfer</TabsTrigger>
            <TabsTrigger value="asa">ASA Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="summary-table" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Queue Summary Table</CardTitle>
                <CardDescription>
                  Detailed performance metrics for all queues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Queue Name</TableHead>
                      <TableHead className="text-right">Offer</TableHead>
                      <TableHead className="text-right">Answer %</TableHead>
                      <TableHead className="text-right">Abandon %</TableHead>
                      <TableHead className="text-right">Service Level %</TableHead>
                      <TableHead className="text-right">Met SLA</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {queueMetrics.map((queue) => (
                      <TableRow key={queue.queueId}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {getMediaTypeIcon(queue.mediaType)}
                            {queue.queueName}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{queue.offer}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={queue.answerRate > 90 ? "default" : "secondary"}>
                            {formatPercentage(queue.answerRate)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={queue.abandonRate < 10 ? "default" : "destructive"}>
                            {formatPercentage(queue.abandonRate)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={queue.serviceLevelPercent > 80 ? "default" : "secondary"}>
                            {formatPercentage(queue.serviceLevelPercent)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {queue.metSLA ? (
                            <CheckCircle className="h-4 w-4 text-green-600 inline" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600 inline" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="answer-abandon" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Answer vs Abandon Trend</CardTitle>
                <CardDescription>
                  Comparison of answer rates vs abandon rates across queues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={answerAbandonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Answer" fill="#00C49F" name="Answer Rate %" />
                    <Bar dataKey="Abandon" fill="#FF8042" name="Abandon Rate %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="time-metrics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Average Time Metrics</CardTitle>
                <CardDescription>
                  Stacked view of various time metrics across queues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={timeMetricsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="Avg Wait" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="Avg Handle" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                    <Area type="monotone" dataKey="Avg Talk" stackId="1" stroke="#ffc658" fill="#ffc658" />
                    <Area type="monotone" dataKey="Avg Hold" stackId="1" stroke="#ff7300" fill="#ff7300" />
                    <Area type="monotone" dataKey="Avg ACW" stackId="1" stroke="#0088fe" fill="#0088fe" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="service-level" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Service Level Performance</CardTitle>
                <CardDescription>
                  Service level achievement and SLA compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={serviceLevelData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Service Level" fill="#00C49F" name="Service Level %" />
                    <Line type="monotone" dataKey="Met SLA" stroke="#FF8042" strokeWidth={3} name="SLA Met %" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hold-transfer" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Hold & Transfer Analysis</CardTitle>
                <CardDescription>
                  Number of holds and transfers per queue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={holdTransferData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Hold" fill="#8884D8" name="Hold Count" />
                    <Bar dataKey="Transfer" fill="#82CA9D" name="Transfer Count" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="asa" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>ASA Comparison</CardTitle>
                <CardDescription>
                  Average Speed of Answer across all queues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={asaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ASA" fill="#0088FE" name="ASA (seconds)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Filter Panel */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-background border-l border-border transform transition-transform duration-300 ease-in-out z-50 ${showFilters ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowFilters(false)}
              className="cursor-pointer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Time Range
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Time Range</label>
                <Select value={selectedTimeRange} onValueChange={(value) => {
                  if (value === 'custom') {
                    setShowDateRangeDialog(true)
                  }
                  setSelectedTimeRange(value)
                }}>
                  <SelectTrigger>
                    <SelectValue>
                      {selectedTimeRange === 'custom' && customDateRange.startDate && customDateRange.endDate 
                        ? `${format(customDateRange.startDate, 'MMM dd, yyyy')} - ${format(customDateRange.endDate, 'MMM dd, yyyy')}`
                        : timeRangeOptions.find(opt => opt.value === selectedTimeRange)?.label || 'Select range'
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {timeRangeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Range Details */}
              <div className="space-y-3 border-t pt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Start:</span>
                    <span className="font-medium">
                      {customDateRange.startDate 
                        ? `${format(customDateRange.startDate, 'MMM dd, yyyy')} at ${formatTime(customDateRange.startTime)}`
                        : 'Not selected'
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">End:</span>
                    <span className="font-medium">
                      {customDateRange.endDate 
                        ? `${format(customDateRange.endDate, 'MMM dd, yyyy')} at ${formatTime(customDateRange.endTime)}`
                        : 'Not selected'
                      }
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-muted-foreground">Duration:</span>
                  <Badge variant="secondary" className="text-xs">
                    {customDateRange.startDate && customDateRange.endDate ? (() => {
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
                        return `${durationDays} day${durationDays !== 1 ? 's' : ''}${durationHours > 0 ? `, ${durationHours} hr${durationHours !== 1 ? 's' : ''}` : ''}`
                      } else {
                        return `${durationHours} hour${durationHours !== 1 ? 's' : ''}`
                      }
                    })() : 'Select dates to calculate'}
                  </Badge>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setShowDateRangeDialog(true)
                  }}
                  className="w-full cursor-pointer"
                >
                  <CalendarIcon className="h-3 w-3 mr-2" />
                  Edit Range
                </Button>
              </div>

              {/* Custom Date Range Picker */}
              {selectedTimeRange === 'custom' && (!customDateRange.startDate || !customDateRange.endDate) && (
                <div className="space-y-4 border-t pt-4">
                  <Button 
                    onClick={() => {
                      setShowDateRangeDialog(true)
                    }}
                    className="w-full flex items-center gap-2 cursor-pointer"
                    variant="outline"
                  >
                    <CalendarIcon className="h-4 w-4" />
                    Configure Date Range
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Queues
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Queues</label>
                <div className="space-y-3">
                  {/* Search Input */}
                  <div className="relative">
                    <Input
                      placeholder="Search queues..."
                      value={queueSearchTerm}
                      onChange={(e) => setQueueSearchTerm(e.target.value)}
                      className="pr-8"
                    />
                    {queueSearchTerm && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-6 w-6 p-0 cursor-pointer"
                        onClick={() => setQueueSearchTerm('')}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  
                  {/* All Queues Option */}
                  <Button
                    variant={selectedQueues.includes('all') ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleQueueToggle('all')}
                    className="w-full justify-start cursor-pointer"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    All Queues
                  </Button>
                  
                  {/* Queue List */}
                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {getFilteredQueues().map(queue => (
                      <Button
                        key={queue.id}
                        variant={selectedQueues.includes(queue.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleQueueToggle(queue.id)}
                        className="w-full justify-start cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          {selectedQueues.includes(queue.id) ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <span className="h-4 w-4 border border-gray-300 rounded-full" />
                          )}
                          <span className="text-sm">{queue.name}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Media Type
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Media Types</label>
                <div className="grid grid-cols-2 gap-2">
                  {mediaTypeOptions.map(option => (
                    <Button
                      key={option.value}
                      variant={selectedMediaTypes.includes(option.value) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleMediaTypeToggle(option.value)}
                      className="justify-start cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        {getMediaTypeIcon(option.value)}
                        {option.label}
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  handleRefresh()
                  setShowFilters(false)
                }}
                className="w-full cursor-pointer"
              >
                <RotateCw className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetFilters}
                className="w-full cursor-pointer"
              >
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Overlay for mobile */}
      {showFilters && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setShowFilters(false)}
        />
      )}

      {/* Date Range Dialog */}
      <Dialog open={showDateRangeDialog} onOpenChange={setShowDateRangeDialog}>
        {dateRangeDialogContent}
      </Dialog>

    </DashboardLayoutSimple>
  )
}