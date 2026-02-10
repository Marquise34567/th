import { NextResponse } from 'next/server'

export async function GET() {
  const backend = process.env.NEXT_PUBLIC_API_URL || ''
  const url = `${backend.replace(/\/$/, '')}/api/health`

  try {
    const res = await fetch(url, { cache: 'no-store' })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    return NextResponse.json({ ok: false, error: 'proxy_error' }, { status: 502 })
  }
}
