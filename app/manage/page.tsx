"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, ArrowLeft } from "lucide-react"
import { ManagedEventCard } from "@/components/managed-event-card"
import { CreateEventModal } from "@/components/create-event-modal"
import { useAuth } from "@/lib/AuthContext"
import keycloak from "@/lib/keycloak"
import { useRouter } from "next/navigation"

export default function ManageEventsPage() {
  const { isOrganiser, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
      return
    }
    if (!isOrganiser) {
      alert('Zugriff verweigert: Du benötigst die Organiser-Rolle')
      router.push('/')
      return
    }
    loadEvents()
  }, [isAuthenticated, isOrganiser, router])

  const loadEvents = async () => {
    try {
      const token = keycloak?.token
      if (!token) return

      // Load all events
      const eventsResponse = await fetch('/api/events/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!eventsResponse.ok) {
        console.error('Failed to load events')
        return
      }

      const allEvents = await eventsResponse.json()

      // Load all tickets to calculate ticketsSold
      const ticketsResponse = await fetch('/api/tickets/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      let ticketsByEvent: Record<string, number> = {}
      if (ticketsResponse.ok) {
        const allTickets = await ticketsResponse.json()
        // Count confirmed tickets per event
        ticketsByEvent = allTickets
          .filter((t: any) => t.status === 'confirmed')
          .reduce((acc: Record<string, number>, ticket: any) => {
            acc[ticket.eventId] = (acc[ticket.eventId] || 0) + ticket.quantity
            return acc
          }, {})
      }
      
      // Transform events to match component format
      const transformedEvents = allEvents.map((event: any) => ({
        id: event.id,
        title: event.name,
        date: new Date(event.startDate).toLocaleDateString("de-DE", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        time: new Date(event.startTime).toLocaleTimeString("de-DE", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        location: event.location,
        image: event.imageUrl || '/placeholder.svg',
        price: `${event.price} €`,
        status: "published" as const,
        ticketsSold: ticketsByEvent[event.id] || 0,
        totalTickets: event.capacity,
      }))

      setEvents(transformedEvents)
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEvent = async (newEvent: any) => {
    try {
      const token = keycloak?.token
      if (!token) {
        alert('Bitte melde dich erneut an')
        return
      }

      // Format data for backend API
      const eventData = {
        name: newEvent.title,
        description: newEvent.description,
        startDate: new Date(newEvent.date + 'T00:00:00Z').toISOString(),
        startTime: new Date(newEvent.date + 'T' + newEvent.time + ':00Z').toISOString(),
        endDate: new Date(newEvent.date + 'T23:59:59Z').toISOString(),
        location: newEvent.location,
        price: newEvent.price,
        capacity: parseInt(newEvent.totalTickets),
        imageUrl: newEvent.image || '/placeholder.svg',
        category: newEvent.category || 'general',
        organizerId: 'org-001', // TODO: Get from user profile
      }

      const response = await fetch('/api/events/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || 'Failed to create event')
      }

      const createdEvent = await response.json()
      
      // Add to local state
      const event = {
        id: createdEvent.id,
        title: createdEvent.name,
        date: new Date(createdEvent.startDate).toLocaleDateString("de-DE", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        time: new Date(createdEvent.startTime).toLocaleTimeString("de-DE", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        location: createdEvent.location,
        image: createdEvent.imageUrl,
        price: `${createdEvent.price} €`,
        status: "published" as const,
        ticketsSold: 0,
        totalTickets: createdEvent.capacity,
      }
      // Reload events from backend to get fresh data
      await loadEvents()
      alert('Event erfolgreich erstellt!')
    } catch (error) {
      console.error('Error creating event:', error)
      alert(`Fehler beim Erstellen: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleDeleteEvent = (id: string) => {
    if (confirm("Möchtest du dieses Event wirklich löschen?")) {
      setEvents(events.filter((e) => e.id !== id))
    }
  }

  const handleEditEvent = (id: string) => {
    alert(`Event bearbeiten: ${id}`)
  }

  const handleViewEvent = (id: string) => {
    alert(`Event ansehen: ${id}`)
  }

  if (!isAuthenticated || !isOrganiser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Zugriff verweigert...</p>
      </div>
    )
  }

  const publishedEvents = events.filter((e) => e.status === "published")
  const draftEvents = events.filter((e) => e.status === "draft")
  const endedEvents = events.filter((e) => e.status === "ended")

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Zurück zur Startseite
        </Link>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Events verwalten</h1>
            <p className="mt-1 text-muted-foreground">Erstelle und verwalte deine Events</p>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-5 w-5" />
            Event erstellen
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="text-sm text-muted-foreground">Veröffentlicht</div>
            <div className="mt-2 text-3xl font-bold text-foreground">{publishedEvents.length}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="text-sm text-muted-foreground">Entwürfe</div>
            <div className="mt-2 text-3xl font-bold text-foreground">{draftEvents.length}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="text-sm text-muted-foreground">Beendet</div>
            <div className="mt-2 text-3xl font-bold text-foreground">{endedEvents.length}</div>
          </div>
        </div>

        {/* Published Events */}
        {publishedEvents.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-xl font-semibold text-foreground">Veröffentlichte Events</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {publishedEvents.map((event) => (
                <ManagedEventCard
                  key={event.id}
                  {...event}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                  onView={handleViewEvent}
                />
              ))}
            </div>
          </section>
        )}

        {/* Draft Events */}
        {draftEvents.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-xl font-semibold text-foreground">Entwürfe</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {draftEvents.map((event) => (
                <ManagedEventCard
                  key={event.id}
                  {...event}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                  onView={handleViewEvent}
                />
              ))}
            </div>
          </section>
        )}

        {/* Ended Events */}
        {endedEvents.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-semibold text-foreground">Beendete Events</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {endedEvents.map((event) => (
                <ManagedEventCard
                  key={event.id}
                  {...event}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                  onView={handleViewEvent}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {events.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground">Noch keine Events erstellt</h3>
              <p className="mt-2 text-muted-foreground">Erstelle dein erstes Event und beginne Tickets zu verkaufen.</p>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-5 w-5" />
                Erstes Event erstellen
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateEvent}
      />
    </div>
  )
}