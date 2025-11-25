"use client"

import { useMemo, useState } from "react"
import { Header } from "@/components/header"
import { EventGrid } from "@/components/event-grid"
import { TicketCard } from "@/components/ticket-card"
import { FilterChips } from "@/components/filter-chips"
import { SidebarMenu } from "@/components/sidebar-menu"
import { EventDetailModal } from "@/components/event-detail-modal"
import { QRCodeModal } from "@/components/qr-code-modal"
import { Button } from "@/components/ui/button"

// Wir definieren den Typ hier, damit wir ihn nutzen können
export type UiEvent = {
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

const mockTickets = [
  {
    id: "t1",
    eventId: "e1",
    eventTitle: "Indie Night – Aurora Live",
    eventImage: "/indie.jpg",
    status: "Active" as const,
    seat: "Standing",
    date: "Dec 05, 20:00",
  },
  {
    id: "t2",
    eventId: "e3",
    eventTitle: "Open-Air Kino – Klassiker",
    eventImage: "/classic-cinema.png",
    status: "Past" as const,
    seat: "Seat A12",
    date: "Aug 15, 19:30",
  },
]

const ticketFilters = ["Current", "Upcoming", "Past"]

// Hier empfangen wir die Events vom Server als "initialEvents"
export function HomeClient({ initialEvents }: { initialEvents: UiEvent[] }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [ticketFilter, setTicketFilter] = useState("Current")
  
  // Wir nutzen direkt die Daten vom Server
  const [events] = useState<UiEvent[]>(initialEvents)
  
  const [showAllTickets, setShowAllTickets] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Die useEffects zum Laden (fetch) sind hier WEG, weil der Server das schon erledigt hat!

  const selectedEvent = events.find((e) => e.id === selectedEventId)
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
    if (filter === "Upcoming") {
      setShowAllTickets(true)
    } else {
      setShowAllTickets(false)
    }
  }

  const ticketsToDisplay = showAllTickets ? mockTickets : mockTickets.slice(0, 4)
  const itemsPerRow = 4 
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
        {/* My Tickets Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-foreground">My Tickets</h2>
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
                    Show more tickets ({mockTickets.length - visibleTickets.length})
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
              <p className="text-muted-foreground mb-4">No tickets found</p>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Find event now</Button>
            </div>
          )}
        </section>

        {/* New Events Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-foreground">New Events</h2>
          </div>

          {filteredEvents.length > 0 ? (
            <EventGrid events={filteredEvents} onDetailsClick={handleDetailsClick} onBuyClick={handleBuyClick} />
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
              <p className="text-muted-foreground mb-4">No events found</p>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Discover categories</Button>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}