'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Phone, Clock, CheckCircle, PhoneMissed, PhoneOff, Maximize, Minimize, RotateCw, Bell, Check, User, Filter, Users, MessageSquare, X, Building } from 'lucide-react'
import { DashboardLayoutSimple } from '@/components/dashboard-layout-simple'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { useCallCenterStatusData } from '@/hooks/useCallCenterStatusData'

interface QueueOption {
  id: string
  name: string
  mediaTypes: string[]
}

export default function Home() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { data, loading, error, refreshData } = useCallCenterStatusData()
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false)
  const [selectedMediaTypes, setSelectedMediaTypes] = useState<string[]>(['all'])
  const [selectedQueues, setSelectedQueues] = useState<string[]>(['all'])
  const [queueSearchTerm, setQueueSearchTerm] = useState('')
  const [availableQueues, setAvailableQueues] = useState<QueueOption[]>([])

  // Filter options
  const mediaTypeOptions = [
    { value: 'all', label: 'All Media' },
    { value: 'voice', label: 'Voice' },
    { value: 'chat', label: 'Chat' },
    { value: 'email', label: 'Email' },
    { value: 'callback', label: 'Callback' }
  ]

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    
    // Initialize available queues
    setAvailableQueues([
      { id: 'sales', name: 'Sales Queue', mediaTypes: ['voice', 'chat'] },
      { id: 'support', name: 'Support Queue', mediaTypes: ['voice', 'email', 'chat'] },
      { id: 'billing', name: 'Billing Queue', mediaTypes: ['voice', 'email'] },
      { id: 'technical', name: 'Technical Support', mediaTypes: ['voice', 'chat'] },
      { id: 'retention', name: 'Customer Retention', mediaTypes: ['voice'] }
    ])
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  // Filter handlers
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

  const resetFilters = () => {
    setSelectedMediaTypes(['all'])
    setSelectedQueues(['all'])
    setQueueSearchTerm('')
  }

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        toast.error(`Error attempting to enable full-screen mode: ${err.message}`)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  const handleRefresh = () => {
    refreshData()
  }

  if (loading) {
    return (
      <DashboardLayoutSimple>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RotateCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
      </DashboardLayoutSimple>
    )
  }

  if (error) {
    return (
      <DashboardLayoutSimple>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading dashboard data</p>
            <Button onClick={handleRefresh} variant="outline">
              Retry
            </Button>
          </div>
        </div>
      </DashboardLayoutSimple>
    )
  }

  if (!data) {
    return (
      <DashboardLayoutSimple>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">No dashboard data available</p>
            <Button onClick={handleRefresh} variant="outline">
              Refresh
            </Button>
          </div>
        </div>
      </DashboardLayoutSimple>
    )
  }

  const { callCenterStatusToday } = data
  const { callOutcomes, callHandlingMetrics } = callCenterStatusToday

  return (
    <DashboardLayoutSimple>
      <div className="space-y-6">
        {/* Header with Greeting and Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-1">
          <div className="space-y-2">
            <p className="text-muted-foreground text-lg flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span className="font-bold">Organization:</span> {data.company.name} - 
              <div className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>
                Live
              </div>
              Queues Activity
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 cursor-pointer transition-all duration-200 hover:scale-105"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleFullScreen}
              className="flex items-center gap-2 cursor-pointer transition-all duration-200 hover:scale-105"
            >
              {isFullscreen ? (
                <>
                  <Minimize className="h-4 w-4" />
                  Minimize
                </>
              ) : (
                <>
                  <Maximize className="h-4 w-4" />
                  Full screen
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              className="flex items-center gap-2 cursor-pointer transition-all duration-200 hover:scale-105"
            >
              <RotateCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Active Filters Display - Show on top in one line */}
        <div className="flex flex-wrap gap-2 items-center p-1 mb-1 bg-muted/50 rounded-lg">
          <span className="text-sm font-bold text-muted-foreground">Active Filters</span>
          
          {/* Media Type Section */}
          <MessageSquare className="h-4 w-4 ml-2 text-muted-foreground flex-shrink-0" />
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

        {/* Current Call Status */}
        <Card className="bg-card text-card-foreground rounded-xl border shadow-sm py-2">
          <CardHeader>
            <CardTitle className="text-lg">Current Call Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4" style={{ marginTop: '-25px' }}>
              <Card className="bg-green-50 border-green-200 py-2">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-green-600">Waiting Calls</p>
                      <p className="text-8xl font-black text-green-800">{callCenterStatusToday.currentCallStatus.activeCalls > 0 ? Math.floor(callCenterStatusToday.currentCallStatus.activeCalls * 0.3) + 5 : 12}</p>
                      <p className="text-lg text-green-600">customers currently in queue</p>
                    </div>
                    <Phone className="h-18 w-18 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200 py-2">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">Active Calls</p>
                      <p className="text-8xl font-black text-blue-800">{callCenterStatusToday.currentCallStatus.activeCalls}</p>
                      <p className="text-lg text-blue-600">ongoing conversations</p>
                    </div>
                    <Phone className="h-18 w-18 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-purple-50 border-purple-200 py-2">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-purple-600">Idle Agents</p>
                      <p className="text-8xl font-black text-purple-800">{callCenterStatusToday.currentCallStatus.availableAgents}</p>
                      <p className="text-lg text-purple-600">agents available for calls</p>
                    </div>
                    <User className="h-18 w-18 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-purple-50 border-red-200 py-2">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-red-600">Offline Agents</p>
                      <p className="text-8xl font-black text-red-800">{callCenterStatusToday.currentCallStatus.unavailableAgents}</p>
                      <p className="text-lg text-red-600">agents unavailable for calls</p>
                    </div>
                    <User className="h-18 w-18 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Call Outcomes */}
        <Card className="bg-card text-card-foreground rounded-xl border shadow-sm py-2">
          <CardHeader>
            <CardTitle className="text-lg">Call Outcomes</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ marginTop: '-25px' }}>
              <Card className="py-2">
                <CardContent className="p-3 text-center">
                  <Phone className="h-18 w-18 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-2xl font-bold text-muted-foreground">Total Calls</p>
                  <p className="text-8xl font-black">{callOutcomes.total}</p>
                  <p className="text-lg text-muted-foreground">all interactions</p>
                </CardContent>
              </Card>
              <Card className="bg-green-50 border-green-200 py-2">
                <CardContent className="p-3 text-center">
                  <CheckCircle className="h-18 w-18 mx-auto mb-2 text-green-600" />
                  <p className="text-2xl font-bold text-green-600">Answered Calls</p>
                  <p className="text-8xl font-black text-green-800">{callOutcomes.answered}</p>
                  <p className="text-lg text-green-600">successfully handled</p>
                </CardContent>
              </Card>
              <Card className="bg-orange-50 border-orange-200 py-2">
                <CardContent className="p-3 text-center">
                  <PhoneMissed className="h-18 w-18 mx-auto mb-2 text-orange-600" />
                  <p className="text-2xl font-bold text-orange-600">Not Answered</p>
                  <p className="text-8xl font-black text-orange-800">{callOutcomes.total - callOutcomes.answered}</p>
                  <p className="text-lg text-orange-600">missed opportunities</p>
                </CardContent>
              </Card>
              <Card className="bg-red-50 border-red-200 py-2">
                <CardContent className="p-3 text-center">
                  <PhoneOff className="h-18 w-18 mx-auto mb-2 text-red-600" />
                  <p className="text-2xl font-bold text-red-600">Abandoned Calls</p>
                  <p className="text-8xl font-black text-red-800">{callOutcomes.abandoned}</p>
                  <p className="text-lg text-red-600">customer hang-ups</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Call Handling Metrics */}
        <Card className="bg-card text-card-foreground rounded-xl border shadow-sm py-2">
          <CardHeader>
            <CardTitle className="text-lg">Call Handling Metrics</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4" style={{ marginTop: '-25px' }}>
              <Card className="py-2">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-muted-foreground">Average Waiting Time</p>
                      <p className="text-8xl font-black">{callHandlingMetrics.averageHandleTime}</p>
                      <p className="text-lg text-muted-foreground">per call</p>
                    </div>
                    <Clock className="h-[50px] w-[50px] text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card className="py-2">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-muted-foreground">Average Talk Time</p>
                      <p className="text-8xl font-black">{callHandlingMetrics.averageTalkTime}</p>
                      <p className="text-lg text-muted-foreground">per call</p>
                    </div>
                    <Phone className="h-[50px] w-[50px] text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card className="py-2">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-muted-foreground">Met Service Level</p>
                      <p className="text-8xl font-black">{callHandlingMetrics.metServiceLevel}</p>
                      <p className="text-lg text-muted-foreground">calls answered within SLA</p>
                    </div>
                    <CheckCircle className="h-[50px] w-[50px] text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card className="py-2">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-muted-foreground">Service Level</p>
                      <p className="text-8xl font-black">{callHandlingMetrics.serviceLevel}</p>
                      <p className="text-lg text-muted-foreground">target achieved</p>
                    </div>
                    <CheckCircle className="h-[50px] w-[50px] text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

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
                  refreshData()
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

    </DashboardLayoutSimple>
  )
}