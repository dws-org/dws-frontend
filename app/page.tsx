"use client"

import { useEffect, useMemo, useState } from "react"
import { Header } from "@/components/header"
import { EventGrid } from "@/components/event-grid"
import { TicketCard } from "@/components/ticket-card"
import { FilterChips } from "@/components/filter-chips"
import { SidebarMenu } from "@/components/sidebar-menu"
import { EventDetailModal } from "@/components/event-detail-modal"
import { QRCodeModal } from "@/components/qr-code-modal"
import { Button } from "@/components/ui/button"
import { SkeletonCard } from "@/components/skeleton-card"

type ApiEvent = {
  id: string
  name: string
  description?: string
  startDate?: string
  startTime?: string
  price?: string
  endDate?: string
  location?: string
  capacity?: number
  imageUrl?: string
  category?: string
  organizerId?: string
  createdAt?: string
  updatedAt?: string
}

type UiEvent = {
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

const API_BASE_URL = "http://localhost:8085/api/v1/events"

const mockTickets = [
  {
    id: "t1",
    eventId: "e1",
    eventTitle: "Indie Night – Aurora Live",
    eventImage: "/indie.jpg",
    status: "Aktiv" as const,
    seat: "Stehplatz",
    date: "05. Dez, 20:00",
  },
  {
    id: "t2",
    eventId: "e3",
    eventTitle: "Open-Air Kino – Klassiker",
    eventImage: "/classic-cinema.png",
    status: "Vergangen" as const,
    seat: "Sitz A12",
    date: "15. Aug, 19:30",
  },
]

const ticketFilters = ["Aktuell", "Demnächst", "Vergangen"]

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [ticketFilter, setTicketFilter] = useState("Aktuell")
  const [isLoadingEvents, setIsLoadingEvents] = useState(true)
  const [eventsError, setEventsError] = useState<string | null>(null)
  const [events, setEvents] = useState<UiEvent[]>([])
  const [isLoadingEventDetail, setIsLoadingEventDetail] = useState(false)
  const [eventDetailError, setEventDetailError] = useState<string | null>(null)
  const [selectedEventDetail, setSelectedEventDetail] = useState<UiEvent | null>(null)
  const [showAllTickets, setShowAllTickets] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const controller = new AbortController()

    const fetchEvents = async () => {
      try {
        setIsLoadingEvents(true)
        setEventsError(null)

        const response = await fetch(API_BASE_URL, {
          method: "GET",
          headers: { Accept: "application/json" },
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error("Events konnten nicht geladen werden.")
        }

        const data: ApiEvent[] = await response.json()
        setEvents(data.map(mapApiEventToUiEvent))
      } catch (error) {
        if ((error as Error).name === "AbortError") return
        setEventsError((error as Error).message || "Unbekannter Fehler beim Laden der Events.")
      } finally {
        setIsLoadingEvents(false)
      }
    }

    fetchEvents()

    return () => {
      controller.abort()
    }
  }, [])

  useEffect(() => {
    if (!selectedEventId) {
      setSelectedEventDetail(null)
      setEventDetailError(null)
      return
    }

    const controller = new AbortController()

    const fetchEventDetail = async () => {
      try {
        setIsLoadingEventDetail(true)
        setEventDetailError(null)

        const response = await fetch(`${API_BASE_URL}/${selectedEventId}`, {
          method: "GET",
          headers: { Accept: "application/json" },
          signal: controller.signal,
        })

        if (response.status === 404) {
          setEventDetailError("Event wurde nicht gefunden.")
          setSelectedEventDetail(null)
          return
        }

        if (!response.ok) {
          throw new Error("Event-Details konnten nicht geladen werden.")
        }

        const data: ApiEvent = await response.json()
        setSelectedEventDetail(mapApiEventToUiEvent(data))
      } catch (error) {
        if ((error as Error).name === "AbortError") return
        setEventDetailError((error as Error).message || "Unbekannter Fehler beim Laden des Events.")
      } finally {
        setIsLoadingEventDetail(false)
      }
    }

    fetchEventDetail()

    return () => controller.abort()
  }, [selectedEventId])

  const selectedEventFromList = useMemo(() => events.find((e) => e.id === selectedEventId), [events, selectedEventId])
  const selectedEvent = selectedEventDetail ?? selectedEventFromList
  const selectedTicket = mockTickets.find((t) => t.id === selectedTicketId)

  const handleDetailsClick = (id: string) => {
    setSelectedEventId(id)
  }

  const handleBuyClick = (id: string) => {
    console.log("Buy clicked for event:", id)
  }

  const handleOpenTicket = (id: string) => {
    setSelectedTicketId(id)
  }

  const handleFilterChange = (filter: string) => {
    setTicketFilter(filter)
    if (filter === "Demnächst") {
      setShowAllTickets(true)
    } else {
      setShowAllTickets(false)
    }
  }

  const ticketsToDisplay = showAllTickets ? mockTickets : mockTickets.slice(0, 4)
  const itemsPerRow = 4 // xl:grid-cols-4
  const maxVisibleRows = 1
  const visibleTickets = showAllTickets ? ticketsToDisplay : mockTickets.slice(0, itemsPerRow * maxVisibleRows)

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredEvents = useMemo(() => {
    if (normalizedQuery.length === 0) return events

    return events.filter((event) => {
      const haystack =
        [
          event.title,
          event.city,
          event.venue,
          ...event.tags,
          ...(event.badges ?? []),
        ]
          .join(" ")
          .toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [events, normalizedQuery])

  return (
    <div className="min-h-screen bg-background">
      <Header
        onMenuClick={() => setSidebarOpen(true)}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <SidebarMenu isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {selectedEvent && (
        <EventDetailModal
          event={{
            ...selectedEvent,
            description: selectedEvent.description,
            capacity: selectedEvent.capacity ?? selectedEvent.availableTickets ?? 0,
            availableTickets: selectedEvent.availableTickets ?? selectedEvent.capacity ?? 0,
            location: selectedEvent.location ?? {
              lat: 0,
              lng: 0,
              address: `${selectedEvent.venue}, ${selectedEvent.city}`,
            },
          }}
          isOpen={selectedEventId !== null}
          onClose={() => setSelectedEventId(null)}
        />
      )}

      {selectedTicket && (
        <QRCodeModal
          ticket={{
            id: selectedTicket.id,
            eventTitle: selectedTicket.eventTitle,
            seat: selectedTicket.seat,
            date: selectedTicket.date,
            qrCode: selectedTicket.id,
          }}
          isOpen={selectedTicketId !== null}
          onClose={() => setSelectedTicketId(null)}
        />
      )}

      <main className="mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl">
        {isLoadingEventDetail && selectedEventId && (
          <div className="mb-6 rounded-2xl border border-border bg-secondary/50 p-4 text-sm text-muted-foreground">
            Eventdetails werden geladen...
          </div>
        )}

        {eventDetailError && (
          <div className="mb-6 rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {eventDetailError}
          </div>
        )}

        {/* My Tickets Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-foreground">Meine Tickets</h2>
          </div>

          <div className="mb-6">
            <FilterChips filters={ticketFilters} activeFilter={ticketFilter} onFilterChange={handleFilterChange} />
          </div>

          {mockTickets.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {visibleTickets.map((ticket) => (
                  <TicketCard key={ticket.id} {...ticket} onOpenClick={handleOpenTicket} />
                ))}
              </div>
              {!showAllTickets && mockTickets.length > visibleTickets.length && (
                <div className="mt-6 text-center">
                  <Button
                    onClick={() => setShowAllTickets(true)}
                    variant="outline"
                    className="border-border text-foreground hover:bg-secondary"
                  >
                    Mehr Tickets anzeigen ({mockTickets.length - visibleTickets.length})
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
              <p className="text-muted-foreground mb-4">Keine Tickets gefunden</p>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Jetzt Event finden</Button>
            </div>
          )}
        </section>

        {/* New Events Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-foreground">Neue Events</h2>
          </div>

          {isLoadingEvents ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : eventsError ? (
            <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-6 text-center">
              <p className="text-destructive font-medium mb-2">{eventsError}</p>
              <p className="text-sm text-muted-foreground">Bitte versuche es später erneut.</p>
            </div>
          ) : filteredEvents.length > 0 ? (
            <EventGrid events={filteredEvents} onDetailsClick={handleDetailsClick} onBuyClick={handleBuyClick} />
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
              <p className="text-muted-foreground mb-4">Keine Events gefunden</p>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Kategorien entdecken</Button>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

function mapApiEventToUiEvent(event: ApiEvent): UiEvent {
  const locationText = event.location || "Ort wird bekanntgegeben"
  const [cityFromLocation] = locationText.split(",")

  return {
    id: event.id,
    title: event.name || "Unbenanntes Event",
    date: event.startDate || event.startTime || new Date().toISOString(),
    city: cityFromLocation?.trim() || "Ort folgt",
    venue: locationText,
    priceFrom: Number(event.price) || 0,
    image: event.imageUrl || "/placeholder.svg",
    tags: event.category ? [event.category] : [],
    badges: event.category ? [event.category] : [],
    description: event.description,
    capacity: event.capacity,
    availableTickets: event.capacity,
    lineup: [],
    location: {
      lat: 0,
      lng: 0,
      address: locationText,
    },
    faqs: [],
  }
}
