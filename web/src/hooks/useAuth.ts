import { useAuthStore } from '@store/authStore';
import { authService } from '@services/firebase/auth.service';
import { isDemoMode, clearDemoMode } from '../lib/demoMode';

/** Convenience hook wrapping the auth store + sign-out logic */
export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  const signOut = async () => {
    if (isDemoMode()) {
      clearDemoMode();
      clearUser();
      return;
    }
    try {
      await authService.signOut();
    } finally {
      clearUser();
    }
  };

  return { user, isAuthenticated, isLoading, signOut };
}
