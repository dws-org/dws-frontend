"use client"

import { ArrowLeft, Loader2, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { SidebarMenu } from "@/components/sidebar-menu"
import { PurchaseListItem } from "@/components/purchase-list-item"
import Link from "next/link"
import { useState, useEffect } from "react"
import { TicketService, Ticket } from "@/lib/ticketService"
import { useAuth } from "@/lib/AuthContext"

interface Event {
  id: string
  name: string
  startDate: string
  price: number
}

interface PurchaseData {
  id: string
  eventTitle: string
  eventId: string
  date: string
  amount: number
  paymentMethod: string
  status: string
  quantity: number
}

type FilterStatus = 'all' | 'confirmed' | 'pending' | 'cancelled'

export default function PurchasesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [purchases, setPurchases] = useState<PurchaseData[]>([])
  const [filteredPurchases, setFilteredPurchases] = useState<PurchaseData[]>([])
  const [events, setEvents] = useState<Record<string, Event>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }

    loadTickets()
  }, [isAuthenticated])

  useEffect(() => {
    // Filter purchases when filter changes
    if (filterStatus === 'all') {
      setFilteredPurchases(purchases)
    } else {
      setFilteredPurchases(purchases.filter(p => p.status === filterStatus))
    }
  }, [filterStatus, purchases])

  const loadEvents = async (eventIds: string[]) => {
    try {
      // Fetch events from the events API
      const uniqueEventIds = [...new Set(eventIds)]
      const eventPromises = uniqueEventIds.map(async (eventId) => {
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
      const eventsMap: Record<string, Event> = {}
      
      eventResults.forEach((event) => {
        if (event) {
          eventsMap[event.id] = event
        }
      })

      setEvents(eventsMap)
    } catch (err) {
      console.error('Error loading events:', err)
    }
  }

  const loadTickets = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const ticketData = await TicketService.getMyTickets()
      setTickets(ticketData)

      // Load event details
      const eventIds = ticketData.map(t => t.event_id)
      await loadEvents(eventIds)

      // Transform tickets to purchase data
      const purchaseData: PurchaseData[] = ticketData.map(ticket => ({
        id: ticket.id,
        eventId: ticket.event_id,
        eventTitle: `Event ${ticket.event_id}`, // Will be updated after events load
        date: new Date(ticket.created_at).toLocaleDateString('de-DE', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        amount: ticket.total_price,
        quantity: ticket.quantity,
        paymentMethod: ticket.status === 'confirmed' ? 'Bezahlt' : 'Ausstehend',
        status: ticket.status
      }))

      setPurchases(purchaseData)
    } catch (err) {
      console.error('Error loading tickets:', err)
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Tickets')
    } finally {
      setLoading(false)
    }
  }

  // Update event titles when events are loaded
  useEffect(() => {
    if (Object.keys(events).length > 0) {
      setPurchases(prev => prev.map(p => ({
        ...p,
        eventTitle: events[p.eventId]?.name || p.eventTitle
      })))
    }
  }, [events])

  const totalSpent = filteredPurchases.reduce((sum, p) => sum + p.amount, 0)
  const totalTickets = filteredPurchases.reduce((sum, p) => sum + p.quantity, 0)

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <SidebarMenu isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-4xl">
          <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground">Bitte melde dich an, um deine Käufe zu sehen</p>
            <Link href="/login">
              <Button className="mt-4">Anmelden</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <SidebarMenu isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="border-border bg-secondary text-foreground hover:bg-muted mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zur Startseite
            </Button>
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-2">Meine Kaufverlauf</h1>
          <p className="text-muted-foreground">Verwalte und verfolge deine gekauften Tickets</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Lade Tickets...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="rounded-lg bg-destructive/10 border border-destructive p-4 mb-8">
            <p className="text-destructive font-semibold">Fehler beim Laden</p>
            <p className="text-sm text-destructive/80 mt-1">{error}</p>
            <Button 
              onClick={loadTickets} 
              variant="outline" 
              size="sm" 
              className="mt-3"
            >
              Erneut versuchen
            </Button>
          </div>
        )}

        {/* Summary Cards */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="rounded-lg bg-card border border-border p-4">
                <p className="text-sm text-muted-foreground mb-1">Insgesamt ausgegeben</p>
                <p className="text-2xl font-bold text-foreground">€{totalSpent.toFixed(2)}</p>
              </div>

              <div className="rounded-lg bg-card border border-border p-4">
                <p className="text-sm text-muted-foreground mb-1">Anzahl Tickets</p>
                <p className="text-2xl font-bold text-foreground">{totalTickets}</p>
              </div>

              <div className="rounded-lg bg-card border border-border p-4">
                <p className="text-sm text-muted-foreground mb-1">Anzahl Käufe</p>
                <p className="text-2xl font-bold text-foreground">{filteredPurchases.length}</p>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="mb-6 flex flex-wrap gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                <Filter className="h-4 w-4 mr-2" />
                Alle ({purchases.length})
              </Button>
              <Button
                variant={filterStatus === 'confirmed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('confirmed')}
              >
                Bestätigt ({purchases.filter(p => p.status === 'confirmed').length})
              </Button>
              <Button
                variant={filterStatus === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('pending')}
              >
                Ausstehend ({purchases.filter(p => p.status === 'pending').length})
              </Button>
              <Button
                variant={filterStatus === 'cancelled' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('cancelled')}
              >
                Storniert ({purchases.filter(p => p.status === 'cancelled').length})
              </Button>
            </div>

            {/* Purchases List */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Kaufhistorie {filterStatus !== 'all' && `(${filterStatus})`}
              </h2>

              {filteredPurchases.length > 0 ? (
                filteredPurchases.map((purchase) => (
                  <PurchaseListItem key={purchase.id} {...purchase} />
                ))
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
                  <p className="text-muted-foreground">
                    {filterStatus === 'all' 
                      ? 'Keine Käufe gefunden' 
                      : `Keine ${filterStatus} Tickets gefunden`}
                  </p>
                  {filterStatus !== 'all' && (
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setFilterStatus('all')}
                    >
                      Alle anzeigen
                    </Button>
                  )}
                  {purchases.length === 0 && (
                    <Link href="/">
                      <Button className="mt-4">Events durchstöbern</Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
            </div>

            {/* Footer Info */}
            <div className="mt-8 p-4 rounded-lg bg-secondary border border-border">
              <p className="text-xs text-muted-foreground">
                💡 Alle deine Rechnungen werden als PDF zum Download bereitgestellt. Du kannst sie jederzeit herunterladen
                oder per E-Mail erneut anfordern.
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
