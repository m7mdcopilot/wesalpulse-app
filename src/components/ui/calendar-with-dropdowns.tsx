"use client"

import * as React from "react"
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CalendarWithDropdownsProps {
  mode?: "single" | "range" | "multiple"
  selected?: Date | Date[] | undefined
  onSelect?: (date: Date | undefined) => void
  initialFocus?: boolean
  className?: string
  disabled?: (date: Date) => boolean
  modifiers?: Record<string, (date: Date) => boolean>
  modifiersStyles?: Record<string, React.CSSProperties>
  minDate?: Date
  maxDate?: Date
  onMonthChange?: (date: Date) => void
  onYearChange?: (date: Date) => void
}

function CalendarWithDropdowns({
  mode = "single",
  selected,
  onSelect,
  initialFocus,
  className,
  disabled,
  modifiers,
  modifiersStyles,
  minDate,
  maxDate,
  onMonthChange,
  onYearChange,
  ...props
}: CalendarWithDropdownsProps) {
  const defaultClassNames = getDefaultClassNames()
  
  // State to track the current month and year being displayed
  const [currentMonth, setCurrentMonth] = React.useState(() => {
    const date = Array.isArray(selected) ? selected[0] : selected
    return date ? new Date(date.getFullYear(), date.getMonth(), 1) : new Date()
  })

  // Update current month when selected date changes
  React.useEffect(() => {
    if (selected && !Array.isArray(selected)) {
      setCurrentMonth(new Date(selected.getFullYear(), selected.getMonth(), 1))
    }
  }, [selected])

  const handleMonthChange = (monthIndex: number) => {
    const newMonth = new Date(currentMonth.getFullYear(), monthIndex, 1)
    setCurrentMonth(newMonth)
    onMonthChange?.(newMonth)
  }

  const handleYearChange = (year: number) => {
    const newYear = new Date(year, currentMonth.getMonth(), 1)
    setCurrentMonth(newYear)
    onYearChange?.(newYear)
  }

  const handlePreviousMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    setCurrentMonth(newMonth)
    onMonthChange?.(newMonth)
  }

  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    setCurrentMonth(newMonth)
    onMonthChange?.(newMonth)
  }

  // Generate year options (2020-2050)
  const yearOptions = React.useMemo(() => {
    const startYear = 2020
    const endYear = 2050
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)
  }, [])

  // Generate month options
  const monthOptions = React.useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      value: i,
      label: new Date(2000, i).toLocaleString('default', { month: 'long' })
    }))
  }, [])

  return (
    <div className="space-y-0 border rounded-lg shadow-sm overflow-hidden bg-background w-full max-w-[320px]">
      {/* Custom Month/Year Dropdowns */}
      <div className="flex items-center gap-2 justify-center p-3 border-b bg-muted/30">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePreviousMonth}
          className="h-8 w-8 hover:bg-muted transition-colors"
          disabled={minDate ? currentMonth <= minDate : false}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        
        <Select
          value={currentMonth.getMonth().toString()}
          onValueChange={(value) => handleMonthChange(parseInt(value))}
        >
          <SelectTrigger className="w-[120px] h-8 text-sm font-medium border-border/50 hover:border-border transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-[200px]">
            {monthOptions.map((month) => (
              <SelectItem key={month.value} value={month.value.toString()} className="text-sm">
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={currentMonth.getFullYear().toString()}
          onValueChange={(value) => handleYearChange(parseInt(value))}
        >
          <SelectTrigger className="w-[100px] h-8 text-sm font-medium border-border/50 hover:border-border transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-[200px]">
            {yearOptions.map((year) => (
              <SelectItem key={year} value={year.toString()} className="text-sm">
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextMonth}
          className="h-8 w-8 hover:bg-muted transition-colors"
          disabled={maxDate ? currentMonth >= maxDate : false}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Component */}
      <DayPicker
        mode={mode}
        selected={selected}
        onSelect={onSelect}
        initialFocus={initialFocus}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        disabled={disabled}
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        className={cn(
          "bg-background group/calendar p-3 [--cell-size:--spacing(8)]",
          String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
          String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
          className
        )}
        captionLayout="hidden"
        formatters={{
          formatMonthDropdown: (date) =>
            date.toLocaleString("default", { month: "short" }),
        }}
        classNames={{
          root: cn("w-full", defaultClassNames.root),
          months: cn(
            "flex gap-4 flex-col md:flex-row relative",
            defaultClassNames.months
          ),
          month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
          nav: cn("hidden", defaultClassNames.nav), // Hide default navigation
          button_previous: cn("hidden", defaultClassNames.button_previous),
          button_next: cn("hidden", defaultClassNames.button_next),
          month_caption: cn("hidden", defaultClassNames.month_caption), // Hide default caption
          dropdowns: cn("hidden", defaultClassNames.dropdowns), // Hide default dropdowns
          dropdown_root: cn("hidden", defaultClassNames.dropdown_root),
          dropdown: cn("hidden", defaultClassNames.dropdown),
          caption_label: cn("hidden", defaultClassNames.caption_label),
          table: "w-full border-collapse",
          weekdays: cn("flex", defaultClassNames.weekdays),
          weekday: cn(
            "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none",
            defaultClassNames.weekday
          ),
          week: cn("flex w-full mt-2", defaultClassNames.week),
          week_number_header: cn(
            "select-none w-(--cell-size)",
            defaultClassNames.week_number_header
          ),
          week_number: cn(
            "text-[0.8rem] select-none text-muted-foreground",
            defaultClassNames.week_number
          ),
          day: cn(
            "relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
            defaultClassNames.day
          ),
          range_start: cn(
            "rounded-l-md bg-accent",
            defaultClassNames.range_start
          ),
          range_middle: cn("rounded-none", defaultClassNames.range_middle),
          range_end: cn("rounded-r-md bg-accent", defaultClassNames.range_end),
          today: cn(
            "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
            defaultClassNames.today
          ),
          outside: cn(
            "text-muted-foreground aria-selected:text-muted-foreground",
            defaultClassNames.outside
          ),
          disabled: cn(
            "text-muted-foreground opacity-50",
            defaultClassNames.disabled
          ),
          hidden: cn("invisible", defaultClassNames.hidden),
        }}
        components={{
          Root: ({ className, rootRef, ...props }) => {
            return (
              <div
                data-slot="calendar"
                ref={rootRef}
                className={cn(className)}
                {...props}
              />
            )
          },
          Chevron: ({ className, orientation, ...props }) => {
            if (orientation === "left") {
              return (
                <ChevronLeftIcon className={cn("size-4", className)} {...props} />
              )
            }

            if (orientation === "right") {
              return (
                <ChevronRightIcon
                  className={cn("size-4", className)}
                  {...props}
                />
              )
            }

            return (
              <ChevronDownIcon className={cn("size-4", className)} {...props} />
            )
          },
          DayButton: CalendarDayButton,
          WeekNumber: ({ children, ...props }) => {
            return (
              <td {...props}>
                <div className="flex size-(--cell-size) items-center justify-center text-center">
                  {children}
                </div>
              </td>
            )
          },
        }}
        {...props}
      />
    </div>
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof import("react-day-picker").DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 dark:hover:text-accent-foreground flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { CalendarWithDropdowns }