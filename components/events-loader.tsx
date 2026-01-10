"use client"

import { useEffect, useState } from 'react'
import { HomeClient, type UiEvent } from '@/components/home-client'
import { useAuth } from '@/lib/AuthContext'
import keycloak from '@/lib/keycloak'

// Typ-Definition für die Rohdaten vom Backend
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

// Hilfsfunktion: Mappt Backend-Daten auf das Frontend-Format
function mapApiEventToUiEvent(event: ApiEvent, soldTickets: number = 0): UiEvent {
  const locationText = event.location || "Location to be announced"
  const [cityFromLocation] = locationText.split(",")
  const capacity = event.capacity || 0
  const available = Math.max(0, capacity - soldTickets)

  return {
    id: event.id,
    title: event.name || "Unnamed event",
    date: event.startDate || event.startTime || new Date().toISOString(),
    city: cityFromLocation?.trim() || "Location follows",
    venue: locationText,
    priceFrom: Number(event.price) || 0,
    image: event.imageUrl || "/placeholder.svg",
    tags: event.category ? [event.category] : [],
    badges: event.category ? [event.category] : [],
    description: event.description,
    capacity: capacity,
    availableTickets: available,
    lineup: [],
    location: {
      lat: 0,
      lng: 0,
      address: locationText,
    },
    faqs: [],
  }
}

export function EventsLoader() {
  const [events, setEvents] = useState<UiEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadEvents() {
      try {
        const token = keycloak?.token
        
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        }
        
        // Add auth token if available
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }
        
        const res = await fetch('/api/events', {
          headers,
          cache: 'no-store',
        })
        
        if (!res.ok) {
          console.error(`API Error: ${res.status}`)
          setError(`Failed to load events: ${res.status}`)
          setEvents([])
          setIsLoading(false)
          return
        }
        
        const data: ApiEvent[] = await res.json()
        
        if (!Array.isArray(data)) {
          console.error("API response is not an array:", data)
          setEvents([])
          setIsLoading(false)
          return
        }

        // Load event stats to calculate sold tickets
        let ticketsByEvent: Record<string, number> = {}
        try {
          const statsRes = await fetch('/api/event-stats', {
            cache: 'no-store',
          })
          if (statsRes.ok) {
            const stats: Array<{eventId: string, ticketsSold: number}> = await statsRes.json()
            ticketsByEvent = stats.reduce((acc, stat) => {
              acc[stat.eventId] = stat.ticketsSold
              return acc
            }, {} as Record<string, number>)
          }
        } catch (err) {
          console.log('Could not load event stats:', err)
        }
        
        // Map events with sold tickets info
        setEvents(data.map(event => mapApiEventToUiEvent(event, ticketsByEvent[event.id] || 0)))
      } catch (err) {
        console.error('Failed to load events:', err)
        setError('Network error')
        setEvents([])
      } finally {
        setIsLoading(false)
      }
    }
    
    // Wait a bit for keycloak to initialize
    const timer = setTimeout(() => {
      loadEvents()
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading events...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <p className="text-sm mt-2">Check console for details</p>
        </div>
      </main>
    )
  }

  return (
    <main>
      <HomeClient initialEvents={events} />
    </main>
  )
}
