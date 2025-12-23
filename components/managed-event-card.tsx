"use client"

import { Calendar, MapPin, Users, Edit, Trash2, Eye, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ManagedEventCardProps {
  id: string
  title: string
  date: string
  time: string
  location: string
  image: string
  price: string
  status: "published" | "draft" | "ended"
  ticketsSold: number
  totalTickets: number
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onView: (id: string) => void
}

export function ManagedEventCard({
  id,
  title,
  date,
  time,
  location,
  image,
  price,
  status,
  ticketsSold,
  totalTickets,
  onEdit,
  onDelete,
  onView,
}: ManagedEventCardProps) {
  const statusColors = {
    published: "bg-green-500/20 text-green-400 border-green-500/30",
    draft: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    ended: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  }

  const statusLabels = {
    published: "Veröffentlicht",
    draft: "Entwurf",
    ended: "Beendet",
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

        {/* Status Badge */}
        <Badge className={`absolute left-3 top-3 ${statusColors[status]}`}>{statusLabels[status]}</Badge>

        {/* Actions Menu */}
        <div className="absolute right-3 top-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onView(id)}>
                <Eye className="mr-2 h-4 w-4" />
                Ansehen
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(id)}>
                <Edit className="mr-2 h-4 w-4" />
                Bearbeiten
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(id)} className="text-red-400">
                <Trash2 className="mr-2 h-4 w-4" />
                Löschen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-3 text-lg font-semibold text-foreground line-clamp-2">{title}</h3>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>
              {date} • {time}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 flex-shrink-0" />
            <span>
              {ticketsSold} / {totalTickets} Tickets verkauft
            </span>
          </div>
        </div>

        {/* Price and Progress */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-primary">{price}</span>
          <span className="text-sm text-muted-foreground">{Math.round((ticketsSold / totalTickets) * 100)}%</span>
        </div>

        {/* Progress Bar */}
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${(ticketsSold / totalTickets) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
