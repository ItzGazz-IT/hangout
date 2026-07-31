import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@config/firebase';
import type { UserProfile, UserRole } from '@models/user.types';

export const authService = {
  /** Register a new user with email + password */
  async registerWithEmail(
    email: string,
    password: string,
    displayName: string,
    role: UserRole = 'user',
  ): Promise<UserProfile> {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const profile: UserProfile = {
      uid: cred.user.uid,
      email: cred.user.email ?? email,
      displayName,
      role,
      savedEvents: [],
      fcmTokens: [],
      onboardingCompleted: false,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
    };
    await setDoc(doc(db, 'users', cred.user.uid), profile);
    return profile;
  },

  /** Sign in with email + password */
  async loginWithEmail(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(auth, email, password);
  },

  /** Sign out */
  async signOut(): Promise<void> {
    await fbSignOut(auth);
  },

  /** Send password reset email */
  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  },

  /** Fetch a user's profile from Firestore */
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return null;
    return { uid: snap.id, ...snap.data() } as UserProfile;
  },

  /** Subscribe to Firebase auth state changes */
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },
};
