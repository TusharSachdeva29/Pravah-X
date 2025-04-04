"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CFSubmission } from "@/lib/codeforces-api";
import { processSubmissionsForHeatmap } from "@/lib/codeforces-api";
import { Info } from "lucide-react";

interface ActivityHeatmapProps extends React.HTMLAttributes<HTMLDivElement> {
  submissions: CFSubmission[];
}

export function ActivityHeatmap({
  className,
  submissions,
  ...props
}: ActivityHeatmapProps) {
  const [mounted, setMounted] = useState(false);
  const [period, setPeriod] = useState("3-months");

  useEffect(() => {
    setMounted(true);
  }, []);

  const activityData = processSubmissionsForHeatmap(submissions);

  // Enhanced color scale with better contrast
  const getActivityColor = (level: number) => {
    if (level === 0) return "bg-muted/40";
    if (level === 1) return "bg-indigo-100 dark:bg-indigo-950/50";
    if (level <= 3) return "bg-indigo-300 dark:bg-indigo-800/70";
    if (level <= 6) return "bg-indigo-500 dark:bg-indigo-600";
    return "bg-indigo-700 dark:bg-indigo-400";
  };

  // Create a grid of weeks and days
  const renderHeatmap = () => {
    const weekdays = ["Mon", "", "Wed", "", "Fri", "", "Sun"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Get dates for the selected period
    const today = new Date();
    const startDate = new Date(today);
    const weeks = period === "3-months" ? 12 : period === "6-months" ? 26 : 52;
    startDate.setDate(startDate.getDate() - 7 * weeks);

    // First day of each month for labels - adjust frequency based on period
    const monthLabels = [];
    let labelDate = new Date(startDate);

    // Get all months in the period
    const allMonthLabels = [];
    while (labelDate <= today) {
      const month = labelDate.getMonth();
      allMonthLabels.push({
        month: months[month],
        position: Math.floor(
          (labelDate.getTime() - startDate.getTime()) /
            (1000 * 60 * 60 * 24 * 7)
        ),
      });
      labelDate.setMonth(month + 1);
      labelDate.setDate(1);
    }

    // Clear any previous labels
    monthLabels.length = 0;

    // Apply exact label frequency based on period
    if (allMonthLabels.length > 0) {
      // Show exact labels based on period requirements
      if (period === "3-months") {
        // For 3-month view, add first, middle and last label
        // First month
        if (allMonthLabels.length > 0) {
          monthLabels.push(allMonthLabels[0]);
        }

        // Last month
        if (allMonthLabels.length > 1) {
          monthLabels.push(allMonthLabels[allMonthLabels.length - 1]);
        }

        // If we have a reasonable number of months, also add one in the middle
        if (allMonthLabels.length >= 3) {
          const middleIndex = Math.floor(allMonthLabels.length / 2);
          // Only add if it's not too close to first or last
          if (middleIndex > 0 && middleIndex < allMonthLabels.length - 1) {
            monthLabels.push(allMonthLabels[middleIndex]);
          }
        }
      } else if (period === "6-months") {
        // For 6-month view: Every 2 months
        for (let i = 0; i < allMonthLabels.length; i += 2) {
          monthLabels.push(allMonthLabels[i]);
        }

        // Ensure last month is included if not already
        const lastMonth = allMonthLabels[allMonthLabels.length - 1];
        if (
          !monthLabels.some((label) => label.position === lastMonth.position)
        ) {
          monthLabels.push(lastMonth);
        }
      } else {
        // year
        // For 1-year view: Show every month
        allMonthLabels.forEach((label) => monthLabels.push(label));
      }
    }

    // Sort labels by position to ensure they appear in order
    monthLabels.sort((a, b) => a.position - b.position);

    // Group by weeks
    const weekData = [];
    const currentDate = new Date(startDate);

    // Adjust to start on Monday
    const dayOfWeek = currentDate.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    currentDate.setDate(currentDate.getDate() - daysToSubtract);

    while (currentDate <= today) {
      const week = [];

      for (let i = 0; i < 7; i++) {
        const dateStr = currentDate.toISOString().split("T")[0];
        const submissionCount = activityData.get(dateStr) || 0;
        const monthDay = currentDate.getDate();
        const month = months[currentDate.getMonth()];
        const isToday = currentDate.toDateString() === today.toDateString();

        week.push({
          date: dateStr,
          count: submissionCount,
          label: `${month} ${monthDay}: ${submissionCount} submission${
            submissionCount !== 1 ? "s" : ""
          }`,
          isToday,
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      weekData.push(week);
    }

    // Calculate total submissions and active days for the SELECTED PERIOD only
    const totalSubmissions = Array.from(activityData.entries())
      .filter(([dateStr]) => {
        const date = new Date(dateStr);
        return date >= startDate && date <= today;
      })
      .reduce((sum, [_, count]) => sum + count, 0);

    const activeDays = Array.from(activityData.entries()).filter(
      ([dateStr]) => {
        const date = new Date(dateStr);
        return (
          date >= startDate && date <= today && activityData.get(dateStr) > 0
        );
      }
    ).length;

    // Calculate actual days in the selected period for consistency
    const totalDaysInPeriod = Math.min(
      weeks * 7,
      Math.floor(
        (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1
    );

    const formatPeriod = () => {
      switch (period) {
        case "3-months":
          return "the last 3 months";
        case "6-months":
          return "the last 6 months";
        case "year":
          return "the last year";
        default:
          return "the selected period";
      }
    };

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
                    This shows your submission activity over time. Darker cells
                    represent more submissions on that day.
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
              <SelectItem value="3-months">Last 3 months</SelectItem>
              <SelectItem value="6-months">Last 6 months</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto pb-2 bg-card rounded-md border p-3">
          <div className="flex min-w-[650px]">
            <div className="flex flex-col justify-between pr-2 pt-7 text-xs text-muted-foreground">
              {weekdays.map((day, i) => (
                <span key={day || `empty-${i}`} className="h-3">
                  {day}
                </span>
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
              <span className="font-medium text-foreground">
                {totalSubmissions}
              </span>{" "}
              submissions in {formatPeriod()}
            </div>
            <div>
              <span className="font-medium text-foreground">{activeDays}</span>{" "}
              active days
            </div>
            <div>
              <span className="font-medium text-foreground">
                {Math.round((activeDays / totalDaysInPeriod) * 100)}%
              </span>{" "}
              consistency
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader className="pb-2">
        <CardTitle>Coding Activity</CardTitle>
        <CardDescription>Your submission history over time</CardDescription>
      </CardHeader>
      <CardContent>
        {mounted ? (
          renderHeatmap()
        ) : (
          <div className="h-[150px] animate-pulse bg-muted/20 rounded-md"></div>
        )}
      </CardContent>
    </Card>
  );
}
