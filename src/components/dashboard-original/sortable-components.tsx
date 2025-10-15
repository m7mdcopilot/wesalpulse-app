"use client"

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { SortableWidgetProps, SortableWidgetItemProps } from './types'

// Sortable Widget Component - extracted exactly from page.tsx
export function SortableWidget({ widget, children }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: widget.id,
    data: {
      type: 'widget',
      widget
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      {children({ attributes, listeners })}
    </div>
  )
}

// Sortable Widget Item Component - extracted exactly from page.tsx
export function SortableWidgetItem({ item, widgetId, children }: SortableWidgetItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: `${widgetId}-${item.id}`,
    data: {
      type: 'item',
      item,
      widgetId
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative group/item">
      {children({ attributes, listeners })}
    </div>
  )
}