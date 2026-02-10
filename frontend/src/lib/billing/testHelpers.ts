/**
 * Billing test helpers (Supabase removed)
 *
 * These are lightweight, in-memory stubs for local development and testing.
 * They intentionally do NOT contact any external service.
 */

export interface BillingStatus {
  user_id: string;
  plan: 'free' | 'starter' | 'creator' | 'studio';
  status: 'locked' | 'pending' | 'active';
  stripe_subscription_id: string | null;
  updated_at: string;
}

const store = new Map<string, BillingStatus>();

export async function queryBillingStatus(userId: string): Promise<BillingStatus | null> {
  return store.get(userId) || null;
}

export async function getUserIdByEmail(_email: string): Promise<string | null> {
  return null;
}

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const billing = await queryBillingStatus(userId);
  return billing?.status === 'active' && billing?.plan !== 'free';
}

export function formatBillingStatus(billing: BillingStatus | null): string {
  if (!billing) return 'NOT_FOUND';
  return `${billing.plan}/${billing.status}`;
}

export async function logBillingStatusChange(_userId: string, _action: string, _details?: Record<string, unknown>) {
  // no-op in stub
}

export async function simulatePaymentConfirmation(userId: string, plan: 'starter' | 'creator' | 'studio' = 'starter') {
  const status: BillingStatus = {
    user_id: userId,
    plan,
    status: 'pending',
    stripe_subscription_id: `sub_test_${Date.now()}`,
    updated_at: new Date().toISOString(),
  };
  store.set(userId, status);
  return status;
}

export async function manuallyActivateSubscription(userId: string, plan: 'starter' | 'creator' | 'studio' = 'starter') {
  const status: BillingStatus = {
    user_id: userId,
    plan,
    status: 'active',
    stripe_subscription_id: `sub_manual_${Date.now()}`,
    updated_at: new Date().toISOString(),
  };
  store.set(userId, status);
  return status;
}

export async function resetUserToFree(userId: string) {
  const status: BillingStatus = {
    user_id: userId,
    plan: 'free',
    status: 'locked',
    stripe_subscription_id: null,
    updated_at: new Date().toISOString(),
  };
  store.set(userId, status);
  return status;
}

export async function generateTestReport(userId: string): Promise<string> {
  const billing = await queryBillingStatus(userId);
  const hasActive = await hasActiveSubscription(userId);

  return `\nBILLING STATUS REPORT\nUser ID: ${userId}\nCurrent Status: ${formatBillingStatus(billing)}\nHas Active Sub: ${hasActive ? 'YES' : 'NO'}\nPlan: ${billing?.plan || 'N/A'}\nStatus: ${billing?.status || 'N/A'}\nUpdated: ${billing?.updated_at || 'N/A'}\n`;
}
