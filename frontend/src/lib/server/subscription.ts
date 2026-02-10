// Lightweight subscription stubs (Firebase-only / build-safe)
// These are intentionally minimal implementations to avoid any Supabase dependency
// and to keep server-side code working when billing is not configured.

export interface MinimalSubscription {
  plan: string;
  isActive: boolean;
  trialEndsAt: null | number;
  currentPeriodEndsAt: null | number;
}

export async function getSubscriptionForUser(uid: string): Promise<MinimalSubscription> {
  // Build-safe default: always free and active (no billing enforcement)
  return {
    plan: "free",
    isActive: true,
    trialEndsAt: null,
    currentPeriodEndsAt: null,
  };
}

// Backwards-compatible stubs used by various server routes. Kept minimal and
// synchronous/fast so builds and runtime behave predictably.
export async function getUserSubscription(_userId: string) {
  return {
    userId: _userId,
    planId: "free",
    provider: "none",
    status: "free",
    currentPeriodStart: Math.floor(Date.now() / 1000),
    currentPeriodEnd: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
    rendersUsedThisPeriod: 0,
    updatedAt: Math.floor(Date.now() / 1000),
  } as any;
}

export async function updateUserSubscription(_userId: string, _updates: any) {
  return getUserSubscription(_userId);
}

export async function incrementRenderUsage(_userId: string): Promise<boolean> {
  return true;
}

export function getDemoUserId(): string {
  return "demo-user-default";
}

export async function getUserEntitlements(_userId: string) {
  return {
    planId: "free",
    rendersPerMonth: 10,
    maxVideoLengthMinutes: 5,
    exportQuality: "720p",
    hasWatermark: true,
    queuePriority: "standard",
    canExportWithoutWatermark: false,
  } as any;
}

export function isSubscriptionActive(_sub: any): boolean {
  return true;
}

// Whether billing is enabled on this deployment. Default: disabled.
export function isBillingLive(): boolean {
  return process.env.BILLING_LIVE === 'true';
}
