import { EventCard } from "@/components/event-card"

interface Event {
  id: string
  title: string
  date: string
  city: string
  venue: string
  priceFrom: number
  image: string
  tags: string[]
  badges: string[]
}

interface EventGridProps {
  events: Event[]
  onDetailsClick: (id: string) => void
  onBuyClick: (id: string) => void
}

export function EventGrid({ events, onDetailsClick, onBuyClick }: EventGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {events.map((event) => (
        <EventCard key={event.id} {...event} onDetailsClick={onDetailsClick} onBuyClick={onBuyClick} />
      ))}
    </div>
  )
}
