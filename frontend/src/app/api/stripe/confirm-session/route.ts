/**
 * CONFIRM STRIPE CHECKOUT SESSION
 * POST /api/stripe/confirm-session
 * 
 * Confirms a Stripe Checkout Session after successful payment
 * Records subscription in Supabase with 'pending' or 'active' status
 * based on billing mode configuration
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Proxy this request to the backend so billing/storage remains backend-only.
export async function POST(request: NextRequest) {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8787'
    const target = `${apiBase.replace(/\/$/, '')}/stripe/confirm-session`
    const body = await request.text()
    const res = await fetch(target, {
      method: 'POST',
      headers: { 'content-type': request.headers.get('content-type') || 'application/json' },
      body,
      redirect: 'manual',
    })

    const text = await res.text()
    const headers: Record<string,string> = {}
    const ct = res.headers.get('content-type')
    if (ct) headers['content-type'] = ct
    return new NextResponse(text, { status: res.status, headers })
  } catch (err) {
    console.error('[confirm-session] proxy error', err)
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 })
  }
}
