/**
 * Runtime environment assertions for server-side auth.
 * Importing this module and calling `assertServerEnv()` will throw
 * immediately if required env vars are missing so the app fails fast.
 */
export function assertServerEnv(): void {
  const required = ['NEXT_PUBLIC_SITE_URL']

  const missing = required.filter((k) => !process.env[k])
  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
        `Set them in your environment or .env.local and restart the dev server.`
    )
  }
}

export function assertClientEnv(): void {
  // No client-side Supabase env required; keep this function as a no-op.
}
