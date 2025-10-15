"use client"

import { useState, useEffect, useCallback } from 'react'
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
  Circle,
  Search,
  Download
} from 'lucide-react'
import { SidebarNavigation } from '@/components/sidebar-navigation'
import { AgentDataTable } from '@/components/agent-management/AgentDataTable'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DashboardLayoutSimple } from '@/components/dashboard-layout-simple'

import { DateRangeDialog } from '@/components/dashboard-wrappers/DateRangeDialog'
import { toast } from 'sonner'

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

interface ProcessedAgentData {
  agentId: string
  agentName: string
  mediaType: string
  timeInStatus: number
  status: 'available' | 'busy' | 'break' | 'offline' | 'training'
  answeredCalls: number
  handledCalls: number
  averageHandleTime: string
  averageTalkTime: string
  averageHoldTime: string
  averageAcwTime: string
  holdCount: number
  transferCount: number
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
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTimeRange, setSelectedTimeRange] = useState('last_24_hours')
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['all'])
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(['all'])
  const [selectedAgents, setSelectedAgents] = useState<string[]>(['all'])
  const [selectedMediaTypes, setSelectedMediaTypes] = useState<string[]>(['all'])
  const [agentSearchTerm, setAgentSearchTerm] = useState('')
  const [availableAgents, setAvailableAgents] = useState<AgentOption[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showDateRangeDialog, setShowDateRangeDialog] = useState(false)
  const [dateRangeError, setDateRangeError] = useState<string | null>(null)

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

  // API data fetching
  const [agentData, setAgentData] = useState<any[]>([])

  const fetchAgentData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/agent-performance')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setAgentData(data.agentPerformance.agents)
    } catch (error) {
      console.error('Failed to fetch agent data:', error)
      toast.error('Failed to fetch agent data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initialize available agents
    setAvailableAgents([
      { id: 'john', name: 'John Smith', department: 'customer_service', status: 'available' },
      { id: 'sarah', name: 'Sarah Johnson', department: 'technical_support', status: 'available' },
      { id: 'mike', name: 'Mike Wilson', department: 'sales', status: 'busy' },
      { id: 'emily', name: 'Emily Davis', department: 'customer_service', status: 'break' },
      { id: 'david', name: 'David Brown', department: 'quality_assurance', status: 'offline' }
    ])

    fetchAgentData()
  }, [selectedTimeRange, selectedStatuses, selectedDepartments, selectedAgents, selectedMediaTypes])

  // Date range helper functions
  const formatTime = useCallback((time: string) => {
    const [hours, minutes] = time.split(':')
    return `${hours}:${minutes}`
  }, [])

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

  const validateDateRange = useCallback((range: typeof customDateRange) => {
    if (!range.startDate || !range.endDate) {
      setDateRangeError('Please select both start and end dates')
      return false
    }

    if (range.startDate > range.endDate) {
      setDateRangeError('Start date must be before end date')
      return false
    }

    setDateRangeError(null)
    return true
  }, [])

  const applyCustomDateRange = useCallback(() => {
    if (validateDateRange(customDateRange)) {
      setShowDateRangeDialog(false)
      setSelectedTimeRange('custom')
      toast.success('Custom date range applied successfully')
    }
  }, [customDateRange, validateDateRange])

  const applyQuickRange = useCallback((rangeType: string) => {
    setSelectedTimeRange(rangeType)
    if (rangeType === 'custom') {
      setShowDateRangeDialog(true)
    } else {
      toast.success(`${rangeType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} range applied successfully`)
    }
  }, [])

  // Filter panel functions
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

  const resetFilters = () => {
    setSelectedTimeRange('last_24_hours')
    setSelectedStatuses(['all'])
    setSelectedDepartments(['all'])
    setSelectedAgents(['all'])
    setSelectedMediaTypes(['all'])
    setAgentSearchTerm('')
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
    handleRefresh()
  }

  // Helper functions for display
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

  // Process the agent data
  const processedData: ProcessedAgentData[] = agentData.map(agent => {
    // Transform API data to match ProcessedAgentData interface
    return {
      agentId: agent.id,
      agentName: agent.name,
      mediaType: 'voice',
      timeInStatus: 7200, // Default 2 hours
      status: agent.status === 'needs_improvement' ? 'busy' : 'available',
      answeredCalls: agent.answeredCalls,
      handledCalls: agent.answeredCalls,
      averageHandleTime: agent.averageHandleTime,
      averageTalkTime: agent.averageTalkTime,
      averageHoldTime: '0:00',
      averageAcwTime: agent.averageWrapTime,
      holdCount: 0,
      transferCount: 0
    }
  })

  // Filter data using comprehensive filters
  const filteredData = processedData
    .filter(agent =>
      agent.agentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.agentName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(agent =>
      selectedStatuses.includes('all') || selectedStatuses.includes(agent.status)
    )
    .filter(agent => {
      // This would normally check against agent departments, but for now we'll pass all
      return selectedDepartments.includes('all')
    })
    .filter(agent => {
      // This would normally check against specific agent selection
      return selectedAgents.includes('all') || selectedAgents.includes(agent.agentId)
    })
    .filter(agent => {
      // This would normally check against media types, but for now we'll pass all
      return selectedMediaTypes.includes('all') || selectedMediaTypes.includes(agent.mediaType)
    })

  // Transform filteredData to match AgentDataTable interface
  const transformedAgentData = filteredData.map(agent => {
    // Parse time strings back to seconds for calculations
    const parseTimeToSeconds = (timeStr: string): number => {
      const [minutes, seconds] = timeStr.split(':').map(Number)
      return minutes * 60 + seconds
    }

    return {
      agentId: agent.agentId,
      agentName: agent.agentName,
      timeInStatus: agent.timeInStatus,
      status: agent.status,
      answered: agent.answeredCalls,
      handled: agent.handledCalls,
      avgHandle: parseTimeToSeconds(agent.averageHandleTime),
      avgTalk: parseTimeToSeconds(agent.averageTalkTime),
      avgHold: parseTimeToSeconds(agent.averageHoldTime),
      avgACW: parseTimeToSeconds(agent.averageAcwTime),
      hold: agent.holdCount,
      transfer: agent.transferCount
    }
  })

  // Calculate summary statistics
  const totals = processedData.reduce((acc, agent) => {
    acc.totalAnswered += agent.answeredCalls
    acc.totalHandled += agent.handledCalls
    acc.totalHold += agent.holdCount
    acc.totalTransfer += agent.transferCount
    acc.totalAgents += 1
    acc.availableAgents += agent.status === 'available' ? 1 : 0
    acc.busyAgents += agent.status === 'busy' ? 1 : 0
    acc.breakAgents += agent.status === 'break' ? 1 : 0
    acc.trainingAgents += agent.status === 'training' ? 1 : 0
    acc.offlineAgents += agent.status === 'offline' ? 1 : 0

    // Parse time strings to seconds for calculations
    const parseTimeToSeconds = (timeStr: string): number => {
      const [minutes, seconds] = timeStr.split(':').map(Number)
      return minutes * 60 + seconds
    }

    acc.totalHandleTime += parseTimeToSeconds(agent.averageHandleTime)
    acc.totalTalkTime += parseTimeToSeconds(agent.averageTalkTime)
    acc.totalHoldTime += parseTimeToSeconds(agent.averageHoldTime)
    acc.totalAcwTime += parseTimeToSeconds(agent.averageAcwTime)
    acc.totalTimeInStatus += agent.timeInStatus

    return acc
  }, {
    totalAnswered: 0,
    totalHandled: 0,
    totalHold: 0,
    totalTransfer: 0,
    totalAgents: 0,
    availableAgents: 0,
    busyAgents: 0,
    breakAgents: 0,
    trainingAgents: 0,
    offlineAgents: 0,
    totalHandleTime: 0,
    totalTalkTime: 0,
    totalHoldTime: 0,
    totalAcwTime: 0,
    totalTimeInStatus: 0
  })

  const avgAnswered = processedData.length > 0 ? Math.round(totals.totalAnswered / processedData.length) : 0
  const avgHandled = processedData.length > 0 ? Math.round(totals.totalHandled / processedData.length) : 0
  const avgHandleTime = processedData.length > 0 ? Math.round(totals.totalHandleTime / processedData.length) : 0
  const avgTalkTime = processedData.length > 0 ? Math.round(totals.totalTalkTime / processedData.length) : 0
  const avgHoldTime = processedData.length > 0 ? Math.round(totals.totalHoldTime / processedData.length) : 0
  const avgAcwTime = processedData.length > 0 ? Math.round(totals.totalAcwTime / processedData.length) : 0
  const avgTimeInStatus = processedData.length > 0 ? Math.round(totals.totalTimeInStatus / processedData.length) : 0

  const getPerformanceColor = (value: number, type: 'calls' | 'efficiency' | 'time') => {
    if (type === 'calls') {
      if (value >= 40) return 'text-green-600'
      if (value >= 25) return 'text-yellow-600'
      return 'text-red-600'
    } else if (type === 'efficiency') {
      if (value >= 85) return 'text-green-600'
      if (value >= 70) return 'text-yellow-600'
      return 'text-red-600'
    } else if (type === 'time') {
      if (value <= 180) return 'text-green-600'  // 3 minutes
      if (value <= 300) return 'text-yellow-600'  // 5 minutes
      return 'text-red-600'
    }
    return 'text-gray-600'
  }

  const formatSeconds = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`
    }
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`
    } else {
      return `${remainingSeconds}s`
    }
  }

  const handleExport = () => {
    try {
      // Check if we have data to export
      if (!filteredData || filteredData.length === 0) {
        toast.error('No data available to export')
        return
      }

      // Create CSV content from filteredData (which contains the processed agent data)
      const headers = [
        'Agent ID',
        'Agent Name',
        'Media Type',
        'Time in Status (seconds)',
        'Status',
        'Answered Calls',
        'Handled Calls',
        'Average Handle Time',
        'Average Talk Time',
        'Average Hold Time',
        'Average ACW Time',
        'Hold Count',
        'Transfer Count'
      ]

      const csvContent = [
        headers.join(','),
        ...filteredData.map(agent => [
          agent.agentId || '',
          `"${agent.agentName || ''}"`,
          agent.mediaType || '',
          agent.timeInStatus || 0,
          agent.status || '',
          agent.answeredCalls || 0,
          agent.handledCalls || 0,
          agent.averageHandleTime || '0:00',
          agent.averageTalkTime || '0:00',
          agent.averageHoldTime || '0:00',
          agent.averageAcwTime || '0:00',
          agent.holdCount || 0,
          agent.transferCount || 0
        ].join(','))
      ].join('\n')

      // Create and download the CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `agent-performance-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('Agent performance data exported successfully')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export data')
    }
  }


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


  if (false) {
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
            <Button
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={handleExport}
              className="cursor-pointer transition-all duration-200 hover:scale-105"
            > <Download className="h-4 w-4 mr-2" /> Export</Button>
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
                      onClick={() => {
                        setShowDateRangeDialog(true)
                      }}
                      className="w-full cursor-pointer"
                    >
                      <CalendarIcon className="h-3 w-3 mr-2" />
                      Edit Range
                    </Button>
                  </div>
                )}

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
                  onClick={handleApplyAndCloseFilters}
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
        <Dialog open={showDateRangeDialog} onOpenChange={setShowDateRangeDialog}>
          {dateRangeDialogContent}
        </Dialog>



        {/* Agent Performance Table */}
        <AgentDataTable data={transformedAgentData} />


      </div>
    </DashboardLayoutSimple>
  )
}