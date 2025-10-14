"use client"

import { Badge } from '@/components/ui/badge'

interface ActiveFiltersDisplayProps {
  selectedTimeRange: string
  selectedMediaTypes: string[]
  selectedQueues: string[]
  availableQueues: Array<{
    id: string
    name: string
    mediaTypes: string[]
  }>
  getSelectedTimeRangeLabel: () => string
  getSelectedMediaTypesLabel: () => string
  getSelectedQueuesLabel: () => string
  getMediaTypeColor: (mediaType: string) => string
  getMediaTypeIcon: (mediaType: string) => React.ReactNode
}

export function ActiveFiltersDisplay({
  selectedTimeRange,
  selectedMediaTypes,
  selectedQueues,
  availableQueues,
  getSelectedTimeRangeLabel,
  getSelectedMediaTypesLabel,
  getSelectedQueuesLabel,
  getMediaTypeColor,
  getMediaTypeIcon
}: ActiveFiltersDisplayProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {/* Time Range Badge */}
      <Badge variant="secondary">
        Time Range: {getSelectedTimeRangeLabel()}
      </Badge>
      
      {/* Media Type Section */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary">
          Media Type: {getSelectedMediaTypesLabel()}
        </Badge>
        {!selectedMediaTypes.includes('all') && selectedMediaTypes.length > 0 && (
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
      </div>
      
      {/* Queues Section */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary">
          Queues: {getSelectedQueuesLabel()}
        </Badge>
        {!selectedQueues.includes('all') && selectedQueues.length > 0 && (
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
      </div>
    </div>
  )
}