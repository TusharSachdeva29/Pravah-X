"use client"

import type React from "react"
import { BookOpen, CheckCircle, ChevronRight, CircleDashed, Lock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface LearningPathProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LearningPath({ className, ...props }: LearningPathProps) {
  // Mock data for learning path
  const learningPath = {
    currentTrack: "Advanced Algorithms",
    progress: 65,
    modules: [
      {
        id: 1,
        name: "Dynamic Programming Fundamentals",
        status: "completed",
        progress: 100,
        lessons: 12,
        completedLessons: 12,
      },
      {
        id: 2,
        name: "Advanced Graph Algorithms",
        status: "in-progress",
        progress: 60,
        lessons: 10,
        completedLessons: 6,
      },
      {
        id: 3,
        name: "String Algorithms",
        status: "locked",
        progress: 0,
        lessons: 8,
        completedLessons: 0,
      },
      {
        id: 4,
        name: "Computational Geometry",
        status: "locked",
        progress: 0,
        lessons: 6,
        completedLessons: 0,
      },
    ],
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <CircleDashed className="h-4 w-4 text-indigo-500" />
      case "locked":
        return <Lock className="h-4 w-4 text-muted-foreground" />
      default:
        return null
    }
  }

  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader>
        <CardTitle>Learning Path</CardTitle>
        <CardDescription>Your personalized learning journey</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <span className="font-medium">{learningPath.currentTrack}</span>
                <div className="text-xs text-muted-foreground">Track Progress</div>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Progress value={learningPath.progress} className="h-2" />
              <span className="text-xs font-medium">{learningPath.progress}%</span>
            </div>
          </div>

          <div className="space-y-2">
            {learningPath.modules.map((module) => (
              <div
                key={module.id}
                className={cn(
                  "flex items-center justify-between rounded-lg border bg-card p-3 shadow-sm transition-all duration-200 hover:bg-muted/10",
                  module.status === "locked" && "opacity-60",
                )}
              >
                <div className="flex items-center gap-2">
                  {getStatusIcon(module.status)}
                  <div>
                    <span className={cn("text-sm", module.status === "completed" && "font-medium")}>{module.name}</span>
                    {module.status !== "locked" && (
                      <div className="text-xs text-muted-foreground">
                        {module.completedLessons} of {module.lessons} lessons completed
                      </div>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>

          <Button variant="outline" size="sm" className="w-full">
            View Full Curriculum
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

