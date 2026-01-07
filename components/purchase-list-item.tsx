"use client"

import { Download, Eye, CheckCircle2, Clock, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PurchaseListItemProps {
  id: string
  eventTitle: string
  date: string
  amount: number
  paymentMethod: string
  status: string
  quantity: number
  onView?: (id: string) => void
}

export function PurchaseListItem({ id, eventTitle, date, amount, paymentMethod, status, quantity, onView }: PurchaseListItemProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'confirmed':
        return 'Bestätigt'
      case 'pending':
        return 'Ausstehend'
      case 'cancelled':
        return 'Storniert'
      default:
        return status
    }
  }

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
          <span>{quantity} {quantity === 1 ? 'Ticket' : 'Tickets'}</span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1">
            {getStatusIcon()}
            {getStatusText()}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-lg font-bold text-foreground">€{amount.toFixed(2)}</p>
          {quantity > 1 && (
            <p className="text-xs text-muted-foreground">€{(amount / quantity).toFixed(2)} pro Ticket</p>
          )}
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
