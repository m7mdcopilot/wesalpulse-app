"use client"

import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon, Edit } from 'lucide-react'

interface DateRangeDisplayProps {
  selectedTimeRange: string
  customDateRange: {
    startDate: Date | undefined
    endDate: Date | undefined
    startTime: string
    endTime: string
  }
  onEdit?: () => void
}

export function DateRangeDisplay({ selectedTimeRange, customDateRange, onEdit }: DateRangeDisplayProps) {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    return `${hours}:${minutes}`
  }

  const getDurationDisplay = () => {
    if (selectedTimeRange === 'custom' && customDateRange.startDate && customDateRange.endDate) {
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
    }
    
    // For preset ranges, return a simple display
    switch (selectedTimeRange) {
      case 'last_hour':
        return '1 hour'
      case 'last_24_hours':
        return '24 hours'
      case 'today':
        return 'Today'
      case 'yesterday':
        return 'Yesterday'
      case 'this_week':
        return 'This week'
      case 'last_week':
        return 'Last week'
      case 'this_month':
        return 'This month'
      case 'last_month':
        return 'Last month'
      case 'last_7_days':
        return '7 days'
      case 'last_30_days':
        return '30 days'
      default:
        return 'Select range'
    }
  }

  const getStartDisplay = () => {
    if (selectedTimeRange === 'custom' && customDateRange.startDate) {
      return `${format(customDateRange.startDate, 'MMM dd, yyyy')} at ${formatTime(customDateRange.startTime)}`
    }
    
    // Calculate actual start time for preset ranges
    const now = new Date()
    switch (selectedTimeRange) {
      case 'last_hour':
        return `${format(new Date(now.getTime() - 60 * 60 * 1000), 'MMM dd, yyyy HH:mm')}`
      case 'last_24_hours':
        return `${format(new Date(now.getTime() - 24 * 60 * 60 * 1000), 'MMM dd, yyyy HH:mm')}`
      case 'today':
        return `${format(new Date(now.setHours(0, 0, 0, 0)), 'MMM dd, yyyy')} at 00:00`
      case 'yesterday':
        const yesterday = new Date(now)
        yesterday.setDate(yesterday.getDate() - 1)
        return `${format(yesterday, 'MMM dd, yyyy')} at 00:00`
      case 'this_week':
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay())
        startOfWeek.setHours(0, 0, 0, 0)
        return `${format(startOfWeek, 'MMM dd, yyyy')} at 00:00`
      case 'last_week':
        const startOfLastWeek = new Date(now)
        startOfLastWeek.setDate(now.getDate() - now.getDay() - 7)
        startOfLastWeek.setHours(0, 0, 0, 0)
        return `${format(startOfLastWeek, 'MMM dd, yyyy')} at 00:00`
      case 'this_month':
        return `${format(new Date(now.getFullYear(), now.getMonth(), 1), 'MMM dd, yyyy')} at 00:00`
      case 'last_month':
        return `${format(new Date(now.getFullYear(), now.getMonth() - 1, 1), 'MMM dd, yyyy')} at 00:00`
      case 'last_7_days':
        return `${format(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), 'MMM dd, yyyy')} at 00:00`
      case 'last_30_days':
        return `${format(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), 'MMM dd, yyyy')} at 00:00`
      default:
        return 'Not selected'
    }
  }

  const getEndDisplay = () => {
    if (selectedTimeRange === 'custom' && customDateRange.endDate) {
      return `${format(customDateRange.endDate, 'MMM dd, yyyy')} at ${formatTime(customDateRange.endTime)}`
    }
    
    // Calculate actual end time for preset ranges
    const now = new Date()
    switch (selectedTimeRange) {
      case 'last_hour':
        return `${format(now, 'MMM dd, yyyy HH:mm')}`
      case 'last_24_hours':
        return `${format(now, 'MMM dd, yyyy HH:mm')}`
      case 'today':
        return `${format(now, 'MMM dd, yyyy')} at 23:59`
      case 'yesterday':
        const yesterday = new Date(now)
        yesterday.setDate(yesterday.getDate() - 1)
        return `${format(yesterday, 'MMM dd, yyyy')} at 23:59`
      case 'this_week':
        return `${format(now, 'MMM dd, yyyy')} at 23:59`
      case 'last_week':
        const endOfLastWeek = new Date(now)
        endOfLastWeek.setDate(now.getDate() - now.getDay() - 1)
        endOfLastWeek.setHours(23, 59, 59, 999)
        return `${format(endOfLastWeek, 'MMM dd, yyyy')} at 23:59`
      case 'this_month':
        return `${format(new Date(now.getFullYear(), now.getMonth() + 1, 0), 'MMM dd, yyyy')} at 23:59`
      case 'last_month':
        return `${format(new Date(now.getFullYear(), now.getMonth(), 0), 'MMM dd, yyyy')} at 23:59`
      case 'last_7_days':
        return `${format(now, 'MMM dd, yyyy')} at 23:59`
      case 'last_30_days':
        return `${format(now, 'MMM dd, yyyy')} at 23:59`
      default:
        return 'Not selected'
    }
  }

  // Always show for debugging, but we'll make it conditional later
  const shouldShow = selectedTimeRange === 'custom'

  if (!shouldShow) {
    return null
  }

  return (
    <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
      <div className="flex items-center gap-4">
        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-bold">Start:</span>
            <span className="font-medium">{getStartDisplay()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-bold">End:</span>
            <span className="font-medium">{getEndDisplay()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-bold">Duration:</span>
            <Badge variant="secondary" className="text-xs">
              {getDurationDisplay()}
            </Badge>
          </div>
        </div>
      </div>
      {onEdit && (
        <Button variant="outline" size="sm" onClick={onEdit} className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Edit Range
        </Button>
      )}
    </div>
  )
}