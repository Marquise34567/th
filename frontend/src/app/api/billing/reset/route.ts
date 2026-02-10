import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    // Proxy to backend test reset endpoint
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8787'
    const target = `${apiBase.replace(/\/$/, '')}/billing/reset`
    const body = await request.text()
    const res = await fetch(target, {
      method: 'POST',
      headers: { 'content-type': request.headers.get('content-type') || 'application/json' },
      body,
    })

    const text = await res.text()
    const headers: Record<string,string> = {}
    const ct = res.headers.get('content-type')
    if (ct) headers['content-type'] = ct
    return new NextResponse(text, { status: res.status, headers })
  } catch (err) {
    console.error('Reset endpoint proxy error:', err)
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 })
  }
}
