import { NextResponse } from 'next/server'
import { getBillingConfig } from '@/lib/billing/config'

/**
 * MANUAL BILLING ACTIVATION (TESTING ONLY)
 * POST /api/billing/manual-activate
 * 
 * Manually activates a subscription for testing purposes
 * Requires admin key authentication
 * Only enabled when BILLING_TEST_ALLOW_MANUAL_ACTIVATE=true
 * 
 * Headers:
 *   x-admin-key: Admin secret key (BILLING_ADMIN_KEY)
 * 
 * Body:
 *   { user_id: string, plan: "starter" | "creator" | "studio" }
 */
export async function POST(request: Request) {
  try {
    const billingConfig = getBillingConfig();

    // Check if manual activation is allowed
    if (!billingConfig.testAllowManualActivate) {
      return NextResponse.json(
        { error: 'Manual activation is disabled. Set BILLING_TEST_ALLOW_MANUAL_ACTIVATE=true' },
        { status: 403 }
      )
    }

    // Verify admin key
    const adminKey = request.headers.get('x-admin-key');
    if (!adminKey || !billingConfig.adminKey || adminKey !== billingConfig.adminKey) {
      console.error('[manual-activate] Invalid admin key');
      return NextResponse.json(
        { error: 'Invalid admin key' },
        { status: 401 }
      )
    }

    // Parse request body
    const { user_id, plan } = await request.json();

    if (!user_id || typeof user_id !== 'string') {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      )
    }

    if (!plan || !['free', 'starter', 'creator', 'studio'].includes(plan)) {
      return NextResponse.json(
        { error: 'Valid plan is required (free, starter, creator, or studio)' },
        { status: 400 }
      )
    }

    console.log('[manual-activate] Activating subscription:', {
      userId: user_id,
      plan,
      mode: billingConfig.mode,
    });

    // Proxy manual activation to backend which owns billing state
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8787'
    const target = `${apiBase.replace(/\/$/, '')}/billing/manual-activate`
    const res = await fetch(target, {
      method: 'POST',
      headers: { 'content-type': request.headers.get('content-type') || 'application/json', 'x-admin-key': request.headers.get('x-admin-key') || '' },
      body: JSON.stringify({ user_id, plan }),
    })

    const text = await res.text()
    const headers: Record<string,string> = {}
    const ct = res.headers.get('content-type')
    if (ct) headers['content-type'] = ct
    return new NextResponse(text, { status: res.status, headers })
  } catch (error) {
    console.error('[manual-activate] Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to activate subscription';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
