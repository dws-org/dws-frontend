"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FilterChipsProps {
  filters: string[]
  activeFilter: string
  onFilterChange: (filter: string) => void
}

export function FilterChips({ filters, activeFilter, onFilterChange }: FilterChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mb-2">
      {filters.map((filter) => (
        <Button
          key={filter}
          variant={activeFilter === filter ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(filter)}
          className={cn(
            "whitespace-nowrap",
            activeFilter === filter
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border bg-card text-foreground hover:bg-secondary",
          )}
        >
          {filter}
        </Button>
      ))}
    </div>
  )
}
