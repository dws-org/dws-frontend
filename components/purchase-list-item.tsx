"use client"

import { Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PurchaseListItemProps {
  id: string
  eventTitle: string
  date: string
  amount: number
  paymentMethod: string
  onView?: (id: string) => void
}

export function PurchaseListItem({ id, eventTitle, date, amount, paymentMethod, onView }: PurchaseListItemProps) {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
      data-testid={`purchase-item-${id}`}
    >
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground truncate">{eventTitle}</h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 text-sm text-muted-foreground">
          <span>{date}</span>
          <span className="hidden sm:inline">•</span>
          <span>{paymentMethod}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-lg font-bold text-foreground">€{amount.toFixed(2)}</p>
        </div>

        <div className="flex gap-2">
          {onView && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onView(id)}
              className="border-border bg-secondary text-foreground hover:bg-muted h-9 w-9"
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">Ansicht</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="icon"
            className="border-border bg-secondary text-foreground hover:bg-muted h-9 w-9"
          >
            <Download className="h-4 w-4" />
            <span className="sr-only">Herunterladen</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
