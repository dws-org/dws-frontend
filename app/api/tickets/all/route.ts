import { NextRequest, NextResponse } from 'next/server'

const TICKET_SERVICE_URL = process.env.TICKET_SERVICE_URL || 'http://dws-ticket-service-production.dws-ticket-service.svc.cluster.local'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // This endpoint should get ALL tickets (for admin/organiser view)
    // Note: You might need to add an admin endpoint in ticket-service
    const response = await fetch(`${TICKET_SERVICE_URL}/api/v1/tickets`, {
      headers: {
        'Authorization': authHeader,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Ticket service error:', response.status, errorText)
      return NextResponse.json(
        { error: 'Failed to fetch tickets' },
        { status: response.status }
      )
    }

    const tickets = await response.json()
    return NextResponse.json(tickets)
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
