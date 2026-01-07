import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { eventIds } = await request.json();

    if (!Array.isArray(eventIds) || eventIds.length === 0) {
      return NextResponse.json({ error: 'Invalid event IDs' }, { status: 400 });
    }

    // Get all events from the event service
    const eventServiceUrl = 'http://dws-event-service-production.dws-event-service.svc.cluster.local';
    const response = await fetch(`${eventServiceUrl}/api/v1/events`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Event API error: ${response.status}`);
      return NextResponse.json(
        { error: 'Failed to fetch events' },
        { status: response.status }
      );
    }

    const allEvents = await response.json();
    
    // Filter to only requested event IDs
    const requestedEvents = allEvents.filter((event: any) => 
      eventIds.includes(event.id)
    );

    // Return as a map for easier lookup
    const eventsMap = requestedEvents.reduce((acc: any, event: any) => {
      acc[event.id] = event;
      return acc;
    }, {});

    return NextResponse.json(eventsMap);
  } catch (error) {
    console.error('Error fetching event details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
