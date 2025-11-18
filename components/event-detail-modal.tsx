"use client"

import { X, Calendar, MapPin, Users, Share2, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { useState } from "react"

interface EventDetailModalProps {
  event: {
    id: string
    title: string
    date: string
    city: string
    venue: string
    priceFrom: number
    image: string
    tags: string[]
    badges: string[]
    description?: string
    capacity?: number
    availableTickets?: number
    lineup?: string[]
    location?: {
      lat: number
      lng: number
      address: string
    }
    faqs?: Array<{ question: string; answer: string }>
  }
  isOpen: boolean
  onClose: () => void
}

export function EventDetailModal({ event, isOpen, onClose }: EventDetailModalProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState("info")

  if (!isOpen) return null

  const formatDate = (dateString: string) => {
    const d = new Date(dateString)
    return d.toLocaleDateString("de-DE", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const d = new Date(dateString)
    return d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })
  }

  const isOutOfStock = (event.availableTickets || 0) <= 0

  const description =
    event.description ||
    `
Erleben Sie ein unvergessliches Event im Herzen von ${event.city}. 
${event.title} bringt die beste Unterhaltung und Atmosphäre für einen großartigen Abend. 
Mit Top-Künstlern, modernem Veranstaltungsort und erstklassigem Service erwartet Sie ein Event der Sonderklasse.
  `

  const lineup = event.lineup || ["Künstler TBA"]
  const faqs = event.faqs || [
    {
      question: "Welche Zahlungsarten werden akzeptiert?",
      answer: "Wir akzeptieren alle gängigen Kreditkarten, PayPal und weitere digitale Zahlungsmethoden.",
    },
    {
      question: "Kann ich mein Ticket stornieren?",
      answer: "Stornierungen sind bis 48 Stunden vor Event möglich. Eine Gebühr von 10% wird berechnet.",
    },
    {
      question: "Sind Getränke im Ticketpreis enthalten?",
      answer: "Nein, Getränke und Speisen können vor Ort erworben werden.",
    },
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4" onClick={onClose}>
      <div
        className="mx-auto max-w-2xl rounded-2xl bg-card border border-border shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-xl font-bold text-foreground line-clamp-1">{event.title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-foreground hover:bg-secondary">
            <X className="h-5 w-5" />
            <span className="sr-only">Modal schließen</span>
          </Button>
        </div>

        {/* Content */}
        <div className="max-h-[80vh] overflow-y-auto">
          {/* Hero Image */}
          <div className="relative h-64 overflow-hidden bg-secondary">
            <Image
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              fill
              className="object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?key=modal1"
              }}
            />
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              {event.badges.map((badge) => (
                <Badge key={badge} variant="neu">
                  {badge}
                </Badge>
              ))}
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Key Info Cards */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              <div className="rounded-lg bg-secondary p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Datum</span>
                </div>
                <p className="text-sm font-semibold text-foreground">{formatDate(event.date)}</p>
              </div>

              <div className="rounded-lg bg-secondary p-3">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Ort</span>
                </div>
                <p className="text-sm font-semibold text-foreground">{event.venue}</p>
              </div>

              <div className="rounded-lg bg-secondary p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Kapazität</span>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {event.availableTickets}/{event.capacity}
                </p>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 bg-secondary">
                <TabsTrigger value="info" className="data-[state=active]:bg-primary">
                  Info
                </TabsTrigger>
                <TabsTrigger value="lineup" className="data-[state=active]:bg-primary">
                  Line-up
                </TabsTrigger>
                <TabsTrigger value="map" className="data-[state=active]:bg-primary">
                  Karte
                </TabsTrigger>
                <TabsTrigger value="faqs" className="data-[state=active]:bg-primary">
                  FAQs
                </TabsTrigger>
              </TabsList>

              {/* Info Tab */}
              <TabsContent value="info" className="mt-4 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Beschreibung</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Genre</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-secondary text-foreground px-3 py-1.5 rounded-full border border-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg bg-secondary p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-2">Adresse</h3>
                  <p className="text-sm text-muted-foreground">
                    {event.location?.address || `${event.venue}, ${event.city}`}
                  </p>
                </div>
              </TabsContent>

              {/* Line-up Tab */}
              <TabsContent value="lineup" className="mt-4 space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Künstler</h3>
                <div className="space-y-2">
                  {lineup.map((artist, idx) => (
                    <div key={idx} className="flex items-center gap-3 rounded-lg bg-secondary p-3 border border-border">
                      <div className="h-10 w-10 rounded-full bg-primary/20" />
                      <span className="text-sm font-medium text-foreground">{artist}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Map Tab */}
              <TabsContent value="map" className="mt-4">
                <div className="rounded-lg bg-secondary h-64 flex items-center justify-center border border-border">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {event.venue}, {event.city}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Karten-Integration hier</p>
                  </div>
                </div>
              </TabsContent>

              {/* FAQs Tab */}
              <TabsContent value="faqs" className="mt-4 space-y-3">
                {faqs.map((faq, idx) => (
                  <details key={idx} className="group rounded-lg bg-secondary border border-border p-3 cursor-pointer">
                    <summary className="flex items-center justify-between font-medium text-foreground">
                      <span className="text-sm">{faq.question}</span>
                      <span className="transition-transform group-open:rotate-180">▼</span>
                    </summary>
                    <p className="mt-3 text-sm text-muted-foreground">{faq.answer}</p>
                  </details>
                ))}
              </TabsContent>
            </Tabs>

            {/* Price and CTA */}
            <div className="flex items-center justify-between pt-6 border-t border-border">
              <div>
                {event.priceFrom > 0 ? (
                  <div>
                    <p className="text-xs text-muted-foreground">Ab</p>
                    <p className="text-2xl font-bold text-foreground">€{event.priceFrom}</p>
                  </div>
                ) : (
                  <p className="text-lg font-bold text-green-400">Kostenlos</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`border-border ${
                    isFavorite ? "bg-primary/20 text-primary" : "bg-secondary text-foreground"
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                  <span className="sr-only">Zu Favoriten hinzufügen</span>
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="border-border bg-secondary text-foreground hover:bg-muted"
                >
                  <Share2 className="h-5 w-5" />
                  <span className="sr-only">Event teilen</span>
                </Button>

                <Button
                  disabled={isOutOfStock}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isOutOfStock ? "Ausverkauft" : "Jetzt kaufen"}
                </Button>
              </div>
            </div>

            {isOutOfStock && (
              <Button variant="outline" className="w-full border-border bg-secondary text-foreground hover:bg-muted">
                Zur Warteliste hinzufügen
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
