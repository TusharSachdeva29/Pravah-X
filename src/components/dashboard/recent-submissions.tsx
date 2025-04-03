"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CFSubmission } from "@/lib/codeforces-api";

interface RecentSubmissionsProps extends React.HTMLAttributes<HTMLDivElement> {
  submissions: CFSubmission[];
  limit?: number;
}

export function RecentSubmissions({
  className,
  submissions,
  limit = 5,
  ...props
}: RecentSubmissionsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sort submissions by creation time (newest first)
  const sortedSubmissions = [...submissions]
    .sort((a, b) => b.creationTimeSeconds - a.creationTimeSeconds)
    .slice(0, limit);

  // Function to format the timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInSecs = Math.floor(diffInMs / 1000);
    const diffInMins = Math.floor(diffInSecs / 60);
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSecs < 60) return `${diffInSecs} seconds ago`;
    if (diffInMins < 60) return `${diffInMins} minutes ago`;
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return date.toLocaleDateString();
  };

  // Function to get badge color based on verdict
  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "OK":
        return "bg-green-500 hover:bg-green-600";
      case "WRONG_ANSWER":
        return "bg-red-500 hover:bg-red-600";
      case "TIME_LIMIT_EXCEEDED":
        return "bg-amber-500 hover:bg-amber-600";
      case "MEMORY_LIMIT_EXCEEDED":
        return "bg-amber-500 hover:bg-amber-600";
      case "RUNTIME_ERROR":
        return "bg-rose-500 hover:bg-rose-600";
      case "COMPILATION_ERROR":
        return "bg-orange-500 hover:bg-orange-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  // Function to format verdict for display
  const formatVerdict = (verdict: string) => {
    switch (verdict) {
      case "OK":
        return "Accepted";
      case "WRONG_ANSWER":
        return "Wrong Answer";
      case "TIME_LIMIT_EXCEEDED":
        return "TLE";
      case "MEMORY_LIMIT_EXCEEDED":
        return "MLE";
      case "RUNTIME_ERROR":
        return "Runtime Error";
      case "COMPILATION_ERROR":
        return "Compilation Error";
      default:
        return verdict.replace(/_/g, " ");
    }
  };

  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            Recent Submissions
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs max-w-xs">
                  Your most recent submissions to Codeforces problems.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>Your latest problem submissions</CardDescription>
      </CardHeader>
      <CardContent>
        {mounted && sortedSubmissions.length > 0 ? (
          <div className="space-y-3">
            {sortedSubmissions.map((submission, index) => {
              const problemUrl = `https://codeforces.com/contest/${submission.contestId}/problem/${submission.problem.index}`;
              const submissionUrl = `https://codeforces.com/contest/${submission.contestId}/submission/${submission.id}`;

              return (
                <div
                  key={submission.id}
                  className="border-b pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <a
                          href={problemUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium hover:underline hover:text-primary flex items-center gap-1"
                        >
                          {submission.problem.name}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {`${
                          submission.problem.index
                        } - ${submission.problem.tags.join(", ")}`}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <a
                        href={submissionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Badge
                          className={cn(getVerdictColor(submission.verdict))}
                        >
                          {formatVerdict(submission.verdict)}
                        </Badge>
                      </a>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(submission.creationTimeSeconds)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : !mounted ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">No submissions found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
