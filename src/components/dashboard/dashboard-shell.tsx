import type React from "react"
import { cn } from "@/lib/utils"

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardShell({ children, className, ...props }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-indigo-50/50 to-white dark:from-indigo-950/10 dark:to-background">
      <main className="flex flex-1 flex-col gap-4 p-3 md:gap-8 md:p-8">
        <div className={cn("mx-auto w-full max-w-6xl animate-fade-in", className)} {...props}>
          {children}
        </div>
      </main>
    </div>
  )
}

