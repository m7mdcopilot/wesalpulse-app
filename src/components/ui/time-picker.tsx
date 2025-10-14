"use client"

import * as React from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TimePickerProps {
  value: string
  onChange: (time: string) => void
  className?: string
  disabled?: boolean
}

function TimePicker({ value, onChange, className, disabled = false }: TimePickerProps) {
  // Parse the time string (format: "HH:mm")
  const parseTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number)
    return { hours, minutes }
  }

  // Format time back to string
  const formatTime = (hours: number, minutes: number) => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  // Convert 24h to 12h format
  const to12Hour = (hours24: number) => {
    const hours12 = hours24 % 12 || 12
    const isPM = hours24 >= 12
    return { hours12, isPM }
  }

  // Convert 12h to 24h format
  const to24Hour = (hours12: number, isPM: boolean) => {
    if (isPM && hours12 < 12) return hours12 + 12
    if (!isPM && hours12 === 12) return 0
    return hours12
  }

  // Validate and parse hour input (1-12)
  const parseHourInput = (input: string) => {
    const num = parseInt(input)
    if (isNaN(num)) return 1
    if (num < 1) return 1
    if (num > 12) return 12
    return num
  }

  // Validate and parse minute input (0-59, rounded to nearest 5)
  const parseMinuteInput = (input: string) => {
    const num = parseInt(input)
    if (isNaN(num)) return 0
    if (num < 0) return 0
    if (num > 59) return 55
    // Round to nearest 5-minute interval
    return Math.round(num / 5) * 5
  }

  const { hours, minutes } = parseTime(value)
  const { hours12, isPM } = to12Hour(hours)

  const handleHoursUp = () => {
    const newHours12 = hours12 === 12 ? 1 : hours12 + 1
    const newHours24 = to24Hour(newHours12, isPM)
    onChange(formatTime(newHours24, minutes))
  }

  const handleHoursDown = () => {
    const newHours12 = hours12 === 1 ? 12 : hours12 - 1
    const newHours24 = to24Hour(newHours12, isPM)
    onChange(formatTime(newHours24, minutes))
  }

  const handleMinutesUp = () => {
    const newMinutes = minutes === 55 ? 0 : minutes + 5 // 5-minute intervals
    onChange(formatTime(hours, newMinutes))
  }

  const handleMinutesDown = () => {
    const newMinutes = minutes === 0 ? 55 : minutes - 5 // 5-minute intervals
    onChange(formatTime(hours, newMinutes))
  }

  const toggleAMPM = () => {
    const newIsPM = !isPM
    const newHours24 = to24Hour(hours12, newIsPM)
    onChange(formatTime(newHours24, minutes))
  }

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHours12 = parseHourInput(e.target.value)
    const newHours24 = to24Hour(newHours12, isPM)
    onChange(formatTime(newHours24, minutes))
  }

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinutes = parseMinuteInput(e.target.value)
    onChange(formatTime(hours, newMinutes))
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, type: 'hours' | 'minutes' | 'ampm') => {
    if (disabled) return

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        if (type === 'hours') handleHoursUp()
        else if (type === 'minutes') handleMinutesUp()
        break
      case 'ArrowDown':
        e.preventDefault()
        if (type === 'hours') handleHoursDown()
        else if (type === 'minutes') handleMinutesDown()
        break
      case ' ':
      case 'Enter':
        e.preventDefault()
        if (type === 'ampm') toggleAMPM()
        break
    }
  }

  return (
    <div className={cn(
      "flex items-center gap-2 w-full p-2 border rounded-md bg-background",
      disabled && "opacity-50 cursor-not-allowed",
      className
    )}>
      {/* Hours */}
      <div className="flex flex-col items-center flex-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-muted transition-colors"
          onClick={handleHoursUp}
          disabled={disabled}
          tabIndex={disabled ? -1 : 0}
        >
          <ChevronUp className="h-3 w-3" />
        </Button>
        <Input
          type="text"
          value={hours12.toString()}
          onChange={handleHoursChange}
          disabled={disabled}
          className="h-7 w-12 text-center text-sm font-mono font-medium p-0 border-0 bg-muted/30 focus:bg-muted/50 focus:outline-none focus:ring-1 focus:ring-primary"
          maxLength={2}
          onKeyDown={(e) => handleKeyDown(e, 'hours')}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-muted transition-colors"
          onClick={handleHoursDown}
          disabled={disabled}
          tabIndex={disabled ? -1 : 0}
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>

      <div className="text-lg font-semibold text-muted-foreground pb-2 select-none">:</div>

      {/* Minutes */}
      <div className="flex flex-col items-center flex-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-muted transition-colors"
          onClick={handleMinutesUp}
          disabled={disabled}
          tabIndex={disabled ? -1 : 0}
        >
          <ChevronUp className="h-3 w-3" />
        </Button>
        <Input
          type="text"
          value={minutes.toString().padStart(2, '0')}
          onChange={handleMinutesChange}
          disabled={disabled}
          className="h-7 w-12 text-center text-sm font-mono font-medium p-0 border-0 bg-muted/30 focus:bg-muted/50 focus:outline-none focus:ring-1 focus:ring-primary"
          maxLength={2}
          onKeyDown={(e) => handleKeyDown(e, 'minutes')}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-muted transition-colors"
          onClick={handleMinutesDown}
          disabled={disabled}
          tabIndex={disabled ? -1 : 0}
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>

      {/* AM/PM Toggle */}
      <div className="flex flex-col items-center gap-0.5 ml-1">
        <Button
          type="button"
          variant={isPM ? "outline" : "default"}
          size="sm"
          className="h-8 w-8 text-xs px-2 py-0 font-medium rounded-t rounded-b-none transition-colors flex items-center justify-center"
          onClick={toggleAMPM}
          disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => handleKeyDown(e, 'ampm')}
        >
          AM
        </Button>
        <Button
          type="button"
          variant={isPM ? "default" : "outline"}
          size="sm"
          className="h-8 w-8 text-xs px-2 py-0 font-medium rounded-t-none rounded-b transition-colors flex items-center justify-center"
          onClick={toggleAMPM}
          disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => handleKeyDown(e, 'ampm')}
        >
          PM
        </Button>
      </div>
    </div>
  )
}

export { TimePicker }