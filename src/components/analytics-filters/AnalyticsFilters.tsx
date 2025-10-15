"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Calendar as CalendarIcon, Filter, RefreshCw, X, CheckCheck, Circle, CheckCircle, Users, MessageSquare, User, Building } from 'lucide-react'
import { format } from 'date-fns'

interface AnalyticsFiltersProps {
  showFilters: boolean
  selectedTimeRange: string
  filterOptions: {
    timeRangeOptions: Array<{
      value: string
      label: string
    }>
    primaryFilterOptions: Array<{
      value: string
      label: string
    }>
    secondaryFilterOptions?: Array<{
      value: string
      label: string
    }>
  }
  selectedPrimaryFilters: string[]
  selectedSecondaryFilters?: string[]
  customDateRange?: {
    startDate: Date | undefined
    endDate: Date | undefined
    startTime: string
    endTime: string
  }
  showDateRangeDialog?: boolean
  loading: boolean
  filterType: 'queues' | 'agents'
  onCloseFilters: () => void
  onTimeRangeChange: (value: string) => void
  onPrimaryFilterToggle: (value: string) => void
  onSecondaryFilterToggle?: (value: string) => void
  onDateRangeDialogChange?: (open: boolean) => void
  onFetchData: () => void
  onResetFilters: () => void
  getPrimaryFilterIcon?: (value: string) => React.ReactNode
  dateRangeDialogContent?: React.ReactNode
}

export function AnalyticsFilters({
  showFilters,
  selectedTimeRange,
  filterOptions,
  selectedPrimaryFilters,
  selectedSecondaryFilters,
  customDateRange,
  showDateRangeDialog,
  loading,
  filterType,
  onCloseFilters,
  onTimeRangeChange,
  onPrimaryFilterToggle,
  onSecondaryFilterToggle,
  onDateRangeDialogChange,
  onFetchData,
  onResetFilters,
  getPrimaryFilterIcon,
  dateRangeDialogContent
}: AnalyticsFiltersProps) {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    return `${hours}:${minutes}`
  }

  const getPrimaryFilterTitle = () => {
    return filterType === 'queues' ? 'Media Type' : 'Status'
  }

  const getSecondaryFilterTitle = () => {
    return filterType === 'queues' ? 'Queues' : 'Departments'
  }

  const getInternalPrimaryFilterIcon = (value: string) => {
    if (filterType === 'queues') {
      switch (value) {
        case 'voice': return <Filter className="h-4 w-4" />
        case 'chat': return <MessageSquare className="h-4 w-4" />
        case 'email': return <MessageSquare className="h-4 w-4" />
        case 'callback': return <Filter className="h-4 w-4" />
        default: return <Filter className="h-4 w-4" />
      }
    } else {
      return <User className="h-4 w-4" />
    }
  }

  const getSecondaryFilterIcon = () => {
    return filterType === 'queues' ? <Users className="h-5 w-5" /> : <Building className="h-5 w-5" />
  }

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
                  if (value === 'custom' && onDateRangeDialogChange) {
                    onDateRangeDialogChange(true)
                  }
                  onTimeRangeChange(value)
                }}>
                  <SelectTrigger>
                    <SelectValue>
                      {selectedTimeRange === 'custom' && customDateRange?.startDate && customDateRange?.endDate 
                        ? `${format(customDateRange.startDate, 'MMM dd, yyyy')} - ${format(customDateRange.endDate, 'MMM dd, yyyy')}`
                        : filterOptions.timeRangeOptions.find(opt => opt.value === selectedTimeRange)?.label || 'Select range'
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.timeRangeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Range Details */}
              {customDateRange && (
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
                  
                  {onDateRangeDialogChange && (
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
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getInternalPrimaryFilterIcon('')}
                {getPrimaryFilterTitle()}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select {getPrimaryFilterTitle()}</label>
                <div className="grid grid-cols-2 gap-2">
                  {filterOptions.primaryFilterOptions.map(option => (
                    <Button
                      key={option.value}
                      variant={selectedPrimaryFilters.includes(option.value) ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPrimaryFilterToggle(option.value)}
                      className="justify-start cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        {getInternalPrimaryFilterIcon(option.value)}
                        {option.label}
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {filterOptions.secondaryFilterOptions && onSecondaryFilterToggle && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getSecondaryFilterIcon()}
                  {getSecondaryFilterTitle()}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select {getSecondaryFilterTitle()}</label>
                  <div className="space-y-3">
                    {/* All Option */}
                    <Button
                      variant={selectedSecondaryFilters?.includes('all') ? "default" : "outline"}
                      size="sm"
                      onClick={() => onSecondaryFilterToggle('all')}
                      className="w-full justify-start cursor-pointer"
                    >
                      <CheckCheck className="h-4 w-4 mr-2" />
                      All {getSecondaryFilterTitle()}
                    </Button>
                    
                    {/* Options List */}
                    <div className="max-h-60 overflow-y-auto space-y-1">
                      {filterOptions.secondaryFilterOptions.map(option => (
                        <Button
                          key={option.value}
                          variant={selectedSecondaryFilters?.includes(option.value) ? "default" : "outline"}
                          size="sm"
                          onClick={() => onSecondaryFilterToggle(option.value)}
                          className="w-full justify-start cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            {selectedSecondaryFilters?.includes(option.value) ? (
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
          )}

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onFetchData}
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
      {showDateRangeDialog && onDateRangeDialogChange && dateRangeDialogContent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4">
            {dateRangeDialogContent}
          </div>
        </div>
      )}
    </>
  )
}