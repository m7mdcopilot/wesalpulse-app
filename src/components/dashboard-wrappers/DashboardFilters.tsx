"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Calendar as CalendarIcon, Filter, Users, MessageSquare, RefreshCw, X, CheckCheck, Circle, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'

interface DashboardFiltersProps {
  showFilters: boolean
  selectedTimeRange: string
  selectedMediaTypes: string[]
  selectedQueues: string[]
  queueSearchTerm: string
  customDateRange: {
    startDate: Date | undefined
    endDate: Date | undefined
    startTime: string
    endTime: string
  }
  showDateRangeDialog: boolean
  loading: boolean
  availableQueues: Array<{
    id: string
    name: string
    mediaTypes: string[]
  }>
  timeRangeOptions: Array<{
    value: string
    label: string
  }>
  mediaTypeOptions: Array<{
    value: string
    label: string
  }>
  onCloseFilters: () => void
  onTimeRangeChange: (value: string) => void
  onMediaTypeToggle: (value: string) => void
  onQueueToggle: (value: string) => void
  onQueueSearchChange: (value: string) => void
  onDateRangeDialogChange: (open: boolean) => void
  onFetchDashboardData: () => void
  onResetFilters: () => void
  getFilteredQueues: () => Array<{
    id: string
    name: string
    mediaTypes: string[]
  }>
  getMediaTypeIcon: (mediaType: string) => React.ReactNode
  formatTime: (time: string) => string
  dateRangeDialogContent: React.ReactNode
}

export function DashboardFilters({
  showFilters,
  selectedTimeRange,
  selectedMediaTypes,
  selectedQueues,
  queueSearchTerm,
  customDateRange,
  showDateRangeDialog,
  loading,
  availableQueues,
  timeRangeOptions,
  mediaTypeOptions,
  onCloseFilters,
  onTimeRangeChange,
  onMediaTypeToggle,
  onQueueToggle,
  onQueueSearchChange,
  onDateRangeDialogChange,
  onFetchDashboardData,
  onResetFilters,
  getFilteredQueues,
  getMediaTypeIcon,
  formatTime,
  dateRangeDialogContent
}: DashboardFiltersProps) {
  return (
    <>
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
              onClick={onCloseFilters}
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
                    onDateRangeDialogChange(true)
                  }
                  onTimeRangeChange(value)
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
                    onDateRangeDialogChange(true)
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
                      onDateRangeDialogChange(true)
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
                      onChange={(e) => onQueueSearchChange(e.target.value)}
                      className="pr-8"
                    />
                    {queueSearchTerm && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-6 w-6 p-0 cursor-pointer"
                        onClick={() => onQueueSearchChange('')}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  
                  {/* All Queues Option */}
                  <Button
                    variant={selectedQueues.includes('all') ? "default" : "outline"}
                    size="sm"
                    onClick={() => onQueueToggle('all')}
                    className="w-full justify-start cursor-pointer"
                  >
                    <CheckCheck className="h-4 w-4 mr-2" />
                    All Queues
                  </Button>
                  
                  {/* Queue List */}
                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {getFilteredQueues().map(queue => (
                      <Button
                        key={queue.id}
                        variant={selectedQueues.includes(queue.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => onQueueToggle(queue.id)}
                        className="w-full justify-start cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          {selectedQueues.includes(queue.id) ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Circle className="h-4 w-4" />
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
                      onClick={() => onMediaTypeToggle(option.value)}
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
                onClick={onFetchDashboardData}
                disabled={loading}
                className="w-full cursor-pointer"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Apply Filters
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onResetFilters}
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
          onClick={onCloseFilters}
        />
      )}

      {/* Date Range Dialog */}
      <Dialog open={showDateRangeDialog} onOpenChange={onDateRangeDialogChange}>
        {dateRangeDialogContent}
      </Dialog>
    </>
  )
}