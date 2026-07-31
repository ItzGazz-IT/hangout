import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, Heart, Ticket, User, Menu, X, Bell, LogIn, LayoutDashboard, CalendarPlus, ClipboardList } from 'lucide-react';
import { useAuthStore } from '@store/authStore';

const userTabs = [
  { to: '/', icon: Home, label: 'Home', exact: true },
  { to: '/search', icon: Search, label: 'Explore' },
  { to: '/saved', icon: Heart, label: 'Saved' },
  { to: '/wallet', icon: Ticket, label: 'Wallet' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const hostTabs = [
  { to: '/host/dashboard', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/host/create-event', icon: CalendarPlus, label: 'Create' },
  { to: '/host/bookings', icon: ClipboardList, label: 'Bookings' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const userNavLinks = [
  { to: '/', label: 'Home', exact: true },
  { to: '/search', label: 'Explore Events' },
  { to: '/wallet', label: 'Wallet' },
  { to: '/host/create-event', label: 'Host an Event' },
];

const hostNavLinks = [
  { to: '/host/dashboard', label: 'Dashboard', exact: true },
  { to: '/host/create-event', label: 'Create Event' },
  { to: '/', label: 'Browse Events' },
];

export default function Layout() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const [menuOpen, setMenuOpen] = useState(false);

  const isHost = user?.role === 'host';
  const tabs = isHost ? hostTabs : userTabs;
  const navLinks = isHost ? hostNavLinks : userNavLinks;

  return (
    <div className="flex flex-col h-screen bg-app-bg overflow-hidden">

      {/* ══════════════════════════════════════════════ */}
      {/*  TOP NAVBAR                                     */}
      {/* ══════════════════════════════════════════════ */}
      <header className="flex-shrink-0 bg-white/95 backdrop-blur-xl border-b border-app-border shadow-sm shadow-black/5 z-40 relative">
        <div className="flex items-center justify-between px-4 h-14">

          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-1 select-none">
            <span className="text-xl font-black leading-none">
              <span className="text-primary">Hang</span><span className="text-secondary">Out</span>
            </span>
            <span className="text-[10px] font-bold text-white bg-primary px-1.5 py-0.5 rounded-md ml-1">ZA</span>
          </NavLink>

          {/* Desktop nav links */}
          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map(({ to, label, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-primary-light text-primary'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {isHost && (
                  <span className="hidden sm:inline text-[10px] font-black text-secondary bg-orange-50 border border-secondary/20 px-2 py-0.5 rounded-full">
                    HOST
                  </span>
                )}
                <button
                  onClick={() => navigate('/notifications')}
                  className="relative w-9 h-9 rounded-xl bg-surface flex items-center justify-center hover:bg-app-border transition-colors"
                >
                  <Bell size={17} className="text-text-secondary" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary border-2 border-white" />
                </button>
                <button
                  onClick={() => navigate('/profile')}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    isHost ? 'bg-orange-50 hover:bg-orange-100' : 'bg-primary-light hover:bg-primary/20'
                  }`}
                >
                  <User size={17} className={isHost ? 'text-secondary' : 'text-primary'} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-semibold text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
                >
                  <LogIn size={15} />
                  Log In
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-primary to-[#0EA8AC] text-white text-sm font-black px-3.5 py-1.5 rounded-xl shadow-md shadow-primary/25 hover:opacity-90 transition-opacity"
                >
                  Sign Up
                </button>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="sm:hidden w-9 h-9 rounded-xl bg-surface flex items-center justify-center hover:bg-app-border transition-colors"
            >
              {menuOpen ? <X size={18} className="text-text-primary" /> : <Menu size={18} className="text-text-primary" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="sm:hidden border-t border-app-border bg-white/98 backdrop-blur-xl px-4 py-3 flex flex-col gap-1">
            {navLinks.map(({ to, label, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive ? 'bg-primary-light text-primary' : 'text-text-secondary hover:bg-surface'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            {!isAuthenticated && (
              <button
                onClick={() => { navigate('/login'); setMenuOpen(false); }}
                className="mt-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-text-secondary hover:bg-surface text-left transition-colors"
              >
                Log In
              </button>
            )}
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
        <Outlet />
      </main>

      {/* ── Bottom Tab Bar ── */}
      <div className="flex-shrink-0 fixed bottom-0 left-0 right-0 z-50 px-3 pb-4 pt-2 md:hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-app-bg/80 via-app-bg/60 to-transparent pointer-events-none" />
        <nav className="relative bg-white/85 backdrop-blur-2xl rounded-[26px] border border-white shadow-2xl shadow-black/10 flex items-center justify-around h-[62px] px-1">
          {tabs.map(({ to, icon: Icon, label, exact }) => (
            <NavLink key={to} to={to} end={exact} className="flex-1">
              {({ isActive }) => (
                <div className="flex flex-col items-center gap-0.5 py-1.5">
                  {isActive ? (
                    <>
                      <div className="w-10 h-8 rounded-2xl bg-gradient-to-br from-primary to-[#0EA8AC] flex items-center justify-center shadow-lg shadow-primary/40 mb-0.5">
                        <Icon size={17} className="text-white" strokeWidth={2.5} />
                      </div>
                      <span className="text-[9px] font-black text-primary tracking-tight">{label}</span>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-8 flex items-center justify-center">
                        <Icon size={19} className="text-muted" strokeWidth={1.8} />
                      </div>
                      <span className="text-[9px] font-semibold text-muted">{label}</span>
                    </>
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
