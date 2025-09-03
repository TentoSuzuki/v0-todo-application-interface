"use client"

import { useTasks } from "./task-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Filter, Palette } from "lucide-react"
import { cn } from "@/lib/utils"

const COLOR_DISPLAY_MAP: Record<string, { name: string; class: string }> = {
  red: { name: "Red", class: "bg-red-500" },
  orange: { name: "Orange", class: "bg-orange-500" },
  yellow: { name: "Yellow", class: "bg-yellow-500" },
  green: { name: "Green", class: "bg-green-500" },
  blue: { name: "Blue", class: "bg-blue-500" },
  purple: { name: "Purple", class: "bg-purple-500" },
  pink: { name: "Pink", class: "bg-pink-500" },
  indigo: { name: "Indigo", class: "bg-indigo-500" },
  teal: { name: "Teal", class: "bg-teal-500" },
  gray: { name: "Gray", class: "bg-gray-500" },
}

export function TagFilter() {
  const { availableTags, availableColors, filterByTag, setFilterByTag, filterByColor, setFilterByColor, tasks } =
    useTasks()

  const getTagCount = (tag: string) => {
    return tasks.filter((task) => task.tags.includes(tag) && !task.completed).length
  }

  const getColorCount = (color: string) => {
    return tasks.filter((task) => task.color === color && !task.completed).length
  }

  const activeTasks = tasks.filter((task) => !task.completed).length
  const completedTasks = tasks.filter((task) => task.completed).length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter Tasks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Status</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterByTag === null && filterByColor === null ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setFilterByTag(null)
                setFilterByColor(null)
              }}
              className="h-8"
            >
              All ({tasks.length})
            </Button>
            <Button
              variant={filterByTag === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setFilterByTag("active")
                setFilterByColor(null)
              }}
              className="h-8"
            >
              Active ({activeTasks})
            </Button>
            <Button
              variant={filterByTag === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setFilterByTag("completed")
                setFilterByColor(null)
              }}
              className="h-8"
            >
              Completed ({completedTasks})
            </Button>
          </div>
        </div>

        {availableColors.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Palette className="h-3 w-3" />
              Colors
            </h4>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((color) => {
                const count = getColorCount(color)
                const colorInfo = COLOR_DISPLAY_MAP[color]
                return (
                  <Button
                    key={color}
                    variant={filterByColor === color ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setFilterByColor(filterByColor === color ? null : color)
                      setFilterByTag(null)
                    }}
                    className="h-8 flex items-center gap-2"
                  >
                    <div className={cn("w-3 h-3 rounded-full", colorInfo?.class)} />
                    {colorInfo?.name} ({count})
                    {filterByColor === color && (
                      <X
                        className="h-3 w-3 ml-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          setFilterByColor(null)
                        }}
                      />
                    )}
                  </Button>
                )
              })}
            </div>
          </div>
        )}

        {availableTags.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const count = getTagCount(tag)
                return (
                  <Badge
                    key={tag}
                    variant={filterByTag === tag ? "default" : "secondary"}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground flex items-center gap-1"
                    onClick={() => {
                      setFilterByTag(filterByTag === tag ? null : tag)
                      setFilterByColor(null)
                    }}
                  >
                    {tag} ({count})
                    {filterByTag === tag && (
                      <X
                        className="h-3 w-3 ml-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          setFilterByTag(null)
                        }}
                      />
                    )}
                  </Badge>
                )
              })}
            </div>
          </div>
        )}

        {(filterByTag || filterByColor) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFilterByTag(null)
              setFilterByColor(null)
            }}
            className="w-full"
          >
            Clear Filter
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
