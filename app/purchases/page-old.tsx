"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { SidebarMenu } from "@/components/sidebar-menu"
import { PurchaseListItem } from "@/components/purchase-list-item"
import Link from "next/link"
import { useState } from "react"

const mockPurchases = [
  {
    id: "p1",
    eventTitle: "Indie Night – Aurora Live",
    date: "01. Nov 2025",
    amount: 58.0,
    paymentMethod: "Visa **** 1234",
  },
  {
    id: "p2",
    eventTitle: "Open-Air Kino – Klassiker",
    date: "28. Jul 2025",
    amount: 0.0,
    paymentMethod: "Kostenlos",
  },
  {
    id: "p3",
    eventTitle: "Tech Conference 2026 Preview",
    date: "15. Okt 2025",
    amount: 199.0,
    paymentMethod: "PayPal",
  },
  {
    id: "p4",
    eventTitle: "Jazz Lounge – Smooth Evening",
    date: "05. Dez 2025",
    amount: 70.0,
    paymentMethod: "Amex **** 5678",
  },
]

export default function PurchasesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const totalSpent = mockPurchases.reduce((sum, p) => sum + p.amount, 0)

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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-lg bg-card border border-border p-4">
            <p className="text-sm text-muted-foreground mb-1">Insgesamt ausgegeben</p>
            <p className="text-2xl font-bold text-foreground">€{totalSpent.toFixed(2)}</p>
          </div>

          <div className="rounded-lg bg-card border border-border p-4">
            <p className="text-sm text-muted-foreground mb-1">Anzahl Käufe</p>
            <p className="text-2xl font-bold text-foreground">{mockPurchases.length}</p>
          </div>

          <div className="rounded-lg bg-card border border-border p-4">
            <p className="text-sm text-muted-foreground mb-1">Durchschnitt pro Kauf</p>
            <p className="text-2xl font-bold text-foreground">€{(totalSpent / mockPurchases.length).toFixed(2)}</p>
          </div>
        </div>

        {/* Purchases List */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground mb-4">Kaufhistorie</h2>

          {mockPurchases.length > 0 ? (
            mockPurchases.map((purchase) => <PurchaseListItem key={purchase.id} {...purchase} />)
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
              <p className="text-muted-foreground">Keine Käufe gefunden</p>
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
      </main>
    </div>
  )
}
