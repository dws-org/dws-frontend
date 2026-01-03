import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const API_ENDPOINT = process.env.API_URL || "http://localhost:8085/api/v1/events"
  
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
    
    const res = await fetch(API_ENDPOINT, {
      cache: 'no-store',
      headers,
    })
    
    if (!res.ok) {
      return NextResponse.json(
        { error: `Backend returned ${res.status}` },
        { status: res.status }
      )
    }
    
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Route Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const API_ENDPOINT = process.env.API_URL || "http://localhost:8085/api/v1/events"
  
  const authHeader = request.headers.get('authorization')
  const body = await request.json()
  
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (authHeader) {
      headers['Authorization'] = authHeader
    }
    
    const res = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
    
    if (!res.ok) {
      return NextResponse.json(
        { error: `Backend returned ${res.status}` },
        { status: res.status }
      )
    }
    
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Route Error:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}
