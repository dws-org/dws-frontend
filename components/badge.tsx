import type React from "react"
import { cn } from "@/lib/utils"

type BadgeVariant = "neu" | "trend" | "ausverkauft" | "kostenlos" | "aktiv" | "vergangen"

const badgeStyles: Record<BadgeVariant, string> = {
  neu: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  trend: "bg-primary/20 text-primary border-primary/30",
  ausverkauft: "bg-red-500/20 text-red-300 border-red-500/30",
  kostenlos: "bg-green-500/20 text-green-300 border-green-500/30",
  aktiv: "bg-green-500/20 text-green-300 border-green-500/30",
  vergangen: "bg-gray-500/20 text-gray-300 border-gray-500/30",
}

export function Badge({ variant = "neu", children }: { variant?: BadgeVariant; children: React.ReactNode }) {
  return (
    <div className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold border", badgeStyles[variant])}>
      {children}
    </div>
  )
}
