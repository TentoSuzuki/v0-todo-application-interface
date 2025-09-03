"use client"

import type React from "react"

import { useState } from "react"
import { useTasks } from "./task-provider"
import { TagInput } from "./tag-input"
import { ColorPicker } from "./color-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Calendar, X } from "lucide-react"

export function AddTaskForm() {
  const { addTask, tasks } = useTasks()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium")
  const [hasReminder, setHasReminder] = useState(false)
  const [reminderDate, setReminderDate] = useState("")
  const [reminderTime, setReminderTime] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedColor, setSelectedColor] = useState("")
  const [parentTaskId, setParentTaskId] = useState<string>("")

  // Get main tasks (no parent) for potential parent selection
  const mainTasks = tasks.filter((task) => !task.parentId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    let reminder: Date | undefined
    if (hasReminder && reminderDate && reminderTime) {
      reminder = new Date(`${reminderDate}T${reminderTime}`)
    }

    const taskData = {
      title: title.trim(),
      description: description.trim() || undefined,
      completed: false,
      priority,
      tags: selectedTags,
      subtasks: [],
      reminder,
      color: selectedColor || undefined,
      parentId: parentTaskId || undefined,
    }

    addTask(taskData)

    setTitle("")
    setDescription("")
    setPriority("medium")
    setHasReminder(false)
    setReminderDate("")
    setReminderTime("")
    setSelectedTags([])
    setSelectedColor("")
    setParentTaskId("")
  }

  const getCurrentDateTime = () => {
    const now = new Date()
    const date = now.toISOString().split("T")[0]
    const time = now.toTimeString().slice(0, 5)
    return { date, time }
  }

  const { date: currentDate, time: currentTime } = getCurrentDateTime()

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Task Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add task description..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">Priority</Label>
        <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {mainTasks.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="parent-task">Parent Task (optional)</Label>
          <Select value={parentTaskId} onValueChange={setParentTaskId}>
            <SelectTrigger>
              <SelectValue placeholder="Select parent task or leave as main task" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Main Task (no parent)</SelectItem>
              {mainTasks.map((task) => (
                <SelectItem key={task.id} value={task.id}>
                  {task.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <TagInput
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        placeholder="Add tags (press Enter or comma to add)"
      />

      <ColorPicker selectedColor={selectedColor} onColorChange={setSelectedColor} />

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="reminder"
            checked={hasReminder}
            onCheckedChange={(checked) => setHasReminder(checked as boolean)}
          />
          <Label htmlFor="reminder" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Set Reminder
          </Label>
        </div>

        {hasReminder && (
          <div className="space-y-3 p-3 bg-muted/50 rounded-lg border">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Reminder Date & Time</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setHasReminder(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="reminder-date" className="text-xs">
                  Date
                </Label>
                <Input
                  id="reminder-date"
                  type="date"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  min={currentDate}
                  className="text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="reminder-time" className="text-xs">
                  Time
                </Label>
                <Input
                  id="reminder-time"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <Button type="submit" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        {parentTaskId ? "Add Subtask" : "Add Task"}
      </Button>
    </form>
  )
}
