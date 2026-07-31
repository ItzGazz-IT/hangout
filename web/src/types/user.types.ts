import type { Timestamp } from 'firebase/firestore';

export type UserRole = 'user' | 'host' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  savedEvents: string[];
  fcmTokens: string[];
  onboardingCompleted: boolean;
  province?: string;
  city?: string;
  createdAt: Timestamp | Date | null;
  updatedAt: Timestamp | Date | null;
}
