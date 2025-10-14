"use client"

import { format } from 'date-fns'
import { useState, useEffect } from 'react'
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
  AreaChart,
  Area,
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
  User,
  Star,
  Settings,
  Maximize,
  Minimize,
  X,
  Bell,
  Check,
  RotateCcw,
  Building,
  CheckCheck,
  Circle
} from 'lucide-react'
import { SidebarNavigation } from '@/components/sidebar-navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DateRangeDialog } from '@/components/dashboard-wrappers/DateRangeDialog'
import { AnalyticsFilters } from '@/components/analytics-filters/AnalyticsFilters'

interface AgentOption {
  id: string
  name: string
  department: string
  status: string
}

interface AgentMetric {
  agentId: string
  agentName: string
  totalCalls: number
  answeredCalls: number
  averageHandleTime: string
  averageTalkTime: string
  averageWrapTime: string
  averageHoldTime: string
  averageAcwTime: string
  holdCount: number
  transferCount: number
  timeInStatusDays: number
  availabilityStatus: 'Available' | 'Offline'
  satisfaction: string
  qualityScore: number
  adherence: string
  status: 'excellent' | 'very_good' | 'good' | 'needs_improvement'
}

interface SummaryMetrics {
  answer: number
  handle: number
  avgHandle: string
  avgTalk: string
  avgHold: string
  avgAcw: string
  hold: number
  transfer: number
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

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'break', label: 'On Break' }
]

const departmentOptions = [
  { value: 'all', label: 'All Departments' },
  { value: 'customer_service', label: 'Customer Service' },
  { value: 'technical_support', label: 'Technical Support' },
  { value: 'sales', label: 'Sales' },
  { value: 'quality_assurance', label: 'Quality Assurance' }
]

const mediaTypeOptions = [
  { value: 'all', label: 'All Media' },
  { value: 'voice', label: 'Voice' },
  { value: 'chat', label: 'Chat' },
  { value: 'email', label: 'Email' },
  { value: 'callback', label: 'Callback' }
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export default function AgentPerformanceAnalytics() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('last_24_hours')
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['all'])
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(['all'])
  const [selectedAgents, setSelectedAgents] = useState<string[]>(['all'])
  const [selectedMediaTypes, setSelectedMediaTypes] = useState<string[]>(['all'])
  const [agentSearchTerm, setAgentSearchTerm] = useState('')
  const [availableAgents, setAvailableAgents] = useState<AgentOption[]>([])
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
  const [agentMetrics, setAgentMetrics] = useState<AgentMetric[]>([
    {
      agentId: '1',
      agentName: 'John Smith',
      totalCalls: 45,
      answeredCalls: 42,
      averageHandleTime: '3:45',
      averageTalkTime: '2:30',
      averageWrapTime: '1:15',
      averageHoldTime: '0:30',
      averageAcwTime: '0:45',
      holdCount: 8,
      transferCount: 2,
      timeInStatusDays: 15,
      availabilityStatus: 'Available',
      satisfaction: '4.2',
      qualityScore: 87,
      adherence: '96%',
      status: 'excellent'
    },
    {
      agentId: '2',
      agentName: 'Sarah Johnson',
      totalCalls: 38,
      answeredCalls: 35,
      averageHandleTime: '4:12',
      averageTalkTime: '3:05',
      averageWrapTime: '1:07',
      averageHoldTime: '0:45',
      averageAcwTime: '0:50',
      holdCount: 6,
      transferCount: 3,
      timeInStatusDays: 22,
      availabilityStatus: 'Available',
      satisfaction: '4.5',
      qualityScore: 91,
      adherence: '94%',
      status: 'excellent'
    },
    {
      agentId: '3',
      agentName: 'Mike Wilson',
      totalCalls: 52,
      answeredCalls: 48,
      averageHandleTime: '3:20',
      averageTalkTime: '2:45',
      averageWrapTime: '0:35',
      averageHoldTime: '0:25',
      averageAcwTime: '0:30',
      holdCount: 12,
      transferCount: 4,
      timeInStatusDays: 8,
      availabilityStatus: 'Offline',
      satisfaction: '3.8',
      qualityScore: 82,
      adherence: '92%',
      status: 'good'
    },
    {
      agentId: '4',
      agentName: 'Emily Davis',
      totalCalls: 41,
      answeredCalls: 39,
      averageHandleTime: '5:15',
      averageTalkTime: '4:20',
      averageWrapTime: '0:55',
      averageHoldTime: '0:40',
      averageAcwTime: '0:55',
      holdCount: 9,
      transferCount: 1,
      timeInStatusDays: 18,
      availabilityStatus: 'Available',
      satisfaction: '4.1',
      qualityScore: 85,
      adherence: '89%',
      status: 'very_good'
    },
    {
      agentId: '5',
      agentName: 'David Brown',
      totalCalls: 33,
      answeredCalls: 30,
      averageHandleTime: '6:30',
      averageTalkTime: '5:15',
      averageWrapTime: '1:15',
      averageHoldTime: '1:00',
      averageAcwTime: '1:10',
      holdCount: 15,
      transferCount: 5,
      timeInStatusDays: 5,
      availabilityStatus: 'Offline',
      satisfaction: '3.2',
      qualityScore: 76,
      adherence: '87%',
      status: 'needs_improvement'
    }
  ])
  const [summaryMetrics, setSummaryMetrics] = useState<SummaryMetrics>({
    answer: 194,
    handle: 209,
    avgHandle: '4:24',
    avgTalk: '3:30',
    avgHold: '0:30',
    avgAcw: '0:54',
    hold: 50,
    transfer: 15,
    lastUpdated: new Date().toISOString()
  })
  const [performanceTrends, setPerformanceTrends] = useState<any[]>([
    { name: 'Answered', value: 194, color: '#22c55e' },
    { name: 'Handled', value: 209, color: '#3b82f6' }
  ])
  const [satisfactionData, setSatisfactionData] = useState<any[]>([
    { name: 'Avg Handle', value: 264, color: '#3b82f6' }, // 4:24 in seconds
    { name: 'Avg Talk', value: 210, color: '#22c55e' }, // 3:30 in seconds
    { name: 'Avg Hold', value: 30, color: '#f59e0b' }, // 0:30 in seconds
    { name: 'Avg ACW', value: 54, color: '#ef4444' } // 0:54 in seconds
  ])
  const [qualityData, setQualityData] = useState<any[]>([
    { name: 'Total Handled', value: 209, color: '#3b82f6' },
    { name: 'Hold Count', value: 50, color: '#f59e0b' },
    { name: 'Transfer Count', value: 15, color: '#ef4444' }
  ])
  const [adherenceData, setAdherenceData] = useState<any[]>([
    { name: '% Answered', value: 93, color: '#22c55e' },
    { name: '% with Hold', value: 24, color: '#f59e0b' },
    { name: '% Transferred', value: 7, color: '#ef4444' }
  ])

  useEffect(() => {
    // Initialize available agents
    setAvailableAgents([
      { id: 'john', name: 'John Smith', department: 'customer_service', status: 'active' },
      { id: 'sarah', name: 'Sarah Johnson', department: 'technical_support', status: 'active' },
      { id: 'mike', name: 'Mike Wilson', department: 'sales', status: 'active' },
      { id: 'emily', name: 'Emily Davis', department: 'customer_service', status: 'inactive' },
      { id: 'david', name: 'David Brown', department: 'quality_assurance', status: 'active' }
    ])

    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [selectedTimeRange, selectedStatuses, selectedDepartments, selectedAgents])

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

  const handleApplyAndCloseFilters = () => {
    handleRefresh()
    setShowFilters(false)
  }

  const handleStatusToggle = (value: string) => {
    if (value === 'all') {
      setSelectedStatuses(['all'])
    } else {
      setSelectedStatuses(prev => {
        const newStatuses = prev.filter(status => status !== 'all')
        if (newStatuses.includes(value)) {
          return newStatuses.length > 0 ? newStatuses.filter(status => status !== value) : ['all']
        } else {
          return [...newStatuses, value]
        }
      })
    }
  }

  const handleDepartmentToggle = (value: string) => {
    if (value === 'all') {
      setSelectedDepartments(['all'])
    } else {
      setSelectedDepartments(prev => {
        const newDepartments = prev.filter(dept => dept !== 'all')
        if (newDepartments.includes(value)) {
          return newDepartments.length > 0 ? newDepartments.filter(dept => dept !== value) : ['all']
        } else {
          return [...newDepartments, value]
        }
      })
    }
  }

  const handleMediaTypeToggle = (value: string) => {
    if (value === 'all') {
      setSelectedMediaTypes(['all'])
    } else {
      setSelectedMediaTypes(prev => {
        const newMediaTypes = prev.filter(type => type !== 'all')
        if (newMediaTypes.includes(value)) {
          return newMediaTypes.length > 0 ? newMediaTypes.filter(type => type !== value) : ['all']
        } else {
          return [...newMediaTypes, value]
        }
      })
    }
  }

  const resetFilters = () => {
    setSelectedTimeRange('last_24_hours')
    setSelectedStatuses(['all'])
    setSelectedDepartments(['all'])
    setSelectedAgents(['all'])
    setSelectedMediaTypes(['all'])
    setAgentSearchTerm('')
    setDateRangeError(null)
  }

  const handleAgentToggle = (value: string) => {
    if (value === 'all') {
      setSelectedAgents(['all'])
    } else {
      setSelectedAgents(prev => {
        const newAgents = prev.filter(agent => agent !== 'all')
        if (newAgents.includes(value)) {
          return newAgents.length > 0 ? newAgents.filter(agent => agent !== value) : ['all']
        } else {
          return [...newAgents, value]
        }
      })
    }
  }

  const getFilteredAgents = () => {
    return availableAgents.filter(agent =>
      agent.name.toLowerCase().includes(agentSearchTerm.toLowerCase())
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800'
      case 'very_good': return 'bg-blue-100 text-blue-800'
      case 'good': return 'bg-yellow-100 text-yellow-800'
      case 'needs_improvement': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <Star className="h-4 w-4" />
      case 'very_good': return <Award className="h-4 w-4" />
      case 'good': return <Target className="h-4 w-4" />
      case 'needs_improvement': return <AlertCircle className="h-4 w-4" />
      default: return <User className="h-4 w-4" />
    }
  }

  const getSelectedStatusesLabel = () => {
    if (selectedStatuses.includes('all')) return 'All Status'
    return selectedStatuses.map(status => 
      statusOptions.find(opt => opt.value === status)?.label || status
    ).join(', ')
  }

  const getSelectedDepartmentsLabel = () => {
    if (selectedDepartments.includes('all')) return 'All Departments'
    return selectedDepartments.map(dept => 
      departmentOptions.find(opt => opt.value === dept)?.label || dept
    ).join(', ')
  }

  const getSelectedAgentsLabel = () => {
    if (selectedAgents.includes('all')) return 'All Agents'
    return selectedAgents.map(id => availableAgents.find(a => a.id === id)?.name || id).join(', ')
  }

  const getSelectedMediaTypesLabel = () => {
    if (selectedMediaTypes.includes('all')) return 'All Media'
    return selectedMediaTypes.join(', ')
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

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    return `${hours}:${minutes}`
  }

  const getMediaTypeIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'voice': return <Phone className="h-3 w-3" />
      case 'chat': return <MessageSquare className="h-3 w-3" />
      case 'email': return <Bell className="h-3 w-3" />
      case 'callback': return <RotateCcw className="h-3 w-3" />
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
            <div className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <div>
                <div className="font-medium">Performance Trends</div>
                <div className="text-sm text-muted-foreground">Shows answered vs handled calls</div>
              </div>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Timer className="h-5 w-5 text-green-500" />
              <div>
                <div className="font-medium">Satisfaction Metrics</div>
                <div className="text-sm text-muted-foreground">Handle time, talk time, hold time</div>
              </div>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="font-medium">Quality Metrics</div>
                <div className="text-sm text-muted-foreground">Total handled, hold count, transfers</div>
              </div>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-red-500" />
              <div>
                <div className="font-medium">Adherence Metrics</div>
                <div className="text-sm text-muted-foreground">Answer rate, hold rate, transfer rate</div>
              </div>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
        </div>
      </div>
    </DialogContent>
  )

  // Date Range Dialog Content
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
    />
  )

  // Analytics Filters Props
  const analyticsFiltersProps = {
    showFilters,
    selectedTimeRange,
    filterOptions: {
      timeRangeOptions,
      primaryFilterOptions: statusOptions,
      secondaryFilterOptions: departmentOptions
    },
    selectedPrimaryFilters: selectedStatuses,
    selectedSecondaryFilters: selectedDepartments,
    customDateRange,
    showDateRangeDialog,
    loading,
    filterType: 'agents' as const,
    onCloseFilters: () => setShowFilters(false),
    onTimeRangeChange: setSelectedTimeRange,
    onPrimaryFilterToggle: handleStatusToggle,
    onSecondaryFilterToggle: handleDepartmentToggle,
    onDateRangeDialogChange: setShowDateRangeDialog,
    onFetchData: handleRefresh,
    onResetFilters: resetFilters,
    dateRangeDialogContent
  }

  return (
    <div className="flex h-screen bg-background">
      <SidebarNavigation />
      
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Agent Performance Analytics</h1>
              <p className="text-muted-foreground">
                Monitor and analyze agent performance metrics and trends
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(true)}
                className="cursor-pointer"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="cursor-pointer"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                className="cursor-pointer"
              >
                {isFullscreen ? <Minimize className="h-4 w-4 mr-2" /> : <Maximize className="h-4 w-4 mr-2" />}
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </Button>
            </div>
          </div>

          {/* Filter Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Range</CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {selectedTimeRange === 'custom' && customDateRange.startDate && customDateRange.endDate 
                    ? `${format(customDateRange.startDate, 'MMM dd')} - ${format(customDateRange.endDate, 'MMM dd')}`
                    : timeRangeOptions.find(opt => opt.value === selectedTimeRange)?.label || 'Select range'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  {selectedTimeRange === 'custom' && customDateRange.startDate && customDateRange.endDate 
                    ? `${format(customDateRange.startDate, 'yyyy')} to ${format(customDateRange.endDate, 'yyyy')}`
                    : 'Current selection'
                  }
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getSelectedStatusesLabel()}</div>
                <p className="text-xs text-muted-foreground">
                  {selectedStatuses.includes('all') ? 'All agent statuses' : `${selectedStatuses.length} selected`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Departments</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getSelectedDepartmentsLabel()}</div>
                <p className="text-xs text-muted-foreground">
                  {selectedDepartments.includes('all') ? 'All departments' : `${selectedDepartments.length} selected`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Agents</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getSelectedAgentsLabel()}</div>
                <p className="text-xs text-muted-foreground">
                  {selectedAgents.includes('all') ? 'All agents' : `${selectedAgents.length} selected`}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Charts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Performance Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance Trends
                  </CardTitle>
                  <CardDescription>
                    Overview of agent performance metrics over the selected time period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-[300px] w-full" />
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={performanceTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              {/* Satisfaction Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="h-5 w-5" />
                    Satisfaction Metrics
                  </CardTitle>
                  <CardDescription>
                    Average handle time, talk time, hold time, and ACW time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-[300px] w-full" />
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={satisfactionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Summary and Agent List */}
            <div className="space-y-6">
              {/* Summary Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LayoutDashboard className="h-5 w-5" />
                    Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Answered Calls</span>
                        <span className="font-medium">{summaryMetrics.answer}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Handled Calls</span>
                        <span className="font-medium">{summaryMetrics.handle}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Avg Handle Time</span>
                        <span className="font-medium">{summaryMetrics.avgHandle}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Avg Talk Time</span>
                        <span className="font-medium">{summaryMetrics.avgTalk}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Hold Count</span>
                        <span className="font-medium">{summaryMetrics.hold}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Transfer Count</span>
                        <span className="font-medium">{summaryMetrics.transfer}</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Agent Performance List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Agent Performance
                  </CardTitle>
                  <CardDescription>
                    Individual agent performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {agentMetrics.map((agent) => (
                        <div key={agent.agentId} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(agent.status)}
                              <span className="font-medium">{agent.agentName}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={agent.status === 'excellent' ? 'default' : 'secondary'} className={getStatusColor(agent.status)}>
                              {agent.status.replace('_', ' ')}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{agent.answeredCalls} calls</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Detailed Agent Table */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Table className="h-5 w-5" />
                Detailed Agent Performance
              </CardTitle>
              <CardDescription>
                Comprehensive view of all agent metrics and performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Agent</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Total Calls</TableHead>
                        <TableHead>Answered</TableHead>
                        <TableHead>Avg Handle</TableHead>
                        <TableHead>Avg Talk</TableHead>
                        <TableHead>Hold Count</TableHead>
                        <TableHead>Transfer</TableHead>
                        <TableHead>Quality</TableHead>
                        <TableHead>Adherence</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {agentMetrics.map((agent) => (
                        <TableRow key={agent.agentId}>
                          <TableCell className="font-medium">{agent.agentName}</TableCell>
                          <TableCell>
                            <Badge variant={agent.status === 'excellent' ? 'default' : 'secondary'} className={getStatusColor(agent.status)}>
                              {agent.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>{agent.totalCalls}</TableCell>
                          <TableCell>{agent.answeredCalls}</TableCell>
                          <TableCell>{agent.averageHandleTime}</TableCell>
                          <TableCell>{agent.averageTalkTime}</TableCell>
                          <TableCell>{agent.holdCount}</TableCell>
                          <TableCell>{agent.transferCount}</TableCell>
                          <TableCell>{agent.qualityScore}%</TableCell>
                          <TableCell>{agent.adherence}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Analytics Filters Component */}
      <AnalyticsFilters {...analyticsFiltersProps} />
    </div>
  )
}