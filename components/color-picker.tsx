"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Palette, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface ColorPickerProps {
  selectedColor?: string
  onColorChange: (color: string) => void
}

const TASK_COLORS = [
  { name: "Default", value: "", class: "bg-card border-2 border-border" },
  { name: "Red", value: "red", class: "bg-red-500" },
  { name: "Orange", value: "orange", class: "bg-orange-500" },
  { name: "Yellow", value: "yellow", class: "bg-yellow-500" },
  { name: "Green", value: "green", class: "bg-green-500" },
  { name: "Blue", value: "blue", class: "bg-blue-500" },
  { name: "Purple", value: "purple", class: "bg-purple-500" },
  { name: "Pink", value: "pink", class: "bg-pink-500" },
  { name: "Indigo", value: "indigo", class: "bg-indigo-500" },
  { name: "Teal", value: "teal", class: "bg-teal-500" },
  { name: "Gray", value: "gray", class: "bg-gray-500" },
]

export function ColorPicker({ selectedColor = "", onColorChange }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Palette className="h-4 w-4" />
        Task Color
      </Label>
      <div className="grid grid-cols-6 gap-2">
        {TASK_COLORS.map((color) => (
          <Button
            key={color.value}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onColorChange(color.value)}
            className={cn(
              "h-8 w-8 p-0 rounded-full border-2 hover:scale-110 transition-transform",
              color.class,
              selectedColor === color.value && "ring-2 ring-ring ring-offset-2",
            )}
            title={color.name}
          >
            {selectedColor === color.value && <Check className="h-3 w-3 text-white drop-shadow-sm" />}
          </Button>
        ))}
      </div>
    </div>
  )
}
