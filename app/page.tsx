"use client"
import { TaskList } from "@/components/task-list"
import { AddTaskForm } from "@/components/add-task-form"
import { TaskProvider } from "@/components/task-provider"
import { ReminderNotifications } from "@/components/reminder-notifications"
import { TagFilter } from "@/components/tag-filter"
import { TaskStats } from "@/components/task-stats"
import { QuickActions } from "@/components/quick-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useState, useEffect } from "react"

export default function TodoApp() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark")
    setIsDark(!isDark)
  }

  return (
    <TaskProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 transition-all duration-500">
        <div className="mx-auto max-w-7xl p-4">
          <header className="mb-8 text-center relative">
            <div className="absolute top-0 right-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="transition-all duration-200 hover:scale-110"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
            <div className="animate-in fade-in slide-in-from-top-4 duration-700">
              <h1 className="text-5xl font-bold text-foreground mb-3 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient">
                Task Manager
              </h1>
              <p className="text-muted-foreground text-lg">Organize your tasks with priorities, reminders, and tags</p>
            </div>
          </header>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <ReminderNotifications />
          </div>

          <div className="grid gap-6 lg:grid-cols-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <div className="lg:col-span-7 space-y-6">
              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Your Tasks
                    <div className="text-sm font-normal text-muted-foreground">Stay organized</div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TaskList />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <div className="animate-in fade-in slide-in-from-right-4 duration-700 delay-400">
                <TaskStats />
              </div>

              <div className="animate-in fade-in slide-in-from-right-4 duration-700 delay-500">
                <QuickActions />
              </div>

              <Card className="transition-all duration-300 hover:shadow-lg animate-in fade-in slide-in-from-right-4 duration-700 delay-600">
                <CardHeader>
                  <CardTitle>Add New Task</CardTitle>
                </CardHeader>
                <CardContent>
                  <AddTaskForm />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 animate-in fade-in slide-in-from-right-4 duration-700 delay-700">
              <TagFilter />
            </div>
          </div>
        </div>
      </div>
    </TaskProvider>
  )
}
