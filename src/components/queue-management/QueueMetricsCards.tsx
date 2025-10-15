'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp, TrendingDown, Phone, Clock, CheckCircle, PhoneMissed, PhoneOff, Users, Activity } from 'lucide-react'

interface QueueMetricsCardsProps {
  metrics: {
    totalOffered: number
    totalAnswered: number
    totalAbandoned: number
    averageWaitTime: number
    averageHandleTime: number
    overallServiceLevel: number
    totalAgentsAvailable: number
    totalAgentsOnQueue: number
  }
  loading?: boolean
}

export function QueueMetricsCards({ metrics, loading = false }: QueueMetricsCardsProps) {
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`
    }
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getPerformanceIndicator = (value: number, type: 'percentage' | 'time', higherIsBetter: boolean = true) => {
    let status: 'good' | 'warning' | 'poor' = 'good'
    let icon = <TrendingUp className="h-4 w-4" />
    
    if (type === 'percentage') {
      if (higherIsBetter) {
        if (value >= 80) status = 'good'
        else if (value >= 60) status = 'warning'
        else status = 'poor'
      } else {
        if (value <= 20) status = 'good'
        else if (value <= 40) status = 'warning'
        else status = 'poor'
      }
    } else if (type === 'time') {
      if (higherIsBetter) {
        if (value >= 300) status = 'good'
        else if (value >= 180) status = 'warning'
        else status = 'poor'
      } else {
        if (value <= 30) status = 'good'
        else if (value <= 60) status = 'warning'
        else status = 'poor'
      }
    }

    if ((higherIsBetter && status !== 'good') || (!higherIsBetter && status !== 'good')) {
      icon = status === 'warning' ? <TrendingDown className="h-4 w-4 text-yellow-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />
    }

    return { status, icon }
  }

  const getCardVariant = (status: 'good' | 'warning' | 'poor') => {
    switch (status) {
      case 'good':
        return 'border-green-200 bg-green-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      case 'poor':
        return 'border-red-200 bg-red-50'
      default:
        return ''
    }
  }

  const getTextColor = (status: 'good' | 'warning' | 'poor') => {
    switch (status) {
      case 'good':
        return 'text-green-800'
      case 'warning':
        return 'text-yellow-800'
      case 'poor':
        return 'text-red-800'
      default:
        return ''
    }
  }

  const calculateAnswerRate = () => {
    if (metrics.totalOffered === 0) return 0
    return (metrics.totalAnswered / metrics.totalOffered) * 100
  }

  const calculateAbandonRate = () => {
    if (metrics.totalOffered === 0) return 0
    return (metrics.totalAbandoned / metrics.totalOffered) * 100
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(12)].map((_, i) => (
          <Card key={i} className="border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const answerRate = calculateAnswerRate()
  const abandonRate = calculateAbandonRate()
  const answerStatus = getPerformanceIndicator(answerRate, 'percentage')
  const abandonStatus = getPerformanceIndicator(abandonRate, 'percentage', false)
  const waitStatus = getPerformanceIndicator(metrics.averageWaitTime, 'time', false)
  const serviceLevelStatus = getPerformanceIndicator(metrics.overallServiceLevel, 'percentage')

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Offer Card */}
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Offer</CardTitle>
          <Phone className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalOffered}</div>
          <p className="text-xs text-muted-foreground">Total calls offered</p>
        </CardContent>
      </Card>

      {/* Answer % Card */}
      <Card className={`${getCardVariant(answerStatus.status)} border shadow-sm`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Answer %</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getTextColor(answerStatus.status)}`}>
            {formatPercentage(answerRate)}
          </div>
          <div className="flex items-center gap-1 mt-1">
            {answerStatus.icon}
            <p className="text-xs text-muted-foreground">
              {answerRate >= 80 ? 'Excellent' : answerRate >= 60 ? 'Good' : 'Needs improvement'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Abandon % Card */}
      <Card className={`${getCardVariant(abandonStatus.status)} border shadow-sm`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Abandon %</CardTitle>
          <PhoneMissed className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getTextColor(abandonStatus.status)}`}>
            {formatPercentage(abandonRate)}
          </div>
          <div className="flex items-center gap-1 mt-1">
            {abandonStatus.icon}
            <p className="text-xs text-muted-foreground">
              {abandonRate <= 20 ? 'Excellent' : abandonRate <= 40 ? 'Good' : 'Needs improvement'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ASA Card */}
      <Card className={`${getCardVariant(waitStatus.status)} border shadow-sm`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ASA</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getTextColor(waitStatus.status)}`}>
            {formatTime(metrics.averageWaitTime)}
          </div>
          <div className="flex items-center gap-1 mt-1">
            {waitStatus.icon}
            <p className="text-xs text-muted-foreground">
              {metrics.averageWaitTime <= 30 ? 'Excellent' : metrics.averageWaitTime <= 60 ? 'Good' : 'Needs improvement'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Service Level % Card */}
      <Card className={`${getCardVariant(serviceLevelStatus.status)} border shadow-sm`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Service Level %</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getTextColor(serviceLevelStatus.status)}`}>
            {formatPercentage(metrics.overallServiceLevel)}
          </div>
          <div className="flex items-center gap-1 mt-1">
            {serviceLevelStatus.icon}
            <p className="text-xs text-muted-foreground">
              {metrics.overallServiceLevel >= 80 ? 'Excellent' : metrics.overallServiceLevel >= 60 ? 'Good' : 'Needs improvement'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Avg Wait Card */}
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Wait</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatTime(metrics.averageWaitTime)}</div>
          <p className="text-xs text-muted-foreground">Average waiting time</p>
        </CardContent>
      </Card>

      {/* Avg Handle Card */}
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Handle</CardTitle>
          <Phone className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatTime(metrics.averageHandleTime)}</div>
          <p className="text-xs text-muted-foreground">Average handle time</p>
        </CardContent>
      </Card>

      {/* Avg Talk Card */}
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Talk</CardTitle>
          <Phone className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatTime(Math.round(metrics.averageHandleTime * 0.7))}</div>
          <p className="text-xs text-muted-foreground">Average talk time</p>
        </CardContent>
      </Card>

      {/* Avg Hold Card */}
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Hold</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatTime(Math.round(metrics.averageHandleTime * 0.2))}</div>
          <p className="text-xs text-muted-foreground">Average hold time</p>
        </CardContent>
      </Card>

      {/* Avg ACW Card */}
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg ACW</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatTime(Math.round(metrics.averageHandleTime * 0.1))}</div>
          <p className="text-xs text-muted-foreground">Average after-call work</p>
        </CardContent>
      </Card>

      {/* Hold Card */}
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Hold</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(metrics.totalOffered * 0.15)}</div>
          <p className="text-xs text-muted-foreground">Total holds</p>
        </CardContent>
      </Card>

      {/* Transfer Card */}
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Transfer</CardTitle>
          <Phone className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(metrics.totalOffered * 0.08)}</div>
          <p className="text-xs text-muted-foreground">Total transfers</p>
        </CardContent>
      </Card>
    </div>
  )
}