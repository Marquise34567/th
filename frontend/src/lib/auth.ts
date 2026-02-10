/**
 * Auth Utilities
 * Server-side auth helpers for protected routes and data fetching
 */

import { redirect } from 'next/navigation'

/**
 * Server-side user lookup via backend proxy.
 * Calls NEXT_PUBLIC_API_BASE_URL/auth/me (fallback to localhost)
 */
export async function getUserServer() {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8787'
    const resp = await fetch(`${apiBase.replace(/\/$/, '')}/auth/me`, {
      method: 'GET',
      headers: { accept: 'application/json' },
      cache: 'no-store',
    })
    if (!resp.ok) return null
    const j = await resp.json().catch(() => null)
    return j?.user || null
  } catch (err) {
    console.error('[auth] Failed to get user from backend:', err)
    return null
  }
}

export async function requireUserServer(returnTo?: string) {
  const user = await getUserServer()
  if (!user) {
    const path = returnTo ? `/login?next=${encodeURIComponent(returnTo)}` : '/login'
    redirect(path)
  }
  return user
}
