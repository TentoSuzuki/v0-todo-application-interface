"use client"

import type React from "react"

import { useState } from "react"
import { useTasks } from "./task-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Zap, Plus, Search, Filter } from "lucide-react"

export function QuickActions() {
  const { addTask, tasks, setFilterByTag } = useTasks()
  const [quickTaskTitle, setQuickTaskTitle] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!quickTaskTitle.trim()) return

    addTask({
      title: quickTaskTitle.trim(),
      completed: false,
      priority: "medium",
      tags: [],
      subtasks: [],
    })

    setQuickTaskTitle("")
  }

  const recentTags = Array.from(new Set(tasks.flatMap((task) => task.tags))).slice(0, 4)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Zap className="h-4 w-4" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleQuickAdd} className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={quickTaskTitle}
              onChange={(e) => setQuickTaskTitle(e.target.value)}
              placeholder="Quick add task..."
              className="flex-1 h-8 text-sm"
            />
            <Button type="submit" size="sm" className="h-8 px-3">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </form>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Search className="h-3 w-3 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="flex-1 h-8 text-sm"
            />
          </div>
        </div>

        {recentTags.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Filter className="h-3 w-3" />
              Quick Filters
            </p>
            <div className="flex flex-wrap gap-1">
              {recentTags.map((tag) => (
                <Button
                  key={tag}
                  variant="outline"
                  size="sm"
                  onClick={() => setFilterByTag(tag)}
                  className="h-6 text-xs px-2 transition-all duration-200 hover:scale-105"
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
