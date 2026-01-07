import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const eventId = params.id;

  try {
    // Forward request to internal event service (use HTTP internally)
    const eventServiceUrl = 'http://dws-event-service-production.dws-event-service.svc.cluster.local';
    const response = await fetch(`${eventServiceUrl}/api/events/${eventId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Event API error for ${eventId}: ${response.status}`);
      return NextResponse.json(
        { error: 'Failed to fetch event' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
