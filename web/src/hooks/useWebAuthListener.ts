import { useEffect } from 'react';
import { useAuthStore } from '@store/authStore';
import { authService } from '@services/firebase/auth.service';
import { isDemoMode, DEMO_USER } from '../lib/demoMode';

/**
 * Web-specific auth listener.
 * In demo mode it injects the DEMO_USER directly and skips Firebase entirely.
 * In production mode it behaves identically to the shared useAuthListener.
 */
export function useWebAuthListener(): void {
  const { setUser, setLoading, clearUser } = useAuthStore();

  useEffect(() => {
    if (isDemoMode()) {
      setUser(DEMO_USER);
      return;
    }

    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      if (!firebaseUser) {
        clearUser();
        return;
      }
      try {
        const profile = await authService.getUserProfile(firebaseUser.uid);
        setUser(profile);
      } catch {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);
}
