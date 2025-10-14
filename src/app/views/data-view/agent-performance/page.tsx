"use client"

import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SidebarNavigation } from '@/components/sidebar-navigation'
import { AgentDataTable } from '@/components/agent-management/AgentDataTable'
import { CalendarWithDropdowns } from '@/components/ui/calendar-with-dropdowns'
import { TimePicker } from '@/components/ui/time-picker'
import { DateRangeDisplay } from '@/components/ui/date-range-display'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  BarChart3, 
  Phone, 
  Clock, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Timer,
  Zap,
  Target,
  Pause,
  User,
  Headphones,
  Calendar as CalendarIcon,
  RotateCcw,
  AlertTriangle as AlertTriangleIcon
} from 'lucide-react'

interface AgentMetric {
  metric: string
  stats: {
    count?: number
    max?: number
    min?: number
    sum?: number
    ratio?: number
    numerator?: number
    denominator?: number
    target?: number
  }
}

interface AgentData {
  interval: string
  metrics: AgentMetric[]
}

interface AgentGroup {
  mediaType: string
  agentId: string
  data: AgentData[]
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

// Agent name mapping function
const getAgentName = (agentId: string): string => {
  const agentNames: Record<string, string> = {
    '001': 'John Smith',
    '002': 'Sarah Johnson',
    '003': 'Michael Brown',
    '004': 'Emily Davis',
    '005': 'David Wilson',
    '006': 'Lisa Anderson',
    '007': 'Robert Taylor',
    '008': 'Jennifer Martinez',
    '009': 'William Garcia',
    '010': 'Maria Rodriguez',
    '011': 'James Thompson',
    '012': 'Patricia White',
    '013': 'Christopher Lee',
    '014': 'Linda Harris',
    '015': 'Daniel Clark',
    '016': 'Susan Lewis',
    '017': 'Matthew Walker',
    '018': 'Karen Hall',
    '019': 'Anthony Allen',
    '020': 'Nancy Young'
  }
  
  return agentNames[agentId] || `Agent ${agentId}`
}

// Time range options
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

const mockAgentData: AgentGroup[] = [
  {
    "group": {
      "mediaType": "voice",
      "agentId": "001"
    },
    "data": [
      {
        "interval": "2025-01-25T21:00:00.000Z/2025-02-01T21:00:00.000Z",
        "metrics": [
          {"metric": "nAnswered", "stats": {"count": 45}},
          {"metric": "nHandled", "stats": {"count": 42}},
          {"metric": "nHeld", "stats": {"count": 3}},
          {"metric": "nTransferred", "stats": {"count": 2}},
          {"metric": "tAcw", "stats": {"max": 120, "min": 30, "count": 42, "sum": 2520}},
          {"metric": "tHandle", "stats": {"max": 480, "min": 120, "count": 42, "sum": 12600}},
          {"metric": "tTalk", "stats": {"max": 360, "min": 90, "count": 45, "sum": 10800}},
          {"metric": "tHeld", "stats": {"max": 60, "min": 10, "count": 3, "sum": 120}}
        ]
      }
    ]
  },
  {
    "group": {
      "mediaType": "voice",
      "agentId": "002"
    },
    "data": [
      {
        "interval": "2025-01-25T21:00:00.000Z/2025-02-01T21:00:00.000Z",
        "metrics": [
          {"metric": "nAnswered", "stats": {"count": 38}},
          {"metric": "nHandled", "stats": {"count": 36}},
          {"metric": "nHeld", "stats": {"count": 5}},
          {"metric": "nTransferred", "stats": {"count": 1}},
          {"metric": "tAcw", "stats": {"max": 150, "min": 45, "count": 36, "sum": 3240}},
          {"metric": "tHandle", "stats": {"max": 420, "min": 150, "count": 36, "sum": 10800}},
          {"metric": "tTalk", "stats": {"max": 300, "min": 120, "count": 38, "sum": 9120}},
          {"metric": "tHeld", "stats": {"max": 90, "min": 15, "count": 5, "sum": 300}}
        ]
      }
    ]
  },
  {
    "group": {
      "mediaType": "voice",
      "agentId": "003"
    },
    "data": [
      {
        "interval": "2025-01-25T21:00:00.000Z/2025-02-01T21:00:00.000Z",
        "metrics": [
          {"metric": "nAnswered", "stats": {"count": 52}},
          {"metric": "nHandled", "stats": {"count": 50}},
          {"metric": "nHeld", "stats": {"count": 8}},
          {"metric": "nTransferred", "stats": {"count": 3}},
          {"metric": "tAcw", "stats": {"max": 180, "min": 60, "count": 50, "sum": 5400}},
          {"metric": "tHandle", "stats": {"max": 600, "min": 180, "count": 50, "sum": 18000}},
          {"metric": "tTalk", "stats": {"max": 480, "min": 150, "count": 52, "sum": 15600}},
          {"metric": "tHeld", "stats": {"max": 120, "min": 20, "count": 8, "sum": 600}}
        ]
      }
    ]
  },
  {
    "group": {
      "mediaType": "voice",
      "agentId": "004"
    },
    "data": [
      {
        "interval": "2025-01-25T21:00:00.000Z/2025-02-01T21:00:00.000Z",
        "metrics": [
          {"metric": "nAnswered", "stats": {"count": 29}},
          {"metric": "nHandled", "stats": {"count": 28}},
          {"metric": "nHeld", "stats": {"count": 2}},
          {"metric": "nTransferred", "stats": {"count": 0}},
          {"metric": "tAcw", "stats": {"max": 90, "min": 30, "count": 28, "sum": 1680}},
          {"metric": "tHandle", "stats": {"max": 360, "min": 120, "count": 28, "sum": 8400}},
          {"metric": "tTalk", "stats": {"max": 300, "min": 90, "count": 29, "sum": 7250}},
          {"metric": "tHeld", "stats": {"max": 45, "min": 15, "count": 2, "sum": 90}}
        ]
      }
    ]
  },
  {
    "group": {
      "mediaType": "voice",
      "agentId": "005"
    },
    "data": [
      {
        "interval": "2025-01-25T21:00:00.000Z/2025-02-01T21:00:00.000Z",
        "metrics": [
          {"metric": "nAnswered", "stats": {"count": 41}},
          {"metric": "nHandled", "stats": {"count": 39}},
          {"metric": "nHeld", "stats": {"count": 4}},
          {"metric": "nTransferred", "stats": {"count": 1}},
          {"metric": "tAcw", "stats": {"max": 135, "min": 45, "count": 39, "sum": 3510}},
          {"metric": "tHandle", "stats": {"max": 450, "min": 135, "count": 39, "sum": 13650}},
          {"metric": "tTalk", "stats": {"max": 360, "min": 105, "count": 41, "sum": 10250}},
          {"metric": "tHeld", "stats": {"max": 75, "min": 20, "count": 4, "sum": 240}}
        ]
      }
    ]
  },
  {
    "group": {
      "mediaType": "voice",
      "agentId": "006"
    },
    "data": [
      {
        "interval": "2025-01-25T21:00:00.000Z/2025-02-01T21:00:00.000Z",
        "metrics": [
          {"metric": "nAnswered", "stats": {"count": 33}},
          {"metric": "nHandled", "stats": {"count": 31}},
          {"metric": "nHeld", "stats": {"count": 6}},
          {"metric": "nTransferred", "stats": {"count": 2}},
          {"metric": "tAcw", "stats": {"max": 165, "min": 50, "count": 31, "sum": 3410}},
          {"metric": "tHandle", "stats": {"max": 510, "min": 150, "count": 31, "sum": 12400}},
          {"metric": "tTalk", "stats": {"max": 420, "min": 120, "count": 33, "sum": 9900}},
          {"metric": "tHeld", "stats": {"max": 105, "min": 25, "count": 6, "sum": 480}}
        ]
      }
    ]
  },
  {
    "group": {
      "mediaType": "voice",
      "agentId": "007"
    },
    "data": [
      {
        "interval": "2025-01-25T21:00:00.000Z/2025-02-01T21:00:00.000Z",
        "metrics": [
          {"metric": "nAnswered", "stats": {"count": 47}},
          {"metric": "nHandled", "stats": {"count": 45}},
          {"metric": "nHeld", "stats": {"count": 7}},
          {"metric": "nTransferred", "stats": {"count": 4}},
          {"metric": "tAcw", "stats": {"max": 195, "min": 60, "count": 45, "sum": 5850}},
          {"metric": "tHandle", "stats": {"max": 540, "min": 165, "count": 45, "sum": 15750}},
          {"metric": "tTalk", "stats": {"max": 450, "min": 135, "count": 47, "sum": 14100}},
          {"metric": "tHeld", "stats": {"max": 120, "min": 30, "count": 7, "sum": 630}}
        ]
      }
    ]
  },
  {
    "group": {
      "mediaType": "voice",
      "agentId": "008"
    },
    "data": [
      {
        "interval": "2025-01-25T21:00:00.000Z/2025-02-01T21:00:00.000Z",
        "metrics": [
          {"metric": "nAnswered", "stats": {"count": 25}},
          {"metric": "nHandled", "stats": {"count": 24}},
          {"metric": "nHeld", "stats": {"count": 1}},
          {"metric": "nTransferred", "stats": {"count": 0}},
          {"metric": "tAcw", "stats": {"max": 75, "min": 25, "count": 24, "sum": 1200}},
          {"metric": "tHandle", "stats": {"max": 300, "min": 90, "count": 24, "sum": 6000}},
          {"metric": "tTalk", "stats": {"max": 240, "min": 75, "count": 25, "sum": 6000}},
          {"metric": "tHeld", "stats": {"max": 30, "min": 30, "count": 1, "sum": 30}}
        ]
      }
    ]
  },
  {
    "group": {
      "mediaType": "voice",
      "agentId": "009"
    },
    "data": [
      {
        "interval": "2025-01-25T21:00:00.000Z/2025-02-01T21:00:00.000Z",
        "metrics": [
          {"metric": "nAnswered", "stats": {"count": 36}},
          {"metric": "nHandled", "stats": {"count": 34}},
          {"metric": "nHeld", "stats": {"count": 3}},
          {"metric": "nTransferred", "stats": {"count": 1}},
          {"metric": "tAcw", "stats": {"max": 120, "min": 40, "count": 34, "sum": 2720}},
          {"metric": "tHandle", "stats": {"max": 390, "min": 120, "count": 34, "sum": 10200}},
          {"metric": "tTalk", "stats": {"max": 330, "min": 100, "count": 36, "sum": 8280}},
          {"metric": "tHeld", "stats": {"max": 60, "min": 20, "count": 3, "sum": 150}}
        ]
      }
    ]
  },
  {
    "group": {
      "mediaType": "voice",
      "agentId": "010"
    },
    "data": [
      {
        "interval": "2025-01-25T21:00:00.000Z/2025-02-01T21:00:00.000Z",
        "metrics": [
          {"metric": "nAnswered", "stats": {"count": 43}},
          {"metric": "nHandled", "stats": {"count": 41}},
          {"metric": "nHeld", "stats": {"count": 5}},
          {"metric": "nTransferred", "stats": {"count": 2}},
          {"metric": "tAcw", "stats": {"max": 150, "min": 45, "count": 41, "sum": 3690}},
          {"metric": "tHandle", "stats": {"max": 480, "min": 135, "count": 41, "sum": 14350}},
          {"metric": "tTalk", "stats": {"max": 390, "min": 115, "count": 43, "sum": 11180}},
          {"metric": "tHeld", "stats": {"max": 90, "min": 25, "count": 5, "sum": 350}}
        ]
      }
    ]
  }
]

export default function DataViewAgentPerformance() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedTimeRange, setSelectedTimeRange] = useState('last_24_hours')
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
  const [loading, setLoading] = useState(false)

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
    fetchAgentData()
  }, [])

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

  // Filter data (search only)
  const filteredData = processedData
    .filter(agent => 
      agent.agentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.agentName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(agent => statusFilter === 'all' || agent.status === statusFilter)

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
    toast.success('Agent performance data exported successfully')
  }

  const handleRefresh = () => {
    fetchAgentData()
    toast.success('Agent performance data refreshed successfully')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <SidebarNavigation />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Agent Performance</h1>
              <p className="text-gray-600 mt-1">Monitor and analyze individual agent performance metrics</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Date Range and Actions */}
              <div className="flex gap-2">
                <Select value={selectedTimeRange} onValueChange={(value) => {
                  if (value === 'custom') {
                    setShowDateRangeDialog(true)
                  }
                  applyQuickRange(value)
                }}>
                  <SelectTrigger className="w-44">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <SelectValue>{getFormattedDateRangeDisplay()}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {timeRangeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Date Range Display */}
          <DateRangeDisplay 
            selectedTimeRange={selectedTimeRange}
            customDateRange={customDateRange}
            onEdit={() => setShowDateRangeDialog(true)}
          />

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search agents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="busy">Busy</SelectItem>
                    <SelectItem value="break">Break</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Agent Performance Table */}
          <AgentDataTable data={transformedAgentData} />
        </div>
      </div>

      {/* Date Range Dialog */}
      <Dialog open={showDateRangeDialog} onOpenChange={setShowDateRangeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Select Date Range
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Quick Range Presets */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Quick Presets</Label>
              <div className="grid grid-cols-4 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyQuickRange('today')}
                  className="text-xs h-8"
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyQuickRange('yesterday')}
                  className="text-xs h-8"
                >
                  Yesterday
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyQuickRange('this_week')}
                  className="text-xs h-8"
                >
                  This Week
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyQuickRange('last_week')}
                  className="text-xs h-8"
                >
                  Last Week
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyQuickRange('this_month')}
                  className="text-xs h-8"
                >
                  This Month
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyQuickRange('last_month')}
                  className="text-xs h-8"
                >
                  Last Month
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyQuickRange('last_7_days')}
                  className="text-xs h-8"
                >
                  Last 7 Days
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyQuickRange('last_30_days')}
                  className="text-xs h-8"
                >
                  Last 30 Days
                </Button>
              </div>
            </div>

            {/* Custom Date Selection */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Custom Date Range</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {customDateRange.startDate ? format(customDateRange.startDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarWithDropdowns
                        mode="single"
                        selected={customDateRange.startDate}
                        onSelect={(date) => setCustomDateRange(prev => ({ ...prev, startDate: date }))}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {customDateRange.endDate ? format(customDateRange.endDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarWithDropdowns
                        mode="single"
                        selected={customDateRange.endDate}
                        onSelect={(date) => setCustomDateRange(prev => ({ ...prev, endDate: date }))}
                        disabled={(date) => date > new Date() || (customDateRange.startDate ? date < customDateRange.startDate : false)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Start Time</Label>
                  <TimePicker
                    value={customDateRange.startTime}
                    onChange={(time) => setCustomDateRange(prev => ({ ...prev, startTime: time }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">End Time</Label>
                  <TimePicker
                    value={customDateRange.endTime}
                    onChange={(time) => setCustomDateRange(prev => ({ ...prev, endTime: time }))}
                  />
                </div>
              </div>

              {dateRangeError && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertTriangleIcon className="h-4 w-4" />
                  {dateRangeError}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-between gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  const now = new Date()
                  const yesterday = new Date(now)
                  yesterday.setDate(yesterday.getDate() - 1)
                  setCustomDateRange({
                    startDate: yesterday,
                    endDate: now,
                    startTime: '00:00',
                    endTime: '23:59'
                  })
                  setDateRangeError(null)
                }}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset to Default
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowDateRangeDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={applyCustomDateRange}>
                  Apply Range
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}