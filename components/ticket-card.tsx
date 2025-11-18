"use client"

import { Ticket, MapPin } from "lucide-react"
import { Badge } from "@/components/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface TicketCardProps {
  id: string
  eventId: string
  eventTitle: string
  eventImage: string
  status: "Aktiv" | "Vergangen" | "Storniert"
  seat: string
  date: string
  onOpenClick: (id: string) => void
}

export function TicketCard({ id, eventId, eventTitle, eventImage, status, seat, date, onOpenClick }: TicketCardProps) {
  const statusVariant = status === "Aktiv" ? "aktiv" : status === "Vergangen" ? "vergangen" : "ausverkauft"

  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl bg-card border border-border transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
      data-testid={`ticket-card-${id}`}
    >
      {/* Hero Image */}
      <div className="relative h-32 overflow-hidden bg-secondary">
        <Image
          src={eventImage || "/placeholder.svg"}
          alt={eventTitle}
          fill
          className="object-cover"
          onError={(e) => {
            e.currentTarget.src = "/community-event.png"
          }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-semibold text-foreground">{eventTitle}</h3>
          <Badge variant={statusVariant}>{status}</Badge>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Ticket className="h-3.5 w-3.5" />
          <span>{seat}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>{date}</span>
        </div>

        <Button
          onClick={() => onOpenClick(id)}
          className="mt-3 w-full bg-primary text-primary-foreground hover:bg-primary/90"
          size="sm"
        >
          Öffnen
        </Button>
      </div>
    </div>
  )
}
