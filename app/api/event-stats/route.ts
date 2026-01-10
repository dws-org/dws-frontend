import { NextRequest, NextResponse } from 'next/server'

const TICKET_SERVICE_URL = process.env.TICKET_SERVICE_URL || 'http://dws-ticket-service-production.dws-ticket-service.svc.cluster.local:80'

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${TICKET_SERVICE_URL}/api/v1/event-stats`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Ticket service error:', response.status, errorText)
      return NextResponse.json(
        { error: 'Failed to fetch event stats' },
        { status: response.status }
      )
    }

    const stats = await response.json()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching event stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
