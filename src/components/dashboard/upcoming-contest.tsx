"use client"

import type React from "react"
import { Calendar, Clock, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { format, formatDistance } from "date-fns"

interface UpcomingContestsProps extends React.HTMLAttributes<HTMLDivElement> {
  contests: any[]
}

export function UpcomingContests({ className, contests = [], ...props }: UpcomingContestsProps) {
  const [processedContests, setProcessedContests] = useState<any[]>([])

  useEffect(() => {
    // Process contests data
    const upcoming = contests
      .filter(contest => contest.phase === "BEFORE")
      // Sort by start time (earliest first)
      .sort((a, b) => a.startTimeSeconds - b.startTimeSeconds)
      // Take only the next 3 contests
      .slice(0, 3)
      .map(contest => {
        const startTimeMs = contest.startTimeSeconds * 1000
        const now = Date.now()
        
        return {
          id: contest.id,
          name: contest.name,
          platform: "Codeforces",
          date: format(startTimeMs, "MMM d, yyyy"),
          time: format(startTimeMs, "h:mm a"),
          // Format duration to 1 decimal place
          duration: `${(contest.durationSeconds / 3600).toFixed(1)} hours`,
          registered: false, // No registration info in API
          live: now >= startTimeMs && now < startTimeMs + contest.durationSeconds * 1000,
          timeLeft: formatDistance(startTimeMs, now, { addSuffix: true })
        }
      })
    
    setProcessedContests(upcoming)
  }, [contests])

  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Upcoming Contests</CardTitle>
          <CardDescription>Next scheduled Codeforces contests</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => window.open("https://codeforces.com/contests", "_blank")}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span>CF</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {processedContests.length > 0 ? (
            processedContests.map((contest) => (
              <div key={contest.id} className="rounded-lg border bg-card p-3 shadow-sm problem-card">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{contest.name}</div>
                    {contest.live && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                        <span className="relative flex h-2 w-2 mr-1">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Live
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">{contest.platform}</div>
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                    <span>{contest.date}</span>
                    <span>•</span>
                    <Clock className="h-3.5 w-3.5 text-indigo-500" />
                    <span>{contest.time}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Duration: {contest.duration}</div>
                  <div className="flex items-center justify-between mt-1">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => window.open(`https://codeforces.com/contests/${contest.id}`, "_blank")}
                    >
                      View Details
                    </Button>
                    <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{contest.timeLeft}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center py-8 text-muted-foreground">
              No upcoming contests found
            </div>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => window.open("https://codeforces.com/contests", "_blank")}
          >
            View All Contests
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

