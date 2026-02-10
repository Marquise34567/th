/**
 * DEBUG SESSION ENDPOINT
 * GET /api/me
 * 
 * Returns current user session status for debugging
 * Uses Supabase SSR with proper cookie handling
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ signedIn: false, user: null, cookies: cookieStore.getAll().length }, { status: 200 });
    }

    try {
      const decoded = await adminAuth.verifySessionCookie(sessionCookie, true)
      return NextResponse.json({ signedIn: true, user: { uid: decoded.uid, email: decoded.email } }, { status: 200 })
    } catch (err) {
      console.warn('[api/me] invalid session cookie', err)
      return NextResponse.json({ signedIn: false, user: null }, { status: 200 })
    }
  } catch (error) {
    console.error('[api/me:error]', error);
    return NextResponse.json(
      { signedIn: false, error: 'Internal error' },
      { status: 500 }
    );
  }
}
