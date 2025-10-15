"use client"

import { useState, useCallback, useEffect, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarWithDropdowns } from '@/components/ui/calendar-with-dropdowns'
import { TimePicker } from '@/components/ui/time-picker'
import { Calendar as CalendarIcon, Clock, RotateCcw, AlertTriangle } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

// Simple debounce function implementation
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout
  return ((...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }) as T
}

interface DateRangeDialogProps {
  showDateRangeDialog: boolean
  customDateRange: {
    startDate: Date | undefined
    endDate: Date | undefined
    startTime: string
    endTime: string
  }
  dateRangeError: string | null
  selectedTimeRange: string
  onDateRangeDialogChange: (open: boolean) => void
  onCustomDateRangeChange: (range: {
    startDate: Date | undefined
    endDate: Date | undefined
    startTime: string
    endTime: string
  }) => void
  onSelectedTimeRangeChange: (range: string) => void
  onDateRangeErrorChange: (error: string | null) => void
  onApplyDateRange: () => void
  formatTime: (time: string) => string
  onFetchDashboardData?: () => void
  isLoading?: boolean
  timezone?: string
  maxRangeDays?: number
  allowFutureDates?: boolean
}

export function DateRangeDialog({
  showDateRangeDialog,
  customDateRange,
  dateRangeError,
  selectedTimeRange,
  onDateRangeDialogChange,
  onCustomDateRangeChange,
  onSelectedTimeRangeChange,
  onDateRangeErrorChange,
  onApplyDateRange,
  formatTime,
  onFetchDashboardData,
  isLoading = false,
  timezone = 'UTC',
  maxRangeDays = 365,
  allowFutureDates = false
}: DateRangeDialogProps) {
  const [localCustomDateRange, setLocalCustomDateRange] = useState(customDateRange)
  const [localDateRangeError, setLocalDateRangeError] = useState(dateRangeError)
  const [isApplying, setIsApplying] = useState(false)

  // Enhanced validation function
  const validateDateRange = useCallback((range: typeof customDateRange) => {
    const errors: string[] = []
    
    if (!range.startDate || !range.endDate) {
      errors.push('Please select both start and end dates')
      return errors
    }
    
    // Validate time format
    const [startHour, startMinute] = range.startTime.split(':').map(Number)
    const [endHour, endMinute] = range.endTime.split(':').map(Number)
    
    if (isNaN(startHour) || isNaN(startMinute) || isNaN(endHour) || isNaN(endMinute)) {
      errors.push('Invalid time format')
      return errors
    }
    
    // Validate time ranges
    if (startHour < 0 || startHour > 23 || startMinute < 0 || startMinute > 59) {
      errors.push('Start time must be between 00:00 and 23:59')
    }
    
    if (endHour < 0 || endHour > 23 || endMinute < 0 || endMinute > 59) {
      errors.push('End time must be between 00:00 and 23:59')
    }
    
    // Set times for comparison
    const startDateTime = new Date(range.startDate)
    const endDateTime = new Date(range.endDate)
    startDateTime.setHours(startHour, startMinute, 0, 0)
    endDateTime.setHours(endHour, endMinute, 59, 999)
    
    // Validate date range
    if (startDateTime >= endDateTime) {
      errors.push('Start date/time must be before end date/time')
    }
    
    // Validate range duration
    const maxRangeMs = maxRangeDays * 24 * 60 * 60 * 1000
    if (endDateTime - startDateTime > maxRangeMs) {
      errors.push(`Date range cannot exceed ${maxRangeDays} days`)
    }
    
    // Validate future dates
    if (!allowFutureDates) {
      const now = new Date()
      if (startDateTime > now || endDateTime > now) {
        errors.push('Dates cannot be in the future')
      }
    }
    
    // Validate minimum range (at least 1 minute)
    if (endDateTime - startDateTime < 60 * 1000) {
      errors.push('Date range must be at least 1 minute')
    }
    
    return errors
  }, [maxRangeDays, allowFutureDates])

  // Real-time validation feedback
  const getValidationWarnings = useCallback((range: typeof customDateRange) => {
    const warnings: string[] = []
    
    if (!range.startDate || !range.endDate) {
      return warnings
    }
    
    const startDateTime = new Date(range.startDate)
    const endDateTime = new Date(range.endDate)
    const [startHour, startMinute] = range.startTime.split(':').map(Number)
    const [endHour, endMinute] = range.endTime.split(':').map(Number)
    
    if (!isNaN(startHour) && !isNaN(startMinute) && !isNaN(endHour) && !isNaN(endMinute)) {
      startDateTime.setHours(startHour, startMinute, 0, 0)
      endDateTime.setHours(endHour, endMinute, 59, 999)
      
      const durationMs = endDateTime - startDateTime
      const durationHours = durationMs / (1000 * 60 * 60)
      
      // Warning for very large ranges
      if (durationHours > 24 * 30) { // More than 30 days
        warnings.push('Large date ranges may affect performance')
      }
      
      // Warning for ranges in the past if future dates are allowed
      if (allowFutureDates) {
        const now = new Date()
        if (endDateTime < now) {
          warnings.push('Selected range is in the past')
        }
      }
    }
    
    return warnings
  }, [allowFutureDates])

  // Memoized validation results to prevent unnecessary recalculations
  const validationErrors = useMemo(() => validateDateRange(localCustomDateRange), [localCustomDateRange, validateDateRange])
  const validationWarnings = useMemo(() => getValidationWarnings(localCustomDateRange), [localCustomDateRange, getValidationWarnings])

  // Debounced validation to improve performance
  const debouncedValidation = useMemo(
    () => debounce((range: typeof customDateRange) => {
      const errors = validateDateRange(range)
      if (errors.length > 0) {
        setLocalDateRangeError(errors.join('; '))
      } else {
        setLocalDateRangeError(null)
      }
    }, 300),
    [validateDateRange]
  )

  // Reset to default date range (last 24 hours)
  const resetToDefault = useCallback(() => {
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    
    const defaultRange = {
      startDate: yesterday,
      endDate: now,
      startTime: '00:00',
      endTime: '23:59'
    }
    
    setLocalCustomDateRange(defaultRange)
    onCustomDateRangeChange(defaultRange)
    setLocalDateRangeError(null)
    onDateRangeErrorChange(null)
    
    toast.success('Reset to default date range')
  }, [onCustomDateRangeChange, onDateRangeErrorChange])

  const setCustomDateRange = useCallback((range: Partial<typeof customDateRange>) => {
    const newRange = { ...localCustomDateRange, ...range }
    setLocalCustomDateRange(newRange)
    onCustomDateRangeChange(newRange)
    
    // Trigger debounced validation
    debouncedValidation(newRange)
  }, [localCustomDateRange, onCustomDateRangeChange, debouncedValidation])

  const applyCustomDateRange = useCallback(async () => {
    const errors = validateDateRange(localCustomDateRange)
    
    if (errors.length > 0) {
      const errorMessage = errors.join('; ')
      setLocalDateRangeError(errorMessage)
      onDateRangeErrorChange(errorMessage)
      return
    }
    
    // Clear any existing errors
    setLocalDateRangeError(null)
    onDateRangeErrorChange(null)
    
    // Set loading state
    setIsApplying(true)
    
    try {
      // Close dialog and apply changes
      onDateRangeDialogChange(false)
      onSelectedTimeRangeChange('custom')
      onApplyDateRange()
      
      // Trigger data fetch if provided
      if (onFetchDashboardData) {
        await onFetchDashboardData()
      }
      
      toast.success('Custom date range applied successfully')
    } catch (error) {
      toast.error('Failed to apply date range')
      console.error('Date range application error:', error)
    } finally {
      setIsApplying(false)
    }
  }, [localCustomDateRange, validateDateRange, onDateRangeDialogChange, onSelectedTimeRangeChange, onDateRangeErrorChange, onApplyDateRange, onFetchDashboardData])

  const applyQuickRange = useCallback(async (rangeType: string) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    let startDate: Date
    let endDate: Date

    switch (rangeType) {
      case 'today':
        startDate = new Date(today)
        endDate = new Date(today)
        break
      case 'yesterday':
        startDate = new Date(today)
        startDate.setDate(startDate.getDate() - 1)
        endDate = new Date(startDate)
        break
      case 'this_week':
        const dayOfWeek = today.getDay()
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - dayOfWeek)
        startDate = new Date(startOfWeek)
        endDate = new Date(today)
        break
      case 'last_week':
        const lastWeekDay = today.getDay()
        const startOfLastWeek = new Date(today)
        startOfLastWeek.setDate(today.getDate() - lastWeekDay - 7)
        const endOfLastWeek = new Date(startOfLastWeek)
        endOfLastWeek.setDate(startOfLastWeek.getDate() + 6)
        startDate = new Date(startOfLastWeek)
        endDate = new Date(endOfLastWeek)
        break
      case 'this_month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1)
        endDate = new Date(today)
        break
      case 'last_month':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        endDate = new Date(today.getFullYear(), today.getMonth(), 0)
        break
      case 'last_7_days':
        startDate = new Date(today)
        startDate.setDate(startDate.getDate() - 7)
        endDate = new Date(today)
        break
      case 'last_30_days':
        startDate = new Date(today)
        startDate.setDate(startDate.getDate() - 30)
        endDate = new Date(today)
        break
      default:
        return
    }

    // Set the custom date range
    const newRange = {
      startDate,
      endDate,
      startTime: '00:00',
      endTime: '23:59'
    }
    
    setLocalCustomDateRange(newRange)
    onCustomDateRangeChange(newRange)
    
    // Set loading state
    setIsApplying(true)
    
    try {
      // Close dialog and apply changes
      onDateRangeDialogChange(false)
      onSelectedTimeRangeChange(rangeType)
      onApplyDateRange()
      
      // Trigger data fetch if provided
      if (onFetchDashboardData) {
        await onFetchDashboardData()
      }
      
      toast.success(`${rangeType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} range applied successfully`)
    } catch (error) {
      toast.error('Failed to apply date range')
      console.error('Quick range application error:', error)
    } finally {
      setIsApplying(false)
    }
  }, [onDateRangeDialogChange, onSelectedTimeRangeChange, onCustomDateRangeChange, onApplyDateRange, onFetchDashboardData])

  // Sync local state with props when they change
  useEffect(() => {
    setLocalCustomDateRange(customDateRange)
    setLocalDateRangeError(dateRangeError)
  }, [customDateRange, dateRangeError])

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!showDateRangeDialog) return
      
      switch (event.key) {
        case 'Escape':
          event.preventDefault()
          onDateRangeDialogChange(false)
          onDateRangeErrorChange(null)
          setLocalDateRangeError(null)
          break
        case 'Enter':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            applyCustomDateRange()
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showDateRangeDialog, onDateRangeDialogChange, onDateRangeErrorChange, applyCustomDateRange])

  return (
    <Dialog open={showDateRangeDialog} onOpenChange={onDateRangeDialogChange}>
      <DialogContent 
        className="max-w-2xl" 
        aria-modal="true"
        role="dialog"
        aria-labelledby="date-range-dialog-title"
        aria-describedby="date-range-dialog-description"
      >
      <DialogHeader>
        <DialogTitle 
          id="date-range-dialog-title"
          className="flex items-center gap-2"
        >
          <CalendarIcon className="h-5 w-5" aria-hidden="true" />
          Select Date Range
        </DialogTitle>
        <div 
          id="date-range-dialog-description" 
          className="text-sm text-muted-foreground"
        >
          Timezone: {timezone}
        </div>
      </DialogHeader>
      <div className="space-y-6" role="group" aria-label="Date range selection options">
        {/* Quick Range Presets */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Quick Presets</Label>
          <div className="grid grid-cols-4 gap-2" role="group" aria-label="Quick date range presets">
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyQuickRange('today')}
              className="text-xs h-8"
              disabled={isApplying}
              aria-label="Select today as date range"
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyQuickRange('yesterday')}
              className="text-xs h-8"
              disabled={isApplying}
              aria-label="Select yesterday as date range"
            >
              Yesterday
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyQuickRange('this_week')}
              className="text-xs h-8"
              disabled={isApplying}
              aria-label="Select this week as date range"
            >
              This Week
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyQuickRange('last_week')}
              className="text-xs h-8"
              disabled={isApplying}
              aria-label="Select last week as date range"
            >
              Last Week
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyQuickRange('this_month')}
              className="text-xs h-8"
              disabled={isApplying}
              aria-label="Select this month as date range"
            >
              This Month
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyQuickRange('last_month')}
              className="text-xs h-8"
              disabled={isApplying}
              aria-label="Select last month as date range"
            >
              Last Month
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyQuickRange('last_7_days')}
              className="text-xs h-8"
              disabled={isApplying}
              aria-label="Select last 7 days as date range"
            >
              Last 7 Days
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyQuickRange('last_30_days')}
              className="text-xs h-8"
              disabled={isApplying}
              aria-label="Select last 30 days as date range"
            >
              Last 30 Days
            </Button>
          </div>
        </div>

        {/* Custom Date Selection */}
        <div className="space-y-4" role="group" aria-label="Custom date range selection">
          <Label className="text-sm font-medium">Custom Range</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dialog-start-date" className="text-sm">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    aria-label="Select start date"
                    aria-expanded={false}
                    aria-haspopup="dialog"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                    {localCustomDateRange.startDate ? (
                      <span className="text-sm">
                        {format(localCustomDateRange.startDate, "EEE, MMM dd, yyyy")}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">Pick start date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarWithDropdowns
                    mode="single"
                    selected={localCustomDateRange.startDate}
                    onSelect={(date) =>
                      setCustomDateRange({ startDate: date })
                    }
                    initialFocus
                    disabled={(date) => 
                      (!allowFutureDates && date > new Date()) || 
                      (localCustomDateRange.endDate ? date > localCustomDateRange.endDate : false)
                    }
                    modifiers={{
                      available: (date) => 
                        (!allowFutureDates && date > new Date()) || 
                        !localCustomDateRange.endDate || date <= localCustomDateRange.endDate
                    }}
                    modifiersStyles={{
                      available: { backgroundColor: '#f0f9ff', color: '#0369a1' }
                    }}
                    maxDate={localCustomDateRange.endDate}
                    aria-label="Start date calendar"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dialog-end-date" className="text-sm">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    aria-label="Select end date"
                    aria-expanded={false}
                    aria-haspopup="dialog"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                    {localCustomDateRange.endDate ? (
                      <span className="text-sm">
                        {format(localCustomDateRange.endDate, "EEE, MMM dd, yyyy")}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">Pick end date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarWithDropdowns
                    mode="single"
                    selected={localCustomDateRange.endDate}
                    onSelect={(date) =>
                      setCustomDateRange({ endDate: date })
                    }
                    initialFocus
                    disabled={(date) => 
                      (!allowFutureDates && date > new Date()) || 
                      (localCustomDateRange.startDate ? date < localCustomDateRange.startDate : false)
                    }
                    modifiers={{
                      available: (date) => 
                        (!allowFutureDates && date > new Date()) || 
                        !localCustomDateRange.startDate || date >= localCustomDateRange.startDate
                    }}
                    modifiersStyles={{
                      available: { backgroundColor: '#f0f9ff', color: '#0369a1' }
                    }}
                    minDate={localCustomDateRange.startDate}
                    aria-label="End date calendar"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dialog-start-time" className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" aria-hidden="true" />
                Start Time
              </Label>
              <TimePicker
                value={localCustomDateRange.startTime}
                onChange={(newTime) =>
                  setCustomDateRange({ startTime: newTime })
                }
                aria-label="Select start time"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dialog-end-time" className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" aria-hidden="true" />
                End Time
              </Label>
              <TimePicker
                value={localCustomDateRange.endTime}
                onChange={(newTime) =>
                  setCustomDateRange({ endTime: newTime })
                }
                aria-label="Select end time"
              />
            </div>
          </div>
        </div>

        {/* Selected Range Summary */}
        <div className="bg-muted/30 rounded-lg p-4 border" role="region" aria-label="Selected date range summary">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span className="text-sm font-medium">Selected Range</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Start:</span>
                <span className="font-medium">
                  {localCustomDateRange.startDate 
                    ? `${format(localCustomDateRange.startDate, 'EEE, MMM dd, yyyy')} at ${formatTime(localCustomDateRange.startTime)}`
                    : 'Not selected'
                  }
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">End:</span>
                <span className="font-medium">
                  {localCustomDateRange.endDate 
                    ? `${format(localCustomDateRange.endDate, 'EEE, MMM dd, yyyy')} at ${formatTime(localCustomDateRange.endTime)}`
                    : 'Not selected'
                  }
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-xs text-muted-foreground">Duration:</span>
              <Badge variant="secondary" className="text-xs">
                {localCustomDateRange.startDate && localCustomDateRange.endDate ? (() => {
                  const startDateTime = new Date(localCustomDateRange.startDate)
                  const endDateTime = new Date(localCustomDateRange.endDate)
                  const [startHour, startMinute] = localCustomDateRange.startTime.split(':').map(Number)
                  const [endHour, endMinute] = localCustomDateRange.endTime.split(':').map(Number)
                  
                  startDateTime.setHours(startHour, startMinute, 0, 0)
                  endDateTime.setHours(endHour, endMinute, 59, 999)
                  
                  const durationMs = endDateTime - startDateTime
                  const durationDays = Math.floor(durationMs / (1000 * 60 * 60 * 24))
                  const durationHours = Math.floor((durationMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
                  const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
                  
                  if (durationDays > 0) {
                    return `${durationDays} day${durationDays !== 1 ? 's' : ''}${durationHours > 0 ? `, ${durationHours} hr${durationHours !== 1 ? 's' : ''}` : ''}${durationMinutes > 0 ? `, ${durationMinutes} min${durationMinutes !== 1 ? 's' : ''}` : ''}`
                  } else if (durationHours > 0) {
                    return `${durationHours} hr${durationHours !== 1 ? 's' : ''}${durationMinutes > 0 ? `, ${durationMinutes} min${durationMinutes !== 1 ? 's' : ''}` : ''}`
                  } else {
                    return `${durationMinutes} min${durationMinutes !== 1 ? 's' : ''}`
                  }
                })() : 'Select dates to calculate'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {localDateRangeError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3" role="alert" aria-live="assertive">
            <div className="flex items-start gap-2 text-red-800">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div>
                <span className="text-sm font-medium">Error:</span>
                <span className="text-sm ml-1">{localDateRangeError}</span>
              </div>
            </div>
          </div>
        )}

        {/* Warning Messages */}
        {validationWarnings.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3" role="alert" aria-live="polite">
            <div className="flex items-start gap-2 text-yellow-800">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div>
                <span className="text-sm font-medium">Warning:</span>
                <ul className="text-sm ml-1 list-disc list-inside">
                  {validationWarnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t" role="group" aria-label="Dialog actions">
          <Button 
            onClick={resetToDefault}
            variant="outline"
            className="flex items-center gap-2"
            disabled={isApplying}
            aria-label="Reset to default date range"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset
          </Button>
          <div className="flex gap-2 flex-1">
            <Button 
              onClick={applyCustomDateRange}
              disabled={!localCustomDateRange.startDate || !localCustomDateRange.endDate || isApplying}
              className="flex-1 flex items-center gap-2"
              variant="default"
              aria-label="Apply selected date range"
            >
              {isApplying ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" aria-hidden="true" />
                  Applying...
                </>
              ) : (
                <>
                  <CalendarIcon className="h-4 w-4" aria-hidden="true" />
                  Apply Range
                </>
              )}
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                onDateRangeDialogChange(false)
                onDateRangeErrorChange(null)
                setLocalDateRangeError(null)
              }}
              disabled={isApplying}
              className="flex-1"
              aria-label="Cancel date range selection"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
    </Dialog>
  )
}