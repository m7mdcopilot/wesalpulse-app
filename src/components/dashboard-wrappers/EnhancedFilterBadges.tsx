"use client"

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Calendar, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  Phone,
  MessageSquare,
  Mail,
  Users
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface EnhancedFilterBadgesProps {
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
  className?: string
}

export function EnhancedFilterBadges({
  selectedTimeRange,
  selectedMediaTypes,
  selectedQueues,
  availableQueues,
  getSelectedTimeRangeLabel,
  getSelectedMediaTypesLabel,
  getSelectedQueuesLabel,
  getMediaTypeColor,
  getMediaTypeIcon,
  className
}: EnhancedFilterBadgesProps) {
  const [expanded, setExpanded] = useState(false)

  const showIndividualBadges = expanded || 
    (!selectedMediaTypes.includes('all') && selectedMediaTypes.length <= 3) ||
    (!selectedQueues.includes('all') && selectedQueues.length <= 3)

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="px-4 py-0">
        <div className="flex flex-wrap items-center gap-4">
          {/* Date Section */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-bold text-muted-foreground">Date</span>
            <Badge 
              variant="secondary" 
              className={cn(
                "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
                selectedTimeRange === 'last_24_hours' && "bg-blue-100 text-blue-800 border-blue-300"
              )}
            >
              {getSelectedTimeRangeLabel()}
            </Badge>
          </div>

          {/* Separator */}
          <div className="h-4 w-px bg-gray-300"></div>

          {/* Types Section */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-bold text-muted-foreground">Types</span>
            {selectedMediaTypes.includes('all') || selectedMediaTypes.length === 0 ? (
              <Badge 
                variant="secondary" 
                className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
              >
                All Media Types
              </Badge>
            ) : showIndividualBadges ? (
              <div className="flex flex-wrap gap-1">
                {selectedMediaTypes.map(type => (
                  <Badge 
                    key={type} 
                    variant="secondary" 
                    className={cn(
                      "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
                      getMediaTypeColor(type)
                    )}
                  >
                    <div className="flex items-center gap-1">
                      {getMediaTypeIcon(type)}
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </div>
                  </Badge>
                ))}
              </div>
            ) : (
              <Badge 
                variant="secondary" 
                className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 cursor-pointer"
                onClick={() => setExpanded(true)}
              >
                {selectedMediaTypes.length} Media Types
              </Badge>
            )}
          </div>

          {/* Separator */}
          <div className="h-4 w-px bg-gray-300"></div>

          {/* Queues Section */}
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-green-500" />
            <span className="text-sm font-bold text-muted-foreground">Queues</span>
            {selectedQueues.includes('all') || selectedQueues.length === 0 ? (
              <Badge 
                variant="secondary" 
                className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
              >
                All Queues
              </Badge>
            ) : showIndividualBadges ? (
              <div className="flex flex-wrap gap-1">
                {selectedQueues.slice(0, expanded ? undefined : 3).map(queueId => {
                  const queue = availableQueues.find(q => q.id === queueId)
                  return (
                    <Badge 
                      key={queueId} 
                      variant="secondary" 
                      className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                    >
                      {queue?.name || queueId}
                    </Badge>
                  )
                })}
                {!expanded && selectedQueues.length > 3 && (
                  <Badge 
                    variant="outline" 
                    className="border-green-200 text-green-600 cursor-pointer"
                    onClick={() => setExpanded(true)}
                  >
                    +{selectedQueues.length - 3} more
                  </Badge>
                )}
              </div>
            ) : (
              <Badge 
                variant="secondary" 
                className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 cursor-pointer"
                onClick={() => setExpanded(true)}
              >
                {selectedQueues.length} Queues
              </Badge>
            )}
          </div>
        </div>

        {/* Expanded view with detailed information */}
        {expanded && (
          <div className="space-y-3 pt-3 border-t">
            {/* Detailed Media Types */}
            {!selectedMediaTypes.includes('all') && selectedMediaTypes.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Filter className="h-3 w-3 text-purple-500" />
                  <span className="text-xs font-medium text-muted-foreground">Media Types ({selectedMediaTypes.length})</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedMediaTypes.map(type => (
                    <Badge 
                      key={type} 
                      variant="outline" 
                      className={cn("text-xs", getMediaTypeColor(type))}
                    >
                      <div className="flex items-center gap-1">
                        {getMediaTypeIcon(type)}
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </div>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Queues */}
            {!selectedQueues.includes('all') && selectedQueues.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3 text-green-500" />
                  <span className="text-xs font-medium text-muted-foreground">Queues ({selectedQueues.length})</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedQueues.map(queueId => {
                    const queue = availableQueues.find(q => q.id === queueId)
                    return (
                      <Badge 
                        key={queueId} 
                        variant="outline" 
                        className="text-xs border-green-200 text-green-700"
                      >
                        {queue?.name || queueId}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            )}
            
            {/* Collapse button */}
            <div className="flex justify-center pt-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setExpanded(false)}
                className="h-6 px-2 text-xs"
              >
                <ChevronUp className="h-3 w-3 mr-1" />
                Show Less
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}