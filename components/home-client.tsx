"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import { useMemo, useState, useEffect } from "react"

import { EventDetailModal } from "@/components/event-detail-modal"
import { EventGrid } from "@/components/event-grid"
import { FilterChips } from "@/components/filter-chips"
import { Header } from "@/components/header"
import { QRCodeModal } from "@/components/qr-code-modal"
import { SidebarMenu } from "@/components/sidebar-menu"
import { TicketCard } from "@/components/ticket-card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/AuthContext"
import { TicketService, Ticket } from "@/lib/ticketService"

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

type TicketCardData = {
  id: string
  eventId: string
  eventTitle: string
  eventImage: string
  status: "Active" | "Past" | "Upcoming"
  seat: string
  date: string
}

const ticketFilters = ["Current", "Upcoming", "Past"]

// Hier empfangen wir die Events vom Server als "initialEvents"
export function HomeClient({ initialEvents }: { initialEvents: UiEvent[] }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [ticketFilter, setTicketFilter] = useState("Current")
  const [events] = useState<UiEvent[]>(initialEvents)
  const [tickets, setTickets] = useState<TicketCardData[]>([])
  const [eventsMap, setEventsMap] = useState<Record<string, any>>({})
  const [loadingTickets, setLoadingTickets] = useState(true)
  const [showAllTickets, setShowAllTickets] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const { isOrganiser, isAuthenticated } = useAuth()

  // Load user tickets
  useEffect(() => {
    if (!isAuthenticated) {
      setLoadingTickets(false)
      return
    }

    async function loadTickets() {
      try {
        const userTickets = await TicketService.getMyTickets()
        
        // Load event details for tickets
        const eventIds = [...new Set(userTickets.map(t => t.event_id))]
        const eventPromises = eventIds.map(async (eventId) => {
          try {
            const response = await fetch(`https://event.ltu-m7011e-6.se/api/events/${eventId}`)
            if (response.ok) {
              return await response.json()
            }
          } catch (err) {
            console.error(`Failed to fetch event ${eventId}:`, err)
          }
          return null
        })

        const eventResults = await Promise.all(eventPromises)
        const eventsData: Record<string, any> = {}
        
        eventResults.forEach((event) => {
          if (event) {
            eventsData[event.id] = event
          }
        })

        setEventsMap(eventsData)

        // Transform tickets to card format
        const ticketCards: TicketCardData[] = userTickets.map(ticket => {
          const event = eventsData[ticket.event_id]
          const eventDate = event?.startDate ? new Date(event.startDate) : new Date(ticket.created_at)
          const now = new Date()
          
          let status: "Active" | "Past" | "Upcoming" = "Active"
          if (eventDate < now) {
            status = "Past"
          } else if (eventDate > new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)) {
            status = "Upcoming"
          }

          return {
            id: ticket.id,
            eventId: ticket.event_id,
            eventTitle: event?.name || `Event ${ticket.event_id}`,
            eventImage: event?.imageUrl || "/placeholder.svg",
            status,
            seat: `${ticket.quantity} ${ticket.quantity === 1 ? 'Ticket' : 'Tickets'}`,
            date: eventDate.toLocaleDateString('de-DE', {
              month: 'short',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })
          }
        })

        setTickets(ticketCards)
      } catch (err) {
        console.error('Failed to load tickets:', err)
      } finally {
        setLoadingTickets(false)
      }
    }

    loadTickets()
  }, [isAuthenticated])

  const selectedEvent = events.find((e) => e.id === selectedEventId)
  const selectedTicket = tickets.find((t) => t.id === selectedTicketId)

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
    setShowAllTickets(filter === "Upcoming")
  }

  const filteredTickets = useMemo(() => {
    if (ticketFilter === "Current") {
      return tickets.filter(t => t.status === "Active")
    } else if (ticketFilter === "Upcoming") {
      return tickets.filter(t => t.status === "Upcoming")
    } else if (ticketFilter === "Past") {
      return tickets.filter(t => t.status === "Past")
    }
    return tickets
  }, [tickets, ticketFilter])

  const ticketsToDisplay = showAllTickets ? filteredTickets : filteredTickets.slice(0, 4)
  const itemsPerRow = 4
  const maxVisibleRows = 1
  const visibleTickets = showAllTickets
    ? ticketsToDisplay
    : filteredTickets.slice(0, itemsPerRow * maxVisibleRows)

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredEvents = useMemo(() => {
    if (normalizedQuery.length === 0) return events

    return events.filter((event) => {
      const haystack = [
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
            capacity:
              selectedEvent.capacity ?? selectedEvent.availableTickets ?? 0,
            availableTickets:
              selectedEvent.availableTickets ?? selectedEvent.capacity ?? 0,
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

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {isOrganiser && (
          <section className="mb-8">
            <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Bist du Veranstalter?
                </h2>
                <p className="text-muted-foreground">
                  Erstelle und verwalte deine eigenen Events
                </p>
              </div>
              <Link href="/manage">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Events verwalten
                </Button>
              </Link>
            </div>
          </section>
        )}

        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-foreground">My Tickets</h2>
            {isAuthenticated && tickets.length > 0 && (
              <Link href="/purchases">
                <Button variant="outline">Alle anzeigen</Button>
              </Link>
            )}
          </div>

          {!isAuthenticated ? (
            <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
              <p className="mb-4 text-muted-foreground">Melde dich an, um deine Tickets zu sehen</p>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Anmelden
              </Button>
            </div>
          ) : loadingTickets ? (
            <div className="rounded-2xl border border-border p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Lade Tickets...</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <FilterChips
                  filters={ticketFilters}
                  activeFilter={ticketFilter}
                  onFilterChange={handleFilterChange}
                />
              </div>

              {filteredTickets.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {visibleTickets.map((ticket) => (
                      <TicketCard
                        key={ticket.id}
                        {...ticket}
                        onOpenClick={handleOpenTicket}
                      />
                    ))}
                  </div>
                  {!showAllTickets && filteredTickets.length > visibleTickets.length && (
                    <div className="mt-6 text-center">
                      <Button
                        onClick={() => setShowAllTickets(true)}
                        variant="outline"
                        className="border-border text-foreground hover:bg-secondary"
                      >
                        Zeige mehr Tickets ({filteredTickets.length - visibleTickets.length})
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
                  <p className="mb-4 text-muted-foreground">
                    {ticketFilter === "Current" 
                      ? "Keine aktiven Tickets" 
                      : ticketFilter === "Past"
                      ? "Keine vergangenen Tickets"
                      : "Keine bevorstehenden Tickets"}
                  </p>
                  <Link href="/">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Events durchstöbern
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </section>

        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-foreground">New Events</h2>
          </div>

          {filteredEvents.length > 0 ? (
            <EventGrid
              events={filteredEvents}
              onDetailsClick={handleDetailsClick}
              onBuyClick={handleBuyClick}
            />
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
              <p className="mb-4 text-muted-foreground">No events found</p>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Discover categories
              </Button>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}