// dws-frontend/app/page.tsx

import { HomeClient, type UiEvent } from "@/components/home-client"

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
function mapApiEventToUiEvent(event: ApiEvent): UiEvent {
  const locationText = event.location || "Location to be announced"
  const [cityFromLocation] = locationText.split(",")

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
    capacity: event.capacity,
    availableTickets: event.capacity, // Annahme: Capacity = Available wenn nicht anders angegeben
    lineup: [], // Backend liefert aktuell kein Lineup, daher leer
    location: {
      lat: 0, // Geodaten fehlen im Backend-Typ aktuell
      lng: 0,
      address: locationText,
    },
    faqs: [],
  }
}

// Server-Side Data Fetching
async function getEvents(): Promise<UiEvent[]> {
  // WICHTIG: Die URL muss innerhalb der Funktion ermittelt werden, damit
  // sie zur Laufzeit aus den Pod-Environment-Variables gelesen wird.
  // Fallback auf localhost nur für lokale Entwicklung ohne Docker.
  const API_ENDPOINT = process.env.API_URL || "http://localhost:8085/api/v1/events"
  
  console.log(`Fetching events from: ${API_ENDPOINT}`)

  try {
    const res = await fetch(API_ENDPOINT, { 
      cache: 'no-store', // Kein Caching, damit Daten immer aktuell sind
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!res.ok) {
      console.error(`Backend Error: ${res.status} ${res.statusText}`)
      return []
    }
    
    const data: ApiEvent[] = await res.json()
    
    if (!Array.isArray(data)) {
      console.error("API response is not an array:", data)
      return []
    }

    return data.map(mapApiEventToUiEvent)
  } catch (error) {
    console.error('Network/Fetch Error:', error)
    return []
  }
}

// Hauptkomponente (Server Component)
export default async function Home() {
  const events = await getEvents()
  
  return (
    <main>
      <HomeClient initialEvents={events} />
    </main>
  )
}