"use client"

import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { CalendarWithDropdowns } from '@/components/ui/calendar-with-dropdowns'
import { TimePicker } from '@/components/ui/time-picker'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { 
  Phone, 
  MessageSquare, 
  Mail, 
  CheckCheck,
  Calendar as CalendarIcon,
  X
} from 'lucide-react'
import { timeRangeOptions, mediaTypeOptions } from './constants'
import { QueueOption } from './types'

interface DashboardFiltersProps {
  selectedTimeRange: string
  selectedMediaTypes: string[]
  selectedQueues: string[]
  availableQueues: QueueOption[]
  queueSearchTerm: string
  showFilters: boolean
  showDateRangeDialog: boolean
  customDateRange: any
  dateRangeError: string | null
  onTimeRangeChange: (value: string) => void
  onMediaTypeToggle: (mediaType: string) => void
  onQueueToggle: (queueId: string) => void
  onQueueSearchTermChange: (term: string) => void
  onShowDateRangeDialogChange: (show: boolean) => void
  onCustomDateRangeChange: (range: any) => void
  onDateRangeErrorChange: (error: string | null) => void
  applyCustomDateRange: () => void
  applyQuickRange: (rangeType: string) => void
  getMediaTypeIcon: (mediaType: string) => React.ReactNode
  getMediaTypeColor: (mediaType: string) => string
  getSelectedMediaTypesLabel: () => string
  getSelectedQueuesLabel: () => string
  getSelectedTimeRangeLabel: () => string
  getFilteredQueues: () => QueueOption[]
}

export function DashboardFilters({
  selectedTimeRange,
  selectedMediaTypes,
  selectedQueues,
  availableQueues,
  queueSearchTerm,
  showFilters,
  showDateRangeDialog,
  customDateRange,
  dateRangeError,
  onTimeRangeChange,
  onMediaTypeToggle,
  onQueueToggle,
  onQueueSearchTermChange,
  onShowDateRangeDialogChange,
  onCustomDateRangeChange,
  onDateRangeErrorChange,
  applyCustomDateRange,
  applyQuickRange,
  getMediaTypeIcon,
  getMediaTypeColor,
  getSelectedMediaTypesLabel,
  getSelectedQueuesLabel,
  getSelectedTimeRangeLabel,
  getFilteredQueues
}: DashboardFiltersProps) {
  if (!showFilters) return null

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <Select value={selectedTimeRange} onValueChange={onTimeRangeChange}>
          <SelectTrigger className="w-[200px]">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            {timeRangeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-start">
              {getMediaTypeIcon(selectedMediaTypes[0] || 'all')}
              <span className="ml-2">{getSelectedMediaTypesLabel()}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="space-y-2">
              {mediaTypeOptions.map((type) => (
                <div
                  key={type.value}
                  className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-accent"
                  onClick={() => onMediaTypeToggle(type.value)}
                >
                  {getMediaTypeIcon(type.value)}
                  <span className="text-sm">{type.label}</span>
                  {selectedMediaTypes.includes(type.value) && (
                    <Badge variant="secondary" className="ml-auto">
                      ✓
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-start">
              <CheckCheck className="mr-2 h-4 w-4" />
              <span className="ml-2">{getSelectedQueuesLabel()}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <Input
                placeholder="Search queues..."
                value={queueSearchTerm}
                onChange={(e) => onQueueSearchTermChange(e.target.value)}
                className="mb-2"
              />
              <div className="max-h-60 overflow-y-auto space-y-1">
                <div
                  className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-accent"
                  onClick={() => onQueueToggle('all')}
                >
                  <CheckCheck className="h-4 w-4" />
                  <span className="text-sm">All Queues</span>
                  {selectedQueues.includes('all') && (
                    <Badge variant="secondary" className="ml-auto">
                      ✓
                    </Badge>
                  )}
                </div>
                {getFilteredQueues().map((queue) => (
                  <div
                    key={queue.id}
                    className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-accent"
                    onClick={() => onQueueToggle(queue.id)}
                  >
                    {getMediaTypeIcon(queue.mediaTypes[0] || 'all')}
                    <span className="text-sm">{queue.name}</span>
                    {selectedQueues.includes(queue.id) && (
                      <Badge variant="secondary" className="ml-auto">
                        ✓
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {selectedTimeRange === 'custom' && (
          <Dialog open={showDateRangeDialog} onOpenChange={onShowDateRangeDialogChange}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Custom Range
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Custom Date Range</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {dateRangeError && (
                  <div className="text-red-600 text-sm">{dateRangeError}</div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <CalendarWithDropdowns
                      mode="single"
                      selected={customDateRange.startDate}
                      onSelect={(date) => 
                        onCustomDateRangeChange({ ...customDateRange, startDate: date })
                      }
                      disabled={(date) => date > new Date()}
                    />
                    <TimePicker
                      value={customDateRange.startTime}
                      onChange={(time) => 
                        onCustomDateRangeChange({ ...customDateRange, startTime: time })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <CalendarWithDropdowns
                      mode="single"
                      selected={customDateRange.endDate}
                      onSelect={(date) => 
                        onCustomDateRangeChange({ ...customDateRange, endDate: date })
                      }
                      disabled={(date) => date > new Date()}
                    />
                    <TimePicker
                      value={customDateRange.endTime}
                      onChange={(time) => 
                        onCustomDateRangeChange({ ...customDateRange, endTime: time })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => applyQuickRange('today')}
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => applyQuickRange('yesterday')}
                    >
                      Yesterday
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => applyQuickRange('this_week')}
                    >
                      This Week
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => applyQuickRange('last_week')}
                    >
                      Last Week
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => onShowDateRangeDialogChange(false)}>
                      Cancel
                    </Button>
                    <Button onClick={applyCustomDateRange}>
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Current Selections */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="flex items-center gap-1">
          <CalendarIcon className="h-3 w-3" />
          {getSelectedTimeRangeLabel()}
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1">
          {getMediaTypeIcon(selectedMediaTypes[0] || 'all')}
          <span className="text-xs">{getSelectedMediaTypesLabel()}</span>
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1">
          <CheckCheck className="h-3 w-3" />
          <span className="text-xs">{getSelectedQueuesLabel()}</span>
        </Badge>
      </div>
    </div>
  )
}