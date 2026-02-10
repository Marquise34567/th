/**
 * CREATE STRIPE CHECKOUT SESSION
 * POST /api/stripe/create-checkout-session
 * 
 * Creates a Stripe Checkout Session for subscription purchase
 * Requires authenticated user and valid Stripe configuration
 * Uses real production-mode Stripe API
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Proxy checkout creation to backend so that auth and DB are handled server-side
export async function POST(request: NextRequest) {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8787'
    const target = `${apiBase.replace(/\/$/, '')}/stripe/create-checkout-session`
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
    console.error('[checkout] proxy error', err)
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 })
  }
}
