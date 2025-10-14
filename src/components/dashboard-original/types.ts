// Extracted interfaces from page.tsx - keeping exactly the same as original

export interface QueueMetric {
  queueId: string
  queueName: string
  mediaType: string
  totalInteractions: number
  offered: number
  handled: number
  abandoned: number
  averageWaitTime: number
  averageHandleTime: number
  serviceLevel: number
  longestWaitTime: number
  occupancy: number
  agentsAvailable: number
  agentsOnQueue: number
}

export interface SummaryMetrics {
  totalInteractions: number
  totalOffered: number
  totalHandled: number
  totalAbandoned: number
  averageWaitTime: number
  averageHandleTime: number
  overallServiceLevel: number
  totalAgentsAvailable: number
  totalAgentsOnQueue: number
}

export interface QueueOption {
  id: string
  name: string
  mediaTypes: string[]
}

// Sortable Widget Component
export interface SortableWidgetProps {
  widget: any
  children: (props: { attributes: any; listeners: any }) => React.ReactNode
}

// Sortable Widget Item Component
export interface SortableWidgetItemProps {
  item: any
  widgetId: string
  children: (props: { attributes: any; listeners: any }) => React.ReactNode
}