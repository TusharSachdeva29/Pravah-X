"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CFSubmission } from "@/lib/codeforces-api"
import { processSubmissionsForHeatmap } from "@/lib/codeforces-api"
import { Info } from "lucide-react"

interface ActivityHeatmapProps extends React.HTMLAttributes<HTMLDivElement> {
  submissions: CFSubmission[]
}

export function ActivityHeatmap({ className, submissions, ...props }: ActivityHeatmapProps) {
  const [mounted, setMounted] = useState(false)
  const [period, setPeriod] = useState("12-weeks")

  useEffect(() => {
    setMounted(true)
  }, [])

  const activityData = processSubmissionsForHeatmap(submissions)

  // Enhanced color scale with better contrast
  const getActivityColor = (level: number) => {
    if (level === 0) return "bg-muted/40"
    if (level === 1) return "bg-indigo-100 dark:bg-indigo-950/50"
    if (level <= 3) return "bg-indigo-300 dark:bg-indigo-800/70"
    if (level <= 6) return "bg-indigo-500 dark:bg-indigo-600"
    return "bg-indigo-700 dark:bg-indigo-400"
  }

  // Create a grid of weeks and days
  const renderHeatmap = () => {
    const weekdays = ["Mon", "", "Wed", "", "Fri", "", "Sun"]
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    // Get dates for the selected period
    const today = new Date()
    const startDate = new Date(today)
    const weeks = period === "12-weeks" ? 12 : period === "6-months" ? 26 : 52
    startDate.setDate(startDate.getDate() - 7 * weeks)

    // First day of each month for labels
    const monthLabels = []
    let labelDate = new Date(startDate)
    while (labelDate <= today) {
      const month = labelDate.getMonth()
      monthLabels.push({
        month: months[month],
        position: Math.floor((labelDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7)),
      })
      labelDate.setMonth(month + 1)
      labelDate.setDate(1)
    }

    // Group by weeks
    const weekData = []
    const currentDate = new Date(startDate)

    // Adjust to start on Monday
    const dayOfWeek = currentDate.getDay()
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    currentDate.setDate(currentDate.getDate() - daysToSubtract)

    while (currentDate <= today) {
      const week = []

      for (let i = 0; i < 7; i++) {
        const dateStr = currentDate.toISOString().split("T")[0]
        const submissionCount = activityData.get(dateStr) || 0
        const monthDay = currentDate.getDate()
        const month = months[currentDate.getMonth()]
        const isToday = currentDate.toDateString() === today.toDateString()

        week.push({
          date: dateStr,
          count: submissionCount,
          label: `${month} ${monthDay}: ${submissionCount} submission${submissionCount !== 1 ? 's' : ''}`,
          isToday
        })

        currentDate.setDate(currentDate.getDate() + 1)
      }

      weekData.push(week)
    }

    // Calculate total submissions and active days
    const totalSubmissions = Array.from(activityData.values()).reduce((sum, count) => sum + count, 0)
    const activeDays = Array.from(activityData.values()).filter(count => count > 0).length

    const formatPeriod = () => {
      switch (period) {
        case "12-weeks": return "the last 12 weeks"
        case "6-months": return "the last 6 months"
        case "year": return "the last year"
        default: return "the selected period"
      }
    }

    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs max-w-xs">
                    This shows your submission activity over time. Darker cells represent more submissions on that day.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="h-3 w-3 rounded-sm bg-muted/40"></div>
              <div className="h-3 w-3 rounded-sm bg-indigo-100 dark:bg-indigo-950/50"></div>
              <div className="h-3 w-3 rounded-sm bg-indigo-300 dark:bg-indigo-800/70"></div>
              <div className="h-3 w-3 rounded-sm bg-indigo-500 dark:bg-indigo-600"></div>
              <div className="h-3 w-3 rounded-sm bg-indigo-700 dark:bg-indigo-400"></div>
              <span>More</span>
            </div>
          </div>

          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12-weeks">Last 12 weeks</SelectItem>
              <SelectItem value="6-months">Last 6 months</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto pb-2 bg-card rounded-md border p-3">
          <div className="flex min-w-[650px]">
            <div className="flex flex-col justify-between pr-2 pt-7 text-xs text-muted-foreground">
              {weekdays.map((day, i) => (
                <span key={day || `empty-${i}`} className="h-3">{day}</span>
              ))}
            </div>
            <div className="flex-1 relative">
              <div className="flex absolute top-0 left-0 right-0">
                {monthLabels.map((label, i) => (
                  <div
                    key={`${label.month}-${i}`}
                    className="text-xs text-muted-foreground absolute"
                    style={{ left: `${label.position * 16 + 4}px` }}
                  >
                    {label.month}
                  </div>
                ))}
              </div>
              <div className="grid grid-flow-col gap-1 mt-5 activity-heatmap">
                {weekData.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((day, dayIndex) => (
                      <TooltipProvider key={`${weekIndex}-${dayIndex}`}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div 
                              className={cn(
                                "h-3 w-3 rounded-sm activity-cell", 
                                getActivityColor(day.count),
                                day.isToday && "ring-1 ring-primary"
                              )}
                              aria-label={day.label}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">
                            {day.label}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-foreground">
            <div>
              <span className="font-medium text-foreground">{totalSubmissions}</span> submissions in {formatPeriod()}
            </div>
            <div>
              <span className="font-medium text-foreground">{activeDays}</span> active days
            </div>
            <div>
              <span className="font-medium text-foreground">
                {Math.round((activeDays / (weeks * 7)) * 100)}%
              </span> consistency
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader className="pb-2">
        <CardTitle>Coding Activity</CardTitle>
        <CardDescription>Your submission history over time</CardDescription>
      </CardHeader>
      <CardContent>
        {mounted ? renderHeatmap() : <div className="h-[150px] animate-pulse bg-muted/20 rounded-md"></div>}
      </CardContent>
    </Card>
  )
}

