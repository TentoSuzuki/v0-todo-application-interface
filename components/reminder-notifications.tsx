"use client"

import { useState } from "react"
import { useTasks } from "./task-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Bell, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function ReminderNotifications() {
  const { tasks } = useTasks()
  const [dismissedReminders, setDismissedReminders] = useState<Set<string>>(new Set())

  const now = new Date()
  const upcomingReminders = tasks.filter((task) => {
    if (!task.reminder || task.completed || dismissedReminders.has(task.id)) {
      return false
    }

    const timeDiff = task.reminder.getTime() - now.getTime()
    const hoursDiff = timeDiff / (1000 * 60 * 60)

    // Show notifications for overdue tasks and tasks due within 1 hour
    return timeDiff < 0 || hoursDiff <= 1
  })

  const dismissReminder = (taskId: string) => {
    setDismissedReminders((prev) => new Set([...prev, taskId]))
  }

  if (upcomingReminders.length === 0) {
    return null
  }

  return (
    <div className="space-y-2 mb-6">
      {upcomingReminders.map((task) => {
        const isOverdue = task.reminder && task.reminder.getTime() < now.getTime()

        return (
          <Alert
            key={task.id}
            className={cn(
              "border-l-4",
              isOverdue ? "border-l-destructive bg-destructive/5" : "border-l-secondary bg-secondary/5",
            )}
          >
            <Bell className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <div>
                <span className="font-medium">{task.title}</span>
                <span className="text-muted-foreground ml-2">
                  {isOverdue ? "Overdue" : "Due soon"}
                  {task.reminder && ` - ${task.reminder.toLocaleString()}`}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => dismissReminder(task.id)} className="h-6 w-6 p-0">
                <X className="h-3 w-3" />
              </Button>
            </AlertDescription>
          </Alert>
        )
      })}
    </div>
  )
}
