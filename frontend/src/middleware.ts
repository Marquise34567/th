import { NextResponse, type NextRequest } from 'next/server'

// No-op middleware: Supabase removed. This middleware intentionally does nothing
// so that routing and static assets are unaffected. Keep a matcher similar to
// previous behavior to avoid changing route coverage.
export function middleware(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
