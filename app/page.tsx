"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { EventGrid } from "@/components/event-grid"
import { TicketCard } from "@/components/ticket-card"
import { FilterChips } from "@/components/filter-chips"
import { SidebarMenu } from "@/components/sidebar-menu"
import { EventDetailModal } from "@/components/event-detail-modal"
import { QRCodeModal } from "@/components/qr-code-modal"
import { Button } from "@/components/ui/button"
import { SkeletonCard } from "@/components/skeleton-card"

// Mock data
const mockEvents = [
  {
    id: "e1",
    title: "Indie Night – Aurora Live",
    date: "2025-12-05T20:00:00Z",
    city: "Berlin",
    venue: "Huxleys",
    priceFrom: 29,
    image: "/indie.jpg",
    tags: ["Indie", "Live"],
    badges: ["NEU"],
  },
  {
    id: "e2",
    title: "Tech Conference 2026 Preview",
    date: "2026-01-20T09:00:00Z",
    city: "München",
    venue: "ICM",
    priceFrom: 199,
    image: "/tech-conference.png",
    tags: ["Tech"],
    badges: ["Trend"],
  },
  {
    id: "e3",
    title: "Open-Air Kino – Klassiker",
    date: "2025-08-15T19:30:00Z",
    city: "Hamburg",
    venue: "Stadtpark",
    priceFrom: 0,
    image: "/classic-cinema.png",
    tags: ["Film", "Outdoor"],
    badges: ["Kostenlos"],
  },
  {
    id: "e4",
    title: "Jazz Lounge – Smooth Evening",
    date: "2025-12-15T21:00:00Z",
    city: "Köln",
    venue: "Jazz Club",
    priceFrom: 35,
    image: "/jazz-music-lounge.jpg",
    tags: ["Jazz", "Musik"],
    badges: ["NEU"],
  },
]

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
  const [isLoading, setIsLoading] = useState(false)
  const [showAllTickets, setShowAllTickets] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const selectedEvent = mockEvents.find((e) => e.id === selectedEventId)
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
  const filteredEvents =
    normalizedQuery.length === 0
      ? mockEvents
      : mockEvents.filter((event) => {
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
            description: `Erleben Sie ${selectedEvent.title} - ein einzigartiges Event mit erstklassiger Unterhaltung!`,
            capacity: 500,
            availableTickets: 120,
            lineup: ["Künstler 1", "Künstler 2", "DJ XYZ"],
            location: {
              lat: 52.52,
              lng: 13.405,
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

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
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
