"use client"

import { useTasks } from "./task-provider"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertTriangle, Calendar } from "lucide-react"

export function TaskStats() {
  const { tasks } = useTasks()

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.completed).length
  const overdueTasks = tasks.filter((task) => {
    if (!task.reminder || task.completed) return false
    return task.reminder.getTime() < new Date().getTime()
  }).length
  const todayTasks = tasks.filter((task) => {
    if (!task.reminder || task.completed) return false
    const today = new Date().toDateString()
    return task.reminder.toDateString() === today
  }).length

  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const stats = [
    {
      label: "Completed",
      value: completedTasks,
      total: totalTasks,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
    {
      label: "Due Today",
      value: todayTasks,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      label: "Overdue",
      value: overdueTasks,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950/20",
    },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Overall Progress</span>
              <span className="text-muted-foreground">{Math.round(completionRate)}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="transition-all duration-200 hover:shadow-md">
            <CardContent className="p-3">
              <div className={`flex items-center gap-3 ${stat.bgColor} -m-3 p-3 rounded-lg`}>
                <div className={`p-2 rounded-full bg-background/80 ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{stat.label}</p>
                  <p className="text-lg font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
