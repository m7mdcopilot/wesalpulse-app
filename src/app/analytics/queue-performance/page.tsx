"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Area,
  Legend
} from 'recharts'
import { 
  Phone, 
  MessageSquare, 
  Mail, 
  Headphones, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Users,
  Zap,
  Target,
  Activity,
  Timer,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

interface QueueMetric {
  id: string
  name: string
  mediaType: string
  offer: number
  answer: number
  abandon: number
  answerRate: number
  abandonRate: number
  asa: number
  serviceLevel: number
  metSLA: boolean
  avgWait: number
  avgHandle: number
  avgTalk: number
  avgHold: number
  avgAcw: number
  hold: number
  transfer: number
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${mins}m`
}

const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`
}

const getMediaTypeIcon = (mediaType: string) => {
  switch (mediaType) {
    case 'voice': return <Phone className="h-4 w-4" />
    case 'chat': return <MessageSquare className="h-4 w-4" />
    case 'email': return <Mail className="h-4 w-4" />
    case 'callback': return <Headphones className="h-4 w-4" />
    default: return <Phone className="h-4 w-4" />
  }
}

const getMediaTypeColor = (mediaType: string) => {
  switch (mediaType) {
    case 'voice': return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'chat': return 'bg-green-100 text-green-700 border-green-200'
    case 'email': return 'bg-purple-100 text-purple-700 border-purple-200'
    case 'callback': return 'bg-orange-100 text-orange-700 border-orange-200'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

export default function QueuePerformanceDashboard() {
  const [loading, setLoading] = useState(true)
  const [queueMetrics, setQueueMetrics] = useState<QueueMetric[]>([])

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setQueueMetrics([
        {
          id: '1',
          name: 'Sales Support',
          mediaType: 'voice',
          offer: 156,
          answer: 142,
          abandon: 14,
          answerRate: 91.0,
          abandonRate: 9.0,
          asa: 28,
          serviceLevel: 85.3,
          metSLA: true,
          avgWait: 32,
          avgHandle: 245,
          avgTalk: 195,
          avgHold: 35,
          avgAcw: 15,
          hold: 28,
          transfer: 12
        },
        {
          id: '2',
          name: 'Technical Support',
          mediaType: 'voice',
          offer: 203,
          answer: 187,
          abandon: 16,
          answerRate: 92.1,
          abandonRate: 7.9,
          asa: 35,
          serviceLevel: 78.8,
          metSLA: false,
          avgWait: 42,
          avgHandle: 312,
          avgTalk: 265,
          avgHold: 42,
          avgAcw: 25,
          hold: 45,
          transfer: 18
        },
        {
          id: '3',
          name: 'Customer Service',
          mediaType: 'voice',
          offer: 189,
          answer: 178,
          abandon: 11,
          answerRate: 94.2,
          abandonRate: 5.8,
          asa: 22,
          serviceLevel: 92.1,
          metSLA: true,
          avgWait: 26,
          avgHandle: 198,
          avgTalk: 165,
          avgHold: 28,
          avgAcw: 15,
          hold: 32,
          transfer: 8
        },
        {
          id: '4',
          name: 'Billing Support',
          mediaType: 'voice',
          offer: 98,
          answer: 89,
          abandon: 9,
          answerRate: 90.8,
          abandonRate: 9.2,
          asa: 45,
          serviceLevel: 72.4,
          metSLA: false,
          avgWait: 58,
          avgHandle: 285,
          avgTalk: 235,
          avgHold: 38,
          avgAcw: 22,
          hold: 15,
          transfer: 6
        },
        {
          id: '5',
          name: 'Chat Support',
          mediaType: 'chat',
          offer: 267,
          answer: 254,
          abandon: 13,
          answerRate: 95.1,
          abandonRate: 4.9,
          asa: 15,
          serviceLevel: 96.3,
          metSLA: true,
          avgWait: 18,
          avgHandle: 185,
          avgTalk: 145,
          avgHold: 25,
          avgAcw: 15,
          hold: 22,
          transfer: 5
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  // Prepare chart data
  const answerAbandonData = queueMetrics.map(queue => ({
    name: queue.name,
    answerRate: queue.answerRate,
    abandonRate: queue.abandonRate
  }))

  const timeMetricsData = queueMetrics.map(queue => ({
    name: queue.name,
    avgWait: queue.avgWait,
    avgHandle: queue.avgHandle,
    avgTalk: queue.avgTalk,
    avgHold: queue.avgHold,
    avgAcw: queue.avgAcw
  }))

  const serviceLevelData = queueMetrics.map(queue => ({
    name: queue.name,
    serviceLevel: queue.serviceLevel,
    metSLA: queue.metSLA ? 100 : 0
  }))

  const holdTransferData = queueMetrics.map(queue => ({
    name: queue.name,
    hold: queue.hold,
    transfer: queue.transfer
  }))

  const asaData = queueMetrics.map(queue => ({
    name: queue.name,
    asa: queue.asa
  }))

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Queue Performance Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive analysis of queue metrics and performance indicators</p>
        </div>
        <Badge variant="outline" className="px-4 py-2 text-sm">
          Last updated: {new Date().toLocaleTimeString()}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Queue Summary Table */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Queue Summary Table
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-900">Queue</TableHead>
                      <TableHead className="font-semibold text-gray-900">Offer</TableHead>
                      <TableHead className="font-semibold text-gray-900">Answer %</TableHead>
                      <TableHead className="font-semibold text-gray-900">Abandon %</TableHead>
                      <TableHead className="font-semibold text-gray-900">Service Level %</TableHead>
                      <TableHead className="font-semibold text-gray-900">Met SLA</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {queueMetrics.map((queue) => (
                      <TableRow key={queue.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getMediaTypeIcon(queue.mediaType)}
                            <span className="font-medium">{queue.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">{queue.offer}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="text-green-600 font-medium">{formatPercentage(queue.answerRate)}</span>
                            <TrendingUp className="h-3 w-3 text-green-600" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="text-red-600 font-medium">{formatPercentage(queue.abandonRate)}</span>
                            <TrendingDown className="h-3 w-3 text-red-600" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${queue.serviceLevel >= 80 ? 'text-green-600' : queue.serviceLevel >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {formatPercentage(queue.serviceLevel)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={queue.metSLA ? "default" : "destructive"} className="text-xs">
                            {queue.metSLA ? "Yes" : "No"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Answer vs Abandon Trend */}
            <Card className="md:col-span-2 hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Answer vs Abandon Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={answerAbandonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value, name) => [formatPercentage(value as number), name === 'answerRate' ? 'Answer Rate' : 'Abandon Rate']}
                      labelStyle={{ color: '#374151' }}
                    />
                    <Bar dataKey="answerRate" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="abandonRate" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Service Level Performance */}
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Service Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {queueMetrics.map((queue, index) => (
                    <div key={queue.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{queue.name}</span>
                        <span className={`text-sm font-bold ${queue.serviceLevel >= 80 ? 'text-green-600' : queue.serviceLevel >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {formatPercentage(queue.serviceLevel)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${queue.serviceLevel >= 80 ? 'bg-green-500' : queue.serviceLevel >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(queue.serviceLevel, 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        {queue.metSLA ? (
                          <Badge variant="default" className="text-xs bg-green-100 text-green-700">Met SLA</Badge>
                        ) : (
                          <Badge variant="destructive" className="text-xs">Missed SLA</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Average Time Metrics */}
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-blue-600" />
                  Average Time Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={timeMetricsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value, name) => [formatDuration(value as number), name === 'avgWait' ? 'Avg Wait' : name === 'avgHandle' ? 'Avg Handle' : name === 'avgTalk' ? 'Avg Talk' : name === 'avgHold' ? 'Avg Hold' : 'Avg ACW']}
                      labelStyle={{ color: '#374151' }}
                    />
                    <Bar dataKey="avgWait" fill="#3b82f6" stackId="a" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="avgTalk" fill="#10b981" stackId="a" />
                    <Bar dataKey="avgHold" fill="#f59e0b" stackId="a" />
                    <Bar dataKey="avgAcw" fill="#8b5cf6" stackId="a" radius={[0, 0, 4, 4]} />
                    <Line type="monotone" dataKey="avgHandle" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Hold & Transfer Analysis */}
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-orange-600" />
                  Hold & Transfer Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={holdTransferData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value, name) => [value, name === 'hold' ? 'Hold Count' : 'Transfer Count']}
                      labelStyle={{ color: '#374151' }}
                    />
                    <Bar dataKey="hold" fill="#f97316" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="transfer" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* ASA Comparison */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-600" />
                ASA Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={asaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value) => [formatDuration(value as number), 'ASA']}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Bar dataKey="asa" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Detailed Metrics Table */}
            <Card className="lg:col-span-2 hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-gray-600" />
                  Detailed Queue Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-900">Queue</TableHead>
                        <TableHead className="font-semibold text-gray-900">ASA</TableHead>
                        <TableHead className="font-semibold text-gray-900">Avg Wait</TableHead>
                        <TableHead className="font-semibold text-gray-900">Avg Handle</TableHead>
                        <TableHead className="font-semibold text-gray-900">Avg Talk</TableHead>
                        <TableHead className="font-semibold text-gray-900">Avg Hold</TableHead>
                        <TableHead className="font-semibold text-gray-900">Avg ACW</TableHead>
                        <TableHead className="font-semibold text-gray-900">Hold</TableHead>
                        <TableHead className="font-semibold text-gray-900">Transfer</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {queueMetrics.map((queue) => (
                        <TableRow key={queue.id} className="hover:bg-gray-50 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getMediaTypeIcon(queue.mediaType)}
                              <span className="font-medium">{queue.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono">{formatDuration(queue.asa)}</TableCell>
                          <TableCell className="font-mono">{formatDuration(queue.avgWait)}</TableCell>
                          <TableCell className="font-mono">{formatDuration(queue.avgHandle)}</TableCell>
                          <TableCell className="font-mono">{formatDuration(queue.avgTalk)}</TableCell>
                          <TableCell className="font-mono">{formatDuration(queue.avgHold)}</TableCell>
                          <TableCell className="font-mono">{formatDuration(queue.avgAcw)}</TableCell>
                          <TableCell className="font-mono">{queue.hold}</TableCell>
                          <TableCell className="font-mono">{queue.transfer}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}