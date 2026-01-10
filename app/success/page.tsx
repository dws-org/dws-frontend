"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, ArrowRight, Home, Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)
  
  const ticketId = searchParams.get("ticketId")
  const eventName = searchParams.get("eventName")
  const quantity = searchParams.get("quantity") || "1"
  const price = searchParams.get("price") || "0"

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900 dark:from-green-950 dark:via-emerald-950 dark:to-teal-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-card border border-border rounded-3xl shadow-2xl p-8 md:p-12 text-center space-y-8">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 dark:bg-green-500/10 rounded-full blur-2xl"></div>
              <div className="relative bg-green-500/10 dark:bg-green-500/20 p-6 rounded-full">
                <CheckCircle2 className="w-20 h-20 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Ticket erfolgreich gekauft! 🎉
            </h1>
            <p className="text-lg text-muted-foreground">
              Deine Bestellung wurde erfolgreich abgeschlossen
            </p>
          </div>

          {(eventName || ticketId) && (
            <div className="bg-secondary/50 rounded-2xl p-6 space-y-4 text-left">
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <Receipt className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Bestelldetails</h2>
              </div>
              
              {eventName && (
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">Event:</span>
                  <span className="font-semibold text-foreground text-right max-w-[60%]">
                    {decodeURIComponent(eventName)}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Anzahl:</span>
                <span className="font-semibold text-foreground">{quantity} Ticket(s)</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Preis:</span>
                <span className="font-semibold text-foreground">{price} €</span>
              </div>
              
              {ticketId && (
                <div className="flex justify-between items-start pt-3 border-t border-border">
                  <span className="text-muted-foreground">Ticket-ID:</span>
                  <span className="font-mono text-xs text-foreground break-all text-right max-w-[60%]">
                    {ticketId}
                  </span>
                </div>
              )}
              
              <div className="pt-3 border-t border-border">
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    <span className="font-semibold">Status: </span>
                    Wird verarbeitet... Dein Ticket wird in wenigen Sekunden bestätigt.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 text-left space-y-2">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <span className="text-2xl">📧</span>
              Was passiert jetzt?
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Du erhältst eine Bestätigungs-E-Mail mit deinen Ticket-Details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Deine Tickets findest du unter "Meine Käufe"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Der QR-Code wird automatisch generiert</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/purchases" className="flex-1">
              <Button 
                size="lg" 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              >
                <Receipt className="w-5 h-5" />
                Meine Käufe anzeigen
                <ArrowRight className="w-5 h-5 ml-auto" />
              </Button>
            </Link>
            
            <Link href="/" className="flex-1">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full gap-2"
              >
                <Home className="w-5 h-5" />
                Zur Startseite
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground pt-4">
            Probleme mit deiner Bestellung? Kontaktiere unseren{" "}
            <a href="mailto:support@dws-events.com" className="text-primary hover:underline font-medium">
              Support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
