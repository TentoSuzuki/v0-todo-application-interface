"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useTasks } from "./task-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { X, Plus, Tag } from "lucide-react"

interface TagInputProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  placeholder?: string
}

export function TagInput({ selectedTags, onTagsChange, placeholder = "Add tags..." }: TagInputProps) {
  const { availableTags, addTag } = useTasks()
  const [inputValue, setInputValue] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredSuggestions = availableTags.filter(
    (tag) => tag.toLowerCase().includes(inputValue.toLowerCase()) && !selectedTags.includes(tag),
  )

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim()
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      onTagsChange([...selectedTags, trimmedTag])
      addTag(trimmedTag)
      setInputValue("")
      setShowSuggestions(false)
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      if (inputValue.trim()) {
        handleAddTag(inputValue)
      }
    } else if (e.key === "Backspace" && !inputValue && selectedTags.length > 0) {
      handleRemoveTag(selectedTags[selectedTags.length - 1])
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Tag className="h-4 w-4" />
        Tags
      </Label>

      <div className="relative">
        <div className="flex flex-wrap gap-1 p-2 border rounded-md bg-background min-h-[40px] focus-within:ring-2 focus-within:ring-ring">
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveTag(tag)}
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}

          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder={selectedTags.length === 0 ? placeholder : ""}
            className="border-0 shadow-none focus-visible:ring-0 flex-1 min-w-[120px] h-6 p-0"
          />
        </div>

        {showSuggestions && (inputValue || filteredSuggestions.length > 0) && (
          <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-popover border rounded-md shadow-md max-h-40 overflow-y-auto">
            {inputValue && !availableTags.includes(inputValue.trim()) && (
              <button
                type="button"
                onClick={() => handleAddTag(inputValue)}
                className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground flex items-center gap-2"
              >
                <Plus className="h-3 w-3" />
                Create "{inputValue.trim()}"
              </button>
            )}

            {filteredSuggestions.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleAddTag(tag)}
                className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground"
              >
                {tag}
              </button>
            ))}

            {!inputValue && filteredSuggestions.length === 0 && (
              <div className="px-3 py-2 text-muted-foreground text-sm">No tags available</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
