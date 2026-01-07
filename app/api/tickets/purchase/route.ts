import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const TICKET_API_URL = process.env.TICKET_API_URL || "http://dws-ticket-service-production.dws-ticket-service.svc.cluster.local:80/api/v1"
  
  // Get Authorization header from client request
  const authHeader = request.headers.get('authorization')
  
  console.log('[Purchase API] Request received', {
    hasAuth: !!authHeader,
    authPreview: authHeader ? authHeader.substring(0, 20) + '...' : 'none'
  })
  
  try {
    const body = await request.json()
    console.log('[Purchase API] Body:', body)
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    // Forward auth token if present
    if (authHeader) {
      headers['Authorization'] = authHeader
    }
    
    const res = await fetch(`${TICKET_API_URL}/tickets/purchase`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Purchase failed' }))
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
      { error: 'Failed to purchase ticket' },
      { status: 500 }
    )
  }
}
