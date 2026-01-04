"use client"

import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { SidebarMenu } from "@/components/sidebar-menu"
import { PurchaseListItem } from "@/components/purchase-list-item"
import Link from "next/link"
import { useState, useEffect } from "react"
import { TicketService, Ticket } from "@/lib/ticketService"
import { useAuth } from "@/lib/AuthContext"

interface PurchaseData {
  id: string
  eventTitle: string
  date: string
  amount: number
  paymentMethod: string
  status: string
}

export default function PurchasesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [purchases, setPurchases] = useState<PurchaseData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }

    loadTickets()
  }, [isAuthenticated])

  const loadTickets = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const ticketData = await TicketService.getMyTickets()
      setTickets(ticketData)

      // Transform tickets to purchase data
      const purchaseData: PurchaseData[] = ticketData.map(ticket => ({
        id: ticket.id,
        eventTitle: `Event ${ticket.event_id.substring(0, 8)}...`, // Will be enriched with event name later
        date: new Date(ticket.created_at).toLocaleDateString('de-DE', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        amount: ticket.total_price,
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

  const totalSpent = purchases.reduce((sum, p) => sum + p.amount, 0)

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
                <p className="text-sm text-muted-foreground mb-1">Anzahl Käufe</p>
                <p className="text-2xl font-bold text-foreground">{purchases.length}</p>
              </div>

              <div className="rounded-lg bg-card border border-border p-4">
                <p className="text-sm text-muted-foreground mb-1">Durchschnitt pro Kauf</p>
                <p className="text-2xl font-bold text-foreground">
                  €{purchases.length > 0 ? (totalSpent / purchases.length).toFixed(2) : '0.00'}
                </p>
              </div>
            </div>

            {/* Purchases List */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground mb-4">Kaufhistorie</h2>

              {purchases.length > 0 ? (
                purchases.map((purchase) => (
                  <PurchaseListItem key={purchase.id} {...purchase} />
                ))
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
                  <p className="text-muted-foreground">Keine Käufe gefunden</p>
                  <Link href="/">
                    <Button className="mt-4">Events durchstöbern</Button>
                  </Link>
                </div>
              )}
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
