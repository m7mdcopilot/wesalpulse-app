"use client"

import { format } from 'date-fns'
import { 
  Phone, 
  MessageSquare, 
  Mail, 
  Users, 
  CheckCheck
} from 'lucide-react'
import { timeRangeOptions, mediaTypeOptions } from './constants'
import { QueueOption } from './types'

// Helper functions extracted exactly from page.tsx

export const getMediaTypeIcon = (mediaType: string) => {
  switch (mediaType) {
    case 'voice': return <Phone className="h-4 w-4" />
    case 'chat': return <MessageSquare className="h-4 w-4" />
    case 'email': return <Mail className="h-4 w-4" />
    case 'callback': return <Phone className="h-4 w-4" />
    case 'all': return <CheckCheck className="h-4 w-4" />
    default: return <Users className="h-4 w-4" />
  }
}

export const getMediaTypeColor = (mediaType: string) => {
  switch (mediaType) {
    case 'voice': return 'bg-blue-100 text-blue-800'
    case 'chat': return 'bg-green-100 text-green-800'
    case 'email': return 'bg-purple-100 text-purple-800'
    case 'callback': return 'bg-orange-100 text-orange-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export const getServiceLevelColor = (serviceLevel: number) => {
  if (serviceLevel >= 80) return 'text-green-600'
  if (serviceLevel >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`
}

export const formatPercentage = (value: number) => {
  return `${value.toFixed(1)}%`
}

// These functions need to be passed the required state variables
export const createHandleMediaTypeToggle = (setSelectedMediaTypes: (types: string[]) => void) => {
  return (mediaType: string) => {
    setSelectedMediaTypes(prev => {
      if (mediaType === 'all') {
        return ['all']
      } else if (prev.includes('all')) {
        return [mediaType]
      } else if (prev.includes(mediaType)) {
        const newSelection = prev.filter(type => type !== mediaType)
        return newSelection.length === 0 ? ['all'] : newSelection
      } else {
        return [...prev, mediaType]
      }
    })
  }
}

export const createHandleQueueToggle = (setSelectedQueues: (queues: string[]) => void) => {
  return (queueId: string) => {
    setSelectedQueues(prev => {
      if (queueId === 'all') {
        return ['all']
      } else if (prev.includes('all')) {
        return [queueId]
      } else if (prev.includes(queueId)) {
        const newSelection = prev.filter(id => id !== queueId)
        return newSelection.length === 0 ? ['all'] : newSelection
      } else {
        return [...prev, queueId]
      }
    })
  }
}

export const createGetFilteredQueues = (availableQueues: QueueOption[], queueSearchTerm: string) => {
  return () => {
    if (!queueSearchTerm) return availableQueues
    return availableQueues.filter(queue => 
      queue.name.toLowerCase().includes(queueSearchTerm.toLowerCase())
    )
  }
}

export const createGetSelectedMediaTypesLabel = (selectedMediaTypes: string[]) => {
  return () => {
    if (selectedMediaTypes.includes('all') || selectedMediaTypes.length === 0) {
      return 'All Media'
    } else if (selectedMediaTypes.length === 1) {
      return mediaTypeOptions.find(m => m.value === selectedMediaTypes[0])?.label || selectedMediaTypes[0]
    } else {
      return `${selectedMediaTypes.length} Types Selected`
    }
  }
}

export const createGetSelectedQueuesLabel = (selectedQueues: string[], availableQueues: QueueOption[]) => {
  return () => {
    if (selectedQueues.includes('all') || selectedQueues.length === 0) {
      return 'All Queues'
    } else if (selectedQueues.length === 1) {
      const queue = availableQueues.find(q => q.id === selectedQueues[0])
      return queue?.name || selectedQueues[0]
    } else {
      return `${selectedQueues.length} Queues Selected`
    }
  }
}

export const createGetSelectedTimeRangeLabel = (selectedTimeRange: string, customDateRange: any) => {
  return () => {
    if (selectedTimeRange === 'custom') {
      if (customDateRange.startDate && customDateRange.endDate) {
        const formatDateTime = (date: Date, time: string) => {
          const [hours, minutes] = time.split(':').map(Number)
          const period = hours >= 12 ? 'PM' : 'AM'
          const displayHours = hours % 12 || 12
          return `${format(date, 'MMM dd, yyyy')} ${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
        }
        
        const startText = formatDateTime(customDateRange.startDate, customDateRange.startTime)
        const endText = formatDateTime(customDateRange.endDate, customDateRange.endTime)
        return `${startText} - ${endText}`
      }
      return 'Custom Range'
    }
    return timeRangeOptions.find(t => t.value === selectedTimeRange)?.label || selectedTimeRange
  }
}