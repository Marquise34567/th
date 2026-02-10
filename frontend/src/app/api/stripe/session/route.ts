import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function GET(req: NextRequest) {
  try {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    const stripe = new Stripe(key, { apiVersion: '2022-11-15' as any })
    const sessionId = req.nextUrl.searchParams.get('session_id')
    if (!sessionId) return NextResponse.json({ error: 'session_id required' }, { status: 400 })

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const uid = session.metadata?.uid || null
    return NextResponse.json({ uid })
  } catch (err) {
    console.error('[session] error', err)
    return NextResponse.json({ error: 'Failed to retrieve session' }, { status: 500 })
  }
}
