import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, Users, Calendar, X } from 'lucide-react';
import { FeaturedCarousel } from '../components/events/FeaturedCarousel';
import { EventCard } from '../components/events/EventCard';
import { CategoryFilter } from '../components/events/CategoryFilter';
import { EventCardSkeleton } from '../components/ui/Skeleton';
import { useFeaturedEvents, useFeedEvents } from '@hooks/useEvents';
import { useAuthStore } from '@store/authStore';
import { useEventsStore } from '@store/eventsStore';
import { MOCK_EVENTS, MOCK_FEATURED, PROVINCES } from '../lib/mockData';
import { useDemoStore } from '../store/demoStore';

export default function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { featuredEvents, isLoading: loadingFeatured } = useFeaturedEvents();
  const { filters, setFilters } = useEventsStore();
  const { events: firestoreEvents, isLoading, loadMore } = useFeedEvents(filters);

  // Province filter
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const currentProvince = PROVINCES.find((p) => p.id === selectedProvince) ?? PROVINCES[0];

  // Fall back to mock data when Firestore returns nothing (demo mode)
  const featuredToShow = featuredEvents.length > 0 ? featuredEvents : MOCK_FEATURED;
  const allEvents = firestoreEvents.length > 0 ? firestoreEvents : MOCK_EVENTS;

  // Filter events by province + city + category
  const eventsToShow = useMemo(() => {
    let list = allEvents;
    // Province filter
    if (selectedProvince !== 'all') {
      const prov = PROVINCES.find((p) => p.id === selectedProvince);
      if (prov) {
        list = list.filter((e) => prov.cities.includes(e.city ?? ''));
      }
    }
    // City sub-filter
    if (selectedCity) {
      list = list.filter((e) => e.city === selectedCity);
    }
    // Category filter
    if (filters.category) {
      list = list.filter((e) => e.category === filters.category);
    }
    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.venueName.toLowerCase().includes(q) ||
        (e.city ?? '').toLowerCase().includes(q) ||
        (e.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [allEvents, selectedProvince, selectedCity, filters.category, searchQuery]);

  const savedEventIds = useDemoStore((state) => state.savedEventIds);
  const toggleSaved = useDemoStore((state) => state.toggleSaved);
  const isSaved = (id: string) => savedEventIds.includes(id);

  const requireAuth = (action: () => void) => {
    if (!isAuthenticated) { navigate('/login'); return; }
    action();
  };

  const firstName = user?.displayName?.split(' ')[0];

  const locationLabel = selectedCity
    ? `${selectedCity}, ${currentProvince.short}`
    : selectedProvince === 'all'
    ? 'All of South Africa'
    : currentProvince.label;

  return (
    <div className="pb-8">

      {/* ═══════════════════════════════════════════ */}
      {/*  HERO                                        */}
      {/* ═══════════════════════════════════════════ */}
      <div className="relative bg-gradient-to-br from-primary via-[#0CB8BD] to-[#0891B2] pt-8 pb-10 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-14 -right-14 w-56 h-56 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-secondary/25" />
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-5">
        {/* Heading */}
        <div className="relative mb-6">
          {firstName ? (
            <>
              <h1 className="text-white font-black text-[32px] leading-tight drop-shadow-sm">Hey {firstName} 👋</h1>
              <p className="text-white/70 text-base mt-1 font-semibold">What's on tonight?</p>
            </>
          ) : (
            <>
              <h1 className="text-white font-black text-[32px] leading-[1.15] drop-shadow-sm">
                Find your next<br />
                <span className="text-white">Hang</span>
                <span className="text-secondary" style={{ textShadow: '0 2px 12px rgba(255,138,0,0.5)' }}>Out</span>
                <span className="ml-1">🎉</span>
              </h1>
              <p className="text-white/65 text-sm mt-2 font-medium">Discover events happening near you</p>
            </>
          )}
        </div>

        {/* Stats row */}
        <div className="relative flex items-center gap-4 mb-7">
          {([
            { icon: Calendar, value: '200+', label: 'Events' },
            { icon: Sparkles, value: '50+', label: 'Venues' },
            { icon: Users, value: '5K+', label: 'Members' },
          ] as const).map(({ icon: Icon, value, label }, i) => (
            <React.Fragment key={label}>
              {i > 0 && <div className="w-px h-8 bg-white/20" />}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <Icon size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-black text-sm leading-none">{value}</p>
                  <p className="text-white/55 text-[10px] font-bold mt-0.5">{label}</p>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Search bar */}
        <div className="relative w-full flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-2xl px-4 shadow-2xl shadow-black/25">
          <Search size={16} className="text-muted flex-shrink-0" />
          <input
            className="flex-1 bg-transparent text-text-primary text-sm py-4 outline-none placeholder:text-text-muted font-medium"
            placeholder="Search events, venues, artists…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="hover:opacity-70 transition-opacity">
              <X size={15} className="text-muted" />
            </button>
          )}
        </div>

        </div>{/* /hero content */}

        {/* Wave into page bg */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-app-bg" style={{ borderRadius: '30px 30px 0 0' }} />
      </div>

      <div className="max-w-screen-xl mx-auto">
      {/* ═══════════════════════════════════════════ */}
      {/*  PROVINCE FILTER STRIP                       */}
      {/* ═══════════════════════════════════════════ */}
      <div className="pt-4 pb-1">
        <div className="flex items-center justify-between px-4 mb-2">
          <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest">Browse by Province</h3>
          {selectedProvince !== 'all' && (
            <button
              onClick={() => { setSelectedProvince('all'); setSelectedCity(null); }}
              className="text-[11px] font-bold text-primary hover:underline"
            >
              Clear ×
            </button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          {PROVINCES.map((prov) => {
            const isActive = selectedProvince === prov.id;
            return (
              <button
                key={prov.id}
                onClick={() => {
                  setSelectedProvince(prov.id);
                  setSelectedCity(null);
                }}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold border transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-[#0EA8AC] text-white border-transparent shadow-lg shadow-primary/30 scale-[1.04]'
                    : 'bg-white border-app-border text-text-secondary hover:border-primary/40 hover:text-primary'
                }`}
              >
                <span>{prov.emoji}</span>
                <span>{prov.short}</span>
              </button>
            );
          })}
        </div>

        {/* City sub-filter */}
        {selectedProvince !== 'all' && currentProvince.cities.length > 0 && (
          <div className="flex gap-2 overflow-x-auto px-4 pt-2 pb-1 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            <button
              onClick={() => setSelectedCity(null)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                !selectedCity
                  ? 'bg-text-primary text-white border-transparent'
                  : 'bg-white border-app-border text-text-secondary hover:border-text-primary/30'
              }`}
            >
              All cities
            </button>
            {currentProvince.cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city === selectedCity ? null : city)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                  selectedCity === city
                    ? 'bg-text-primary text-white border-transparent'
                    : 'bg-white border-app-border text-text-secondary hover:border-text-primary/30'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Guest banner ── */}
      {!isAuthenticated && (
        <div className="mx-4 mt-4 mb-1 rounded-3xl overflow-hidden shadow-xl shadow-black/10">
          <div className="bg-gradient-to-r from-[#0D1B2A] to-[#1a2f45] p-5 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-white font-black text-base">Join HangOut 🎊</p>
              <p className="text-white/55 text-xs mt-1">Save events, buy tickets &amp; connect</p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-primary to-secondary text-white font-black text-xs px-4 py-2 rounded-xl shadow-lg hover:opacity-90 transition-opacity"
              >
                Sign Up
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-white/10 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-white/20 transition-colors border border-white/10 text-center"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Featured Events ── */}
      <div className="flex items-center justify-between px-4 mt-6 mb-3">
        <h2 className="text-[18px] font-black text-text-primary">✨ Featured</h2>
        <button onClick={() => navigate('/search')} className="text-primary text-xs font-bold hover:underline">
          See all →
        </button>
      </div>
      {loadingFeatured ? (
        <div className="px-4"><EventCardSkeleton /></div>
      ) : (
        <FeaturedCarousel events={featuredToShow} onEventPress={(e) => navigate(`/event/${e.id}`)} />
      )}

      {/* ── Categories ── */}
      <div className="px-4 mt-6 mb-3">
        <h2 className="text-[18px] font-black text-text-primary">Browse by Category</h2>
      </div>
      <CategoryFilter
        selected={filters.category ?? null}
        onSelect={(c) => setFilters({ ...filters, category: c ?? undefined })}
      />

      {/* ── Upcoming Events ── */}
      <div className="flex items-center justify-between px-4 mt-6 mb-3">
        <h2 className="text-[18px] font-black text-text-primary">
          {filters.category ? 'Events' : 'Upcoming Events'}
        </h2>
        <span className="text-text-muted text-xs font-bold bg-surface px-2.5 py-1 rounded-full border border-app-border">
          {eventsToShow.length} events
        </span>
      </div>

      {isLoading && allEvents.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 px-4">
          <EventCardSkeleton />
          <EventCardSkeleton />
          <EventCardSkeleton />
        </div>
      ) : eventsToShow.length === 0 ? (
        <div className="text-center py-12 px-4">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-text-primary font-bold">No events found</p>
          <p className="text-text-secondary text-sm mt-1">Try a different category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 px-4">
          {eventsToShow.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() => navigate(`/event/${event.id}`)}
              onSave={() => requireAuth(() => toggleSaved(event.id))}
              isSaved={isSaved(event.id)}
            />
          ))}
        </div>
      )}

      {/* Load more (only for real Firestore data) */}
      {!isLoading && firestoreEvents.length > 0 && (
        <button onClick={loadMore} className="w-full py-3 text-primary text-sm font-bold hover:underline">
          Load more
        </button>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/*  FOOTER                                      */}
      {/* ═══════════════════════════════════════════ */}
      <footer className="mx-4 mt-10 mb-2 rounded-3xl overflow-hidden relative shadow-xl shadow-black/10">
        <div className="bg-gradient-to-br from-[#0D1B2A] via-[#0f2236] to-[#112233] p-6">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-primary/15 pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-secondary/15 pointer-events-none" />
          <div className="relative">
            <div className="flex items-end gap-3 mb-1">
              <span className="text-2xl font-black">
                <span className="text-primary">Hang</span><span className="text-secondary">Out</span>
              </span>
              <span className="text-white/30 text-xs font-semibold mb-1">Cape Town</span>
            </div>
            <p className="text-white/45 text-xs font-medium mb-5">
              Discover, save and attend the best events near you.
            </p>
            <div className="border-t border-white/10 mb-4" />
            <div className="grid grid-cols-3 gap-y-3 mb-5">
              {['About Us', 'For Hosts', 'Blog', 'Terms', 'Privacy', 'Contact'].map((link) => (
                <a key={link} href="#" className="text-white/45 text-xs font-semibold hover:text-white transition-colors">
                  {link}
                </a>
              ))}
            </div>
            <div className="border-t border-white/10 mb-4" />
            <div className="flex items-center justify-between">
              <p className="text-white/25 text-[11px]">© 2026 HangOut. All rights reserved.</p>
              <div className="flex gap-2">
                {[{ l: 'X', s: '𝕏' }, { l: 'LinkedIn', s: 'in' }, { l: 'Instagram', s: '◈' }].map(({ l, s }) => (
                  <button key={l} aria-label={l} className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white/50 text-xs font-black hover:bg-white/20 hover:text-white transition-all">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
      </div>{/* /max-width wrapper */}

    </div>
  );
}
