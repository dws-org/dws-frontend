import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const TICKET_API_URL = process.env.TICKET_API_URL || "http://dws-ticket-service-production.dws-ticket-service.svc.cluster.local:80/api/v1"
  
  // Get Authorization header from client request
  const authHeader = request.headers.get('authorization')
  
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    // Forward auth token if present
    if (authHeader) {
      headers['Authorization'] = authHeader
    }
    
    const res = await fetch(`${TICKET_API_URL}/tickets/my-tickets`, {
      cache: 'no-store',
      headers,
    })
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Failed to fetch tickets' }))
      return NextResponse.json(
        errorData,
        { status: res.status }
      )
    }
    
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Route Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    )
  }
}
