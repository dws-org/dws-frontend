"use client"

import { Calendar, MapPin, Euro } from "lucide-react"
import { Badge } from "@/components/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState } from "react"

interface EventCardProps {
  id: string
  title: string
  date: string
  city: string
  venue: string
  priceFrom: number
  image: string
  tags: string[]
  badges: string[]
  onDetailsClick: (id: string) => void
  onBuyClick: (id: string) => void
}

export function EventCard({
  id,
  title,
  date,
  city,
  venue,
  priceFrom,
  image,
  tags,
  badges,
  onDetailsClick,
  onBuyClick,
}: EventCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const formatDate = (dateString: string) => {
    const d = new Date(dateString)
    return d.toLocaleDateString("de-DE", { month: "short", day: "numeric" })
  }

  const formatTime = (dateString: string) => {
    const d = new Date(dateString)
    return d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col overflow-hidden rounded-2xl bg-card border border-border transition-all duration-300 hover:shadow-xl hover:shadow-primary/20"
      data-testid={`event-card-${id}`}
    >
      {/* Hero Image */}
      <div className="relative h-48 overflow-hidden bg-secondary">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "/community-event.png"
          }}
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {badges.map((badge) => (
            <Badge
              key={badge}
              variant={badge.toLowerCase() === "neu" ? "neu" : badge.toLowerCase() === "trend" ? "trend" : "kostenlos"}
            >
              {badge}
            </Badge>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Title */}
        <h3 className="line-clamp-2 text-base font-semibold text-foreground leading-tight">{title}</h3>

        {/* Date and Time */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {formatDate(date)} • {formatTime(date)}
          </span>
        </div>

        {/* Venue */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>
            {venue}, {city}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span key={tag} className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Price and CTAs */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-1">
            {priceFrom > 0 ? (
              <>
                <span className="text-xs text-muted-foreground">ab</span>
                <div className="flex items-center gap-0.5">
                  <Euro className="h-3.5 w-3.5" />
                  <span className="text-lg font-bold text-foreground">{priceFrom}</span>
                </div>
              </>
            ) : (
              <span className="text-sm font-semibold text-green-400">Kostenlos</span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDetailsClick(id)}
            className="flex-1 border-border bg-secondary text-foreground hover:bg-muted"
          >
            Details
          </Button>
          <Button
            size="sm"
            onClick={() => onBuyClick(id)}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Kaufen
          </Button>
        </div>
      </div>
    </div>
  )
}
