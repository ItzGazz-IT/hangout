import type { UserProfile } from '@models/user.types';

export const DEMO_STORAGE_KEY = 'hangout_demo_mode';

/** Synthetic user injected when demo mode is active */
export const DEMO_USER: UserProfile = {
  uid: 'demo-user-001',
  email: 'admin@hangout.demo',
  displayName: 'Demo User',
  role: 'user',
  savedEvents: ['mock-1', 'mock-3'],
  fcmTokens: [],
  onboardingCompleted: true,
  createdAt: {} as any,
  updatedAt: {} as any,
};

export function setDemoMode(): void {
  localStorage.setItem(DEMO_STORAGE_KEY, '1');
}

export function clearDemoMode(): void {
  localStorage.removeItem(DEMO_STORAGE_KEY);
}

export function isDemoMode(): boolean {
  return localStorage.getItem(DEMO_STORAGE_KEY) === '1';
}
