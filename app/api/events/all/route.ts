import { NextRequest, NextResponse } from 'next/server'

const EVENT_SERVICE_URL = process.env.EVENT_SERVICE_URL || 'http://dws-event-service-production.dws-event-service.svc.cluster.local:80'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const response = await fetch(`${EVENT_SERVICE_URL}/api/v1/events`, {
      headers: {
        'Authorization': authHeader,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Event service error:', response.status, errorText)
      return NextResponse.json(
        { error: 'Failed to fetch events' },
        { status: response.status }
      )
    }

    const events = await response.json()
    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
