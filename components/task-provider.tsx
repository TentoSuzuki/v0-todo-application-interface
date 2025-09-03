"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: "low" | "medium" | "high" | "urgent"
  tags: string[]
  color?: string
  reminder?: Date
  subtasks: Task[]
  parentId?: string
  createdAt: Date
  updatedAt: Date
}

interface TaskContextType {
  tasks: Task[]
  availableTags: string[]
  availableColors: string[]
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void
  addSubtask: (parentId: string, task: Omit<Task, "id" | "createdAt" | "updatedAt" | "parentId">) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTask: (id: string) => void
  moveTask: (taskId: string, newParentId?: string) => void
  addTag: (tag: string) => void
  removeTag: (tag: string) => void
  filterByTag: string | null
  setFilterByTag: (tag: string | null) => void
  filterByColor: string | null
  setFilterByColor: (color: string | null) => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [filterByTag, setFilterByTag] = useState<string | null>(null)
  const [filterByColor, setFilterByColor] = useState<string | null>(null)

  const availableColors = Array.from(new Set(tasks.map((task) => task.color).filter(Boolean))) as string[]

  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    taskData.tags.forEach((tag) => {
      if (!availableTags.includes(tag)) {
        setAvailableTags((prev) => [...prev, tag])
      }
    })

    setTasks((prev) => [...prev, newTask])
  }

  const addSubtask = (parentId: string, taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "parentId">) => {
    const newSubtask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      parentId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    taskData.tags.forEach((tag) => {
      if (!availableTags.includes(tag)) {
        setAvailableTags((prev) => [...prev, tag])
      }
    })

    setTasks((prev) => [...prev, newSubtask])
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task)))

    if (updates.tags) {
      updates.tags.forEach((tag) => {
        if (!availableTags.includes(tag)) {
          setAvailableTags((prev) => [...prev, tag])
        }
      })
    }
  }

  const deleteTask = (id: string) => {
    // Also delete all subtasks
    const taskToDelete = tasks.find((task) => task.id === id)
    if (taskToDelete) {
      const subtaskIds = tasks.filter((task) => task.parentId === id).map((task) => task.id)
      setTasks((prev) => prev.filter((task) => task.id !== id && !subtaskIds.includes(task.id)))
    } else {
      setTasks((prev) => prev.filter((task) => task.id !== id))
    }
  }

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed, updatedAt: new Date() } : task)),
    )
  }

  const moveTask = (taskId: string, newParentId?: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, parentId: newParentId, updatedAt: new Date() } : task)),
    )
  }

  const addTag = (tag: string) => {
    if (!availableTags.includes(tag)) {
      setAvailableTags((prev) => [...prev, tag])
    }
  }

  const removeTag = (tag: string) => {
    setAvailableTags((prev) => prev.filter((t) => t !== tag))
    // Remove tag from all tasks
    setTasks((prev) =>
      prev.map((task) => ({
        ...task,
        tags: task.tags.filter((t) => t !== tag),
        updatedAt: new Date(),
      })),
    )
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        availableTags,
        availableColors,
        addTask,
        addSubtask,
        updateTask,
        deleteTask,
        toggleTask,
        moveTask,
        addTag,
        removeTag,
        filterByTag,
        setFilterByTag,
        filterByColor,
        setFilterByColor,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider")
  }
  return context
}
