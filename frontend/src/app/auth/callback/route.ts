import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Proxy OAuth callback to backend auth callback handler.
 */
export async function GET(request: NextRequest) {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8787'
    const target = `${apiBase.replace(/\/$/, '')}/auth/callback${new URL(request.url).search}`
    const res = await fetch(target, { method: 'GET', redirect: 'manual' })
    if (res.status >= 300 && res.status < 400) {
      // forward redirect
      const loc = res.headers.get('location') || '/'
      return NextResponse.redirect(new URL(loc, request.url))
    }
    const body = await res.text()
    return new NextResponse(body, { status: res.status })
  } catch (err) {
    console.error('[auth:callback] proxy error', err)
    return NextResponse.redirect(new URL('/login?error=auth', request.url))
  }
}
