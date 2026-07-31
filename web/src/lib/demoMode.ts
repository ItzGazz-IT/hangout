import type { UserProfile } from '@models/user.types';
import type { UserRole } from '@models/user.types';

export const DEMO_STORAGE_KEY = 'hangout_demo_mode';
export const DEMO_ROLE_KEY = 'hangout_demo_role';

/** Synthetic user injected when demo mode is active */
export const DEMO_USER: UserProfile = {
  uid: 'demo-user-001',
  email: 'admin@hangout.demo',
  displayName: 'Demo User',
  role: 'admin',
  savedEvents: ['mock-1', 'mock-3'],
  fcmTokens: [],
  onboardingCompleted: true,
  createdAt: {} as any,
  updatedAt: {} as any,
};

export function setDemoMode(role: UserRole = 'admin'): void {
  localStorage.setItem(DEMO_STORAGE_KEY, '1');
  localStorage.setItem(DEMO_ROLE_KEY, role);
}

export function setDemoRole(role: UserRole): UserProfile {
  localStorage.setItem(DEMO_ROLE_KEY, role);
  return { ...DEMO_USER, role };
}

export function getDemoUser(): UserProfile {
  const role = localStorage.getItem(DEMO_ROLE_KEY) as UserRole | null;
  return { ...DEMO_USER, role: role === 'user' || role === 'host' || role === 'admin' ? role : 'admin' };
}

export function clearDemoMode(): void {
  localStorage.removeItem(DEMO_STORAGE_KEY);
  localStorage.removeItem(DEMO_ROLE_KEY);
}

export function isDemoMode(): boolean {
  return localStorage.getItem(DEMO_STORAGE_KEY) === '1';
}
