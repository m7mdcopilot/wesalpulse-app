"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
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
  X
} from 'lucide-react'
import { DashboardLayoutSimple } from '@/components/dashboard-layout-simple'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AnalyticsFilters } from '@/components/analytics-filters/AnalyticsFilters'

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
  { value: 'last_month', label: 'Last Month' }
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
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [showWidgetDialog, setShowWidgetDialog] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
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
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [selectedTimeRange, selectedStatuses, selectedDepartments])

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
      {/* Analytics Filters Panel */}
      <AnalyticsFilters
        showFilters={showFilters}
        selectedTimeRange={selectedTimeRange}
        filterOptions={{
          timeRangeOptions,
          primaryFilterOptions: statusOptions,
          secondaryFilterOptions: departmentOptions
        }}
        selectedPrimaryFilters={selectedStatuses}
        selectedSecondaryFilters={selectedDepartments}
        loading={loading}
        filterType="agents"
        onCloseFilters={() => setShowFilters(false)}
        onTimeRangeChange={setSelectedTimeRange}
        onPrimaryFilterToggle={handleStatusToggle}
        onSecondaryFilterToggle={handleDepartmentToggle}
        onFetchData={handleRefresh}
        onResetFilters={resetFilters}
      />
      
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