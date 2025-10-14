"use client"

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
  RotateCw,
  Building,
  CheckCheck,
  Circle
} from 'lucide-react'
import { DashboardLayoutSimple } from '@/components/dashboard-layout-simple'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DateRangeDialog } from '@/components/dashboard-wrappers/DateRangeDialog'

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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export default function AgentPerformanceAnalytics() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('last_24_hours')
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['all'])
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(['all'])
  const [selectedAgents, setSelectedAgents] = useState<string[]>(['all'])
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

  const resetFilters = () => {
    setSelectedTimeRange('last_24_hours')
    setSelectedStatuses(['all'])
    setSelectedDepartments(['all'])
    setSelectedAgents(['all'])
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
              <h4 className="font-medium">Performance Overview</h4>
              <p className="text-sm text-muted-foreground">Key performance metrics overview</p>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h4 className="font-medium">Satisfaction Analysis</h4>
              <p className="text-sm text-muted-foreground">Agent satisfaction and quality scores</p>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h4 className="font-medium">Quality Trends</h4>
              <p className="text-sm text-muted-foreground">Quality and adherence metrics</p>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
        </div>
      </div>
    </DialogContent>
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
            <h1 className="text-3xl font-bold tracking-tight">Agent Performance</h1>
            <p className="text-muted-foreground">
              Comprehensive agent performance metrics and analytics
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
          
          {/* Status Section */}
          <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm font-medium text-muted-foreground">Status:</span>
          
          {/* Individual Status Badges */}
          {selectedStatuses.includes('all') ? (
            <Badge variant="secondary">
              All Status
            </Badge>
          ) : (
            <div className="flex gap-1">
              {selectedStatuses.map(status => (
                <Badge key={status} variant="outline" className="bg-blue-100 text-blue-800">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {statusOptions.find(opt => opt.value === status)?.label || status}
                  </div>
                </Badge>
              ))}
            </div>
          )}
          
          {/* Department Section */}
          <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm font-medium text-muted-foreground">Department:</span>
          
          {/* Individual Department Badges */}
          {selectedDepartments.includes('all') ? (
            <Badge variant="secondary">
              All Departments
            </Badge>
          ) : (
            <div className="flex gap-1">
              {selectedDepartments.map(dept => (
                <Badge key={dept} variant="outline" className="bg-purple-100 text-purple-800">
                  <div className="flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    {departmentOptions.find(opt => opt.value === dept)?.label || dept}
                  </div>
                </Badge>
              ))}
            </div>
          )}
          
          {/* Agents Section */}
          <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm font-medium text-muted-foreground">Agents:</span>
          
          {/* Individual Agent Badges */}
          {selectedAgents.includes('all') ? (
            <Badge variant="secondary">
              All Agents
            </Badge>
          ) : (
            <div className="flex gap-1">
              {selectedAgents.map(agentId => {
                const agent = availableAgents.find(a => a.id === agentId)
                return (
                  <Badge key={agentId} variant="outline" className="bg-gray-100 text-gray-800">
                    {agent?.name || agentId}
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
                {customDateRange.startDate && customDateRange.endDate && (
                  <div className="space-y-3 border-t pt-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Start:</span>
                        <span className="font-medium">
                          {format(customDateRange.startDate, 'MMM dd, yyyy')} at {formatTime(customDateRange.startTime)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">End:</span>
                        <span className="font-medium">
                          {format(customDateRange.endDate, 'MMM dd, yyyy')} at {formatTime(customDateRange.endTime)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-xs text-muted-foreground">Duration:</span>
                      <Badge variant="secondary" className="text-xs">
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
                            return `${durationDays} day${durationDays !== 1 ? 's' : ''}${durationHours > 0 ? `, ${durationHours} hr${durationHours !== 1 ? 's' : ''}` : ''}`
                          } else {
                            return `${durationHours} hour${durationHours !== 1 ? 's' : ''}`
                          }
                        })()}
                      </Badge>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowDateRangeDialog(true)}
                      className="w-full cursor-pointer"
                    >
                      <CalendarIcon className="h-3 w-3 mr-2" />
                      Edit Range
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    {statusOptions.map(option => (
                      <Button
                        key={option.value}
                        variant={selectedStatuses.includes(option.value) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleStatusToggle(option.value)}
                        className="justify-start cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3" />
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
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Department
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Department</label>
                  <div className="space-y-3">
                    {/* All Option */}
                    <Button
                      variant={selectedDepartments.includes('all') ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleDepartmentToggle('all')}
                      className="w-full justify-start cursor-pointer"
                    >
                      <CheckCheck className="h-4 w-4 mr-2" />
                      All Departments
                    </Button>
                    
                    {/* Options List */}
                    <div className="max-h-60 overflow-y-auto space-y-1">
                      {departmentOptions.map(option => (
                        <Button
                          key={option.value}
                          variant={selectedDepartments.includes(option.value) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleDepartmentToggle(option.value)}
                          className="w-full justify-start cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            {selectedDepartments.includes(option.value) ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <Circle className="h-4 w-4" />
                            )}
                            <span className="text-sm">{option.label}</span>
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
                  <Users className="h-5 w-5" />
                  Agents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Agents</label>
                  <div className="space-y-3">
                    {/* All Option */}
                    <Button
                      variant={selectedAgents.includes('all') ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleAgentToggle('all')}
                      className="w-full justify-start cursor-pointer"
                    >
                      <CheckCheck className="h-4 w-4 mr-2" />
                      All Agents
                    </Button>
                    
                    {/* Search Input */}
                    <div className="relative">
                      <Input
                        placeholder="Search agents..."
                        value={agentSearchTerm}
                        onChange={(e) => setAgentSearchTerm(e.target.value)}
                        className="pr-8"
                      />
                      <Filter className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                    
                    {/* Options List */}
                    <div className="max-h-60 overflow-y-auto space-y-1">
                      {getFilteredAgents().map(agent => (
                        <Button
                          key={agent.id}
                          variant={selectedAgents.includes(agent.id) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleAgentToggle(agent.id)}
                          className="w-full justify-start cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            {selectedAgents.includes(agent.id) ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <Circle className="h-4 w-4" />
                            )}
                            <span className="text-sm">{agent.name}</span>
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
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh}
                  disabled={loading}
                  className="w-full cursor-pointer"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
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
        {showDateRangeDialog && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4">
              Date range dialog would go here
            </div>
          </div>
        )}
        {/* Header with Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold tracking-tight">Agent Performance</h1>
            <p className="text-muted-foreground">
              Comprehensive agent performance metrics and analytics
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

        {/* Active Filters Display */}
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-muted-foreground">Active Filters</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={resetFilters}
                  className="h-6 px-2 text-xs"
                >
                  Clear All
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 items-center">
                {/* Date Range Section */}
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm font-medium text-muted-foreground">Date:</span>
                  <Badge variant="secondary">
                    {timeRangeOptions.find(opt => opt.value === selectedTimeRange)?.label || 'Select range'}
                  </Badge>
                </div>
                
                {/* Status Section */}
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm font-medium text-muted-foreground">Status:</span>
                  {selectedStatuses.includes('all') ? (
                    <Badge variant="secondary">
                      All Status
                    </Badge>
                  ) : (
                    <div className="flex gap-1">
                      {selectedStatuses.map(status => (
                        <Badge key={status} variant="outline" className="bg-blue-100 text-blue-800">
                          {statusOptions.find(opt => opt.value === status)?.label || status}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Department Section */}
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm font-medium text-muted-foreground">Department:</span>
                  {selectedDepartments.includes('all') ? (
                    <Badge variant="secondary">
                      All Departments
                    </Badge>
                  ) : (
                    <div className="flex gap-1">
                      {selectedDepartments.map(dept => (
                        <Badge key={dept} variant="outline" className="bg-green-100 text-green-800">
                          {departmentOptions.find(opt => opt.value === dept)?.label || dept}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Answered</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryMetrics.answer}</div>
              <p className="text-xs text-muted-foreground">
                {summaryMetrics.handle} handled calls
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Handle Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryMetrics.avgHandle}</div>
              <p className="text-xs text-muted-foreground">
                {summaryMetrics.avgTalk} talk time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hold & Transfer</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryMetrics.hold + summaryMetrics.transfer}</div>
              <p className="text-xs text-muted-foreground">
                {summaryMetrics.hold} holds, {summaryMetrics.transfer} transfers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg ACW Time</CardTitle>
              <Timer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryMetrics.avgAcw}</div>
              <p className="text-xs text-muted-foreground">
                after call work
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Tables */}
        <Tabs defaultValue="performance-overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="performance-overview">Performance Overview</TabsTrigger>
            <TabsTrigger value="time-analysis">Time Analysis</TabsTrigger>
            <TabsTrigger value="quality-metrics">Quality Metrics</TabsTrigger>
            <TabsTrigger value="adherence">Adherence</TabsTrigger>
            <TabsTrigger value="agent-table">Agent Table</TabsTrigger>
            <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
          </TabsList>

          <TabsContent value="performance-overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Call Volume Overview</CardTitle>
                <CardDescription>
                  Show total call activity - Answered vs Handled calls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={performanceTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="time-analysis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Average Time Breakdown</CardTitle>
                <CardDescription>
                  Compare average durations for key call stages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={satisfactionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quality-metrics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Call Handling Components</CardTitle>
                <CardDescription>
                  Visualize relationship between total handle vs. internal actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={qualityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {qualityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="adherence" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Efficiency Ratio Chart</CardTitle>
                <CardDescription>
                  Compare key efficiency ratios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={adherenceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agent-table" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Agent Performance Table</CardTitle>
                <CardDescription>
                  Detailed performance metrics for all agents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent Name</TableHead>
                      <TableHead className="text-right">Total Calls</TableHead>
                      <TableHead className="text-right">Answered</TableHead>
                      <TableHead className="text-right">Avg Handle</TableHead>
                      <TableHead className="text-right">Quality Score</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agentMetrics.map((agent) => (
                      <TableRow key={agent.agentId}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {agent.agentName}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{agent.totalCalls}</TableCell>
                        <TableCell className="text-right">{agent.answeredCalls}</TableCell>
                        <TableCell className="text-right">{agent.averageHandleTime}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={agent.qualityScore > 85 ? "default" : "secondary"}>
                            {agent.qualityScore}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className={getStatusColor(agent.status)}>
                            {getStatusIcon(agent.status)}
                            {agent.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="satisfaction" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Agent Satisfaction Trends</CardTitle>
                <CardDescription>
                  Agent satisfaction scores over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={agentMetrics.map(agent => ({
                    name: agent.agentName,
                    satisfaction: parseFloat(agent.satisfaction)
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="satisfaction" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayoutSimple>
  )
}