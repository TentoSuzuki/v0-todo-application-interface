"use client"

import { useState } from "react"
import { useTasks, type Task } from "./task-provider"
import { AddSubtaskForm } from "./add-subtask-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Trash2, ChevronRight, Clock, Bell, MoreVertical, Plus, Move } from "lucide-react"
import { cn } from "@/lib/utils"

interface TaskItemProps {
  task: Task
  level?: number
}

export function TaskItem({ task, level = 0 }: TaskItemProps) {
  const { tasks, toggleTask, deleteTask, moveTask } = useTasks()
  const [isExpanded, setIsExpanded] = useState(false)
  const [showAddSubtask, setShowAddSubtask] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)

  const subtasks = tasks.filter((t) => t.parentId === task.id)
  const hasSubtasks = subtasks.length > 0
  const completedSubtasks = subtasks.filter((t) => t.completed).length

  // Get potential parent tasks (excluding self and descendants)
  const potentialParents = tasks.filter((t) => !t.parentId && t.id !== task.id)

  const handleToggleTask = async () => {
    setIsCompleting(true)
    // Add a small delay for animation
    setTimeout(() => {
      toggleTask(task.id)
      setIsCompleting(false)
    }, 300)
  }

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "urgent":
        return "bg-destructive text-destructive-foreground"
      case "high":
        return "bg-primary text-primary-foreground"
      case "medium":
        return "bg-secondary text-secondary-foreground"
      case "low":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getTaskColorClass = (color?: string) => {
    if (!color) return ""

    const colorMap: Record<string, string> = {
      red: "border-l-red-500 bg-red-50 dark:bg-red-950/20",
      orange: "border-l-orange-500 bg-orange-50 dark:bg-orange-950/20",
      yellow: "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20",
      green: "border-l-green-500 bg-green-50 dark:bg-green-950/20",
      blue: "border-l-blue-500 bg-blue-50 dark:bg-blue-950/20",
      purple: "border-l-purple-500 bg-purple-50 dark:bg-purple-950/20",
      pink: "border-l-pink-500 bg-pink-50 dark:bg-pink-950/20",
      indigo: "border-l-indigo-500 bg-indigo-50 dark:bg-indigo-950/20",
      teal: "border-l-teal-500 bg-teal-50 dark:bg-teal-950/20",
      gray: "border-l-gray-500 bg-gray-50 dark:bg-gray-950/20",
    }

    return colorMap[color] || ""
  }

  const getReminderStatus = (reminder: Date) => {
    const now = new Date()
    const timeDiff = reminder.getTime() - now.getTime()
    const hoursDiff = timeDiff / (1000 * 60 * 60)

    if (timeDiff < 0) {
      return { status: "overdue", color: "bg-destructive text-destructive-foreground animate-pulse" }
    } else if (hoursDiff <= 1) {
      return { status: "urgent", color: "bg-primary text-primary-foreground" }
    } else if (hoursDiff <= 24) {
      return { status: "today", color: "bg-secondary text-secondary-foreground" }
    } else {
      return { status: "upcoming", color: "bg-muted text-muted-foreground" }
    }
  }

  const formatReminderTime = (reminder: Date) => {
    const now = new Date()
    const isToday = reminder.toDateString() === now.toDateString()
    const isTomorrow = reminder.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString()

    if (isToday) {
      return `Today ${reminder.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    } else if (isTomorrow) {
      return `Tomorrow ${reminder.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    } else {
      return `${reminder.toLocaleDateString()} ${reminder.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    }
  }

  return (
    <div className={cn("space-y-2 group", level > 0 && "ml-6")}>
      <Card
        className={cn(
          "transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-l-4 cursor-pointer",
          task.completed && "opacity-60 scale-95",
          isCompleting && "animate-pulse",
          getTaskColorClass(task.color),
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={task.completed}
                onCheckedChange={handleToggleTask}
                className="mt-1 transition-all duration-200 hover:scale-110"
              />
              {hasSubtasks && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 h-6 w-6 transition-all duration-200 hover:bg-accent"
                >
                  <div className={cn("transition-transform duration-200", isExpanded && "rotate-90")}>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </Button>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3
                    className={cn(
                      "font-medium text-sm transition-all duration-200",
                      task.completed && "line-through text-muted-foreground",
                    )}
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                  )}
                  {hasSubtasks && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 bg-muted rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${(completedSubtasks / subtasks.length) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {completedSubtasks}/{subtasks.length}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Badge
                    className={cn(
                      "text-xs transition-all duration-200 hover:scale-105",
                      getPriorityColor(task.priority),
                    )}
                  >
                    {task.priority}
                  </Badge>
                  {task.reminder && (
                    <Badge
                      className={cn(
                        "text-xs transition-all duration-200 hover:scale-105",
                        getReminderStatus(task.reminder).color,
                      )}
                    >
                      {getReminderStatus(task.reminder).status === "overdue" ? (
                        <Bell className="h-3 w-3 mr-1" />
                      ) : (
                        <Clock className="h-3 w-3 mr-1" />
                      )}
                      {formatReminderTime(task.reminder)}
                    </Badge>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 transition-all duration-200 hover:bg-accent hover:scale-110"
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="animate-in slide-in-from-top-2 duration-200">
                      <DropdownMenuItem
                        onClick={() => setShowAddSubtask(true)}
                        className="transition-colors duration-150"
                      >
                        <Plus className="h-3 w-3 mr-2" />
                        Add Subtask
                      </DropdownMenuItem>
                      {level === 0 && potentialParents.length > 0 && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => moveTask(task.id, undefined)}
                            className="transition-colors duration-150"
                          >
                            <Move className="h-3 w-3 mr-2" />
                            Make Main Task
                          </DropdownMenuItem>
                        </>
                      )}
                      {level > 0 && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => moveTask(task.id, undefined)}
                            className="transition-colors duration-150"
                          >
                            <Move className="h-3 w-3 mr-2" />
                            Move to Main Tasks
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => deleteTask(task.id)}
                        className="text-destructive transition-colors duration-150 hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-3 w-3 mr-2" />
                        Delete Task
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {task.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs transition-all duration-200 hover:scale-105 hover:bg-primary hover:text-primary-foreground"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {showAddSubtask && (
        <div className={cn("ml-6 animate-in slide-in-from-top-2 duration-300")}>
          <AddSubtaskForm
            parentId={task.id}
            onCancel={() => setShowAddSubtask(false)}
            onSuccess={() => {
              setShowAddSubtask(false)
              setIsExpanded(true)
            }}
          />
        </div>
      )}

      {hasSubtasks && isExpanded && (
        <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
          {subtasks.map((subtask) => (
            <TaskItem key={subtask.id} task={subtask} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
