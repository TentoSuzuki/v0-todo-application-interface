"use client"

import { useTasks } from "./task-provider"
import { TaskItem } from "./task-item"

export function TaskList() {
  const { tasks, filterByTag, filterByColor } = useTasks()

  let filteredTasks = tasks.filter((task) => !task.parentId)

  if (filterByTag === "active") {
    filteredTasks = filteredTasks.filter((task) => !task.completed)
  } else if (filterByTag === "completed") {
    filteredTasks = filteredTasks.filter((task) => task.completed)
  } else if (filterByTag && filterByTag !== "active" && filterByTag !== "completed") {
    filteredTasks = filteredTasks.filter((task) => task.tags.includes(filterByTag))
  }

  if (filterByColor) {
    filteredTasks = filteredTasks.filter((task) => task.color === filterByColor)
  }

  if (filteredTasks.length === 0) {
    const getFilterDescription = () => {
      if (filterByColor && filterByTag) {
        return `with color "${filterByColor}" and tag "${filterByTag}"`
      } else if (filterByColor) {
        return `with color "${filterByColor}"`
      } else if (filterByTag === "active") {
        return "active"
      } else if (filterByTag === "completed") {
        return "completed"
      } else if (filterByTag) {
        return `with tag "${filterByTag}"`
      } else {
        return null
      }
    }

    const filterDesc = getFilterDescription()

    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>{filterDesc ? `No tasks found ${filterDesc}.` : "No tasks yet. Add your first task to get started!"}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {filteredTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  )
}
