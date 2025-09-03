"use client"

import type React from "react"

import { useState } from "react"
import { useTasks } from "./task-provider"
import { TagInput } from "./tag-input"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Calendar, X } from "lucide-react"

interface AddSubtaskFormProps {
  parentId: string
  onCancel: () => void
  onSuccess: () => void
}

export function AddSubtaskForm({ parentId, onCancel, onSuccess }: AddSubtaskFormProps) {
  const { addSubtask } = useTasks()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium")
  const [hasReminder, setHasReminder] = useState(false)
  const [reminderDate, setReminderDate] = useState("")
  const [reminderTime, setReminderTime] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedColor, setSelectedColor] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    let reminder: Date | undefined
    if (hasReminder && reminderDate && reminderTime) {
      reminder = new Date(`${reminderDate}T${reminderTime}`)
    }

    addSubtask(parentId, {
      title: title.trim(),
      description: description.trim() || undefined,
      completed: false,
      priority,
      tags: selectedTags,
      subtasks: [],
      reminder,
      color: selectedColor || undefined,
    })

    onSuccess()
  }

  const getCurrentDateTime = () => {
    const now = new Date()
    const date = now.toISOString().split("T")[0]
    const time = now.toTimeString().slice(0, 5)
    return { date, time }
  }

  const { date: currentDate } = getCurrentDateTime()

  return (
    <div className="border rounded-lg p-4 bg-muted/30 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">Add Subtask</h4>
        <Button variant="ghost" size="sm" onClick={onCancel} className="h-6 w-6 p-0">
          <X className="h-3 w-3" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="subtask-title" className="text-xs">
            Title
          </Label>
          <Input
            id="subtask-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter subtask title..."
            className="h-8 text-sm"
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="subtask-description" className="text-xs">
            Description (optional)
          </Label>
          <Textarea
            id="subtask-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add description..."
            rows={2}
            className="text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor="subtask-priority" className="text-xs">
              Priority
            </Label>
            <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
              <SelectTrigger className="h-8 text-sm">
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

          <div className="space-y-1">
            <Label className="text-xs">Color</Label>
            <div className="flex gap-1">
              {["", "red", "blue", "green", "yellow", "purple"].map((color) => (
                <Button
                  key={color}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedColor(color)}
                  className={`h-6 w-6 p-0 rounded-full border ${
                    color ? `bg-${color}-500 hover:bg-${color}-600` : "bg-card border-2 border-border hover:bg-muted"
                  } ${selectedColor === color ? "ring-2 ring-ring" : ""}`}
                />
              ))}
            </div>
          </div>
        </div>

        <TagInput selectedTags={selectedTags} onTagsChange={setSelectedTags} placeholder="Add tags..." />

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="subtask-reminder"
              checked={hasReminder}
              onCheckedChange={(checked) => setHasReminder(checked as boolean)}
            />
            <Label htmlFor="subtask-reminder" className="flex items-center gap-1 text-xs">
              <Calendar className="h-3 w-3" />
              Set Reminder
            </Label>
          </div>

          {hasReminder && (
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                min={currentDate}
                className="h-8 text-xs"
              />
              <Input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button type="submit" size="sm" className="flex-1">
            <Plus className="h-3 w-3 mr-1" />
            Add Subtask
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
