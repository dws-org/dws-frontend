import { NextResponse } from 'next/server';
import { register } from 'prom-client';

export async function GET() {
  try {
    const metrics = await register.metrics();
    return new NextResponse(metrics, {
      headers: {
        'Content-Type': register.contentType,
      },
    });
  } catch (error) {
    return new NextResponse('Error generating metrics', { status: 500 });
  }
}
