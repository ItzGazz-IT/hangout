import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { useWebAuthListener } from './hooks/useWebAuthListener';

// Layouts
import Layout from './components/layout/Layout';
import AuthLayout from './components/layout/AuthLayout';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import OnboardingPage from './pages/auth/OnboardingPage';

// Main pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import SavedPage from './pages/SavedPage';
import WalletPage from './pages/WalletPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import NotificationsPage from './pages/NotificationsPage';
import EventPage from './pages/event/EventPage';
import HostDashboardPage from './pages/host/HostDashboardPage';
import CreateEventPage from './pages/host/CreateEventPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) return <div className="flex h-screen items-center justify-center text-text-secondary">Loading…</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function GuestGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) return <div className="flex h-screen items-center justify-center text-text-secondary">Loading…</div>;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  useWebAuthListener();

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route element={<GuestGuard><AuthLayout /></GuestGuard>}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Onboarding (authenticated but not yet onboarded) */}
        <Route path="/onboarding" element={<AuthGuard><OnboardingPage /></AuthGuard>} />

        {/* Main app — Layout is public; individual routes are guarded as needed */}
        <Route element={<Layout />}>
          {/* Public: guests can browse */}
          <Route index element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/event/:id" element={<EventPage />} />
          <Route path="/saved" element={<SavedPage />} />

          {/* Protected: requires sign-in */}
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/profile" element={<AuthGuard><ProfilePage /></AuthGuard>} />
          <Route path="/settings" element={<AuthGuard><SettingsPage /></AuthGuard>} />
          <Route path="/notifications" element={<AuthGuard><NotificationsPage /></AuthGuard>} />
          <Route path="/host/dashboard" element={<AuthGuard><HostDashboardPage /></AuthGuard>} />
          <Route path="/host/create-event" element={<AuthGuard><CreateEventPage /></AuthGuard>} />
          <Route path="/host/bookings" element={<AuthGuard><HostDashboardPage /></AuthGuard>} />
          <Route path="/admin/dashboard" element={<AuthGuard><AdminDashboardPage /></AuthGuard>} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
