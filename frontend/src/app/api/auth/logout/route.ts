/**
 * Logout API endpoint
 * POST /api/auth/logout
 * 
 * Uses Supabase Auth to sign out users
 * Clears session cookies
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // Clear Firebase session cookie
    const res = NextResponse.json({ success: true }, { status: 200 });
    res.cookies.set('session', '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0,
    });
    return res;
  } catch (error) {
    console.error('[api:auth:logout] Error:', error);
    return NextResponse.json({ success: false, error: 'Logout failed' }, { status: 500 });
  }
}
