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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DateRangeDialog } from '@/components/dashboard-wrappers/DateRangeDialog'
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
  AlertTriangle as AlertTriangleIcon,
  MessageSquare,
  Check,
  X,
  RefreshCw,
  Bell,
  Building
} from 'lucide-react'

interface AgentOption {
  id: string
  name: string
  department: string
  status: string
}

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

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'available', label: 'Available' },
  { value: 'busy', label: 'Busy' },
  { value: 'break', label: 'On Break' },
  { value: 'offline', label: 'Offline' }
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
    toast.success('Agent performance data exported successfully')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <SidebarNavigation />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
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
                onClick={handleExport}
                className="cursor-pointer transition-all duration-200 hover:scale-105"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
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
                    
                    return `${format(startDateTime, 'MMM dd, yyyy HH:mm')} - ${format(endDateTime, 'MMM dd, yyyy HH:mm')}`
                  })()}
                </span>
              ) : (
                <span>{timeRangeOptions.find(opt => opt.value === selectedTimeRange)?.label || 'Select range'}</span>
              )}
            </Badge>
            
            {/* Status Section */}
            <User className="h-4 w-4 ml-2 text-muted-foreground flex-shrink-0" />
            <span className="text-sm font-medium text-muted-foreground">Status:</span>
            <Badge variant="secondary">
              {getSelectedStatusesLabel()}
            </Badge>
            
            {/* Department Section */}
            <Building className="h-4 w-4 ml-2 text-muted-foreground flex-shrink-0" />
            <span className="text-sm font-medium text-muted-foreground">Department:</span>
            <Badge variant="secondary">
              {getSelectedDepartmentsLabel()}
            </Badge>
            
            {/* Media Type Section */}
            <Phone className="h-4 w-4 ml-2 text-muted-foreground flex-shrink-0" />
            <span className="text-sm font-medium text-muted-foreground">Media:</span>
            <Badge variant="secondary">
              {getSelectedMediaTypesLabel()}
            </Badge>
            
            {/* Agent Section */}
            <Users className="h-4 w-4 ml-2 text-muted-foreground flex-shrink-0" />
            <span className="text-sm font-medium text-muted-foreground">Agents:</span>
            <Badge variant="secondary">
              {getSelectedAgentsLabel()}
            </Badge>
            
            {/* Clear Filters Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="h-6 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          </div>

          {/* Comprehensive Filter Panel - Similar to Analytics Pages */}
          {showFilters && (
            <Card className="border-2 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Filter className="h-5 w-5" />
                  Filter Panel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Time Range Card */}
                <Card className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <CalendarIcon className="h-4 w-4" />
                      Time Range
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {timeRangeOptions.slice(0, 8).map(option => (
                        <Button
                          key={option.value}
                          variant={selectedTimeRange === option.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => applyQuickRange(option.value)}
                          className="text-xs h-8"
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                    <div className="mt-3">
                      <Button
                        variant={selectedTimeRange === 'custom' ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowDateRangeDialog(true)}
                        className="text-xs h-8"
                      >
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        Custom Range
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Status Filter Card */}
                <Card className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <User className="h-4 w-4" />
                      Agent Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {statusOptions.map(option => (
                        <Button
                          key={option.value}
                          variant={selectedStatuses.includes(option.value) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleStatusToggle(option.value)}
                          className="text-xs h-8"
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Department Filter Card */}
                <Card className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Building className="h-4 w-4" />
                      Department
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {departmentOptions.map(option => (
                        <Button
                          key={option.value}
                          variant={selectedDepartments.includes(option.value) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleDepartmentToggle(option.value)}
                          className="text-xs h-8"
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Agent Filter Card */}
                <Card className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Users className="h-4 w-4" />
                      Individual Agents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search agents..."
                          value={agentSearchTerm}
                          onChange={(e) => setAgentSearchTerm(e.target.value)}
                          className="pl-10 h-8"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                        <Button
                          variant={selectedAgents.includes('all') ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleAgentToggle('all')}
                          className="text-xs h-8 justify-start"
                        >
                          <Users className="h-3 w-3 mr-2" />
                          All Agents
                        </Button>
                        {getFilteredAgents().map(agent => (
                          <Button
                            key={agent.id}
                            variant={selectedAgents.includes(agent.id) ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleAgentToggle(agent.id)}
                            className="text-xs h-8 justify-start"
                          >
                            <User className="h-3 w-3 mr-2" />
                            {agent.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Media Type Filter Card */}
                <Card className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Phone className="h-4 w-4" />
                      Media Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {mediaTypeOptions.map(option => (
                        <Button
                          key={option.value}
                          variant={selectedMediaTypes.includes(option.value) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleMediaTypeToggle(option.value)}
                          className="text-xs h-8"
                        >
                          <div className="flex items-center gap-1">
                            {getMediaTypeIcon(option.value)}
                            {option.label}
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Apply Filters Button */}
                <div className="flex justify-end pt-4 border-t">
                  <Button 
                    onClick={() => {
                      handleRefresh()
                      setShowFilters(false)
                    }}
                    className="cursor-pointer"
                  >
                    Apply Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Agent Performance Table */}
          <AgentDataTable data={transformedAgentData} />
        </div>
      </div>

      {/* Date Range Dialog - Using the sophisticated DateRangeDialog component */}
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
    </div>
  )
}