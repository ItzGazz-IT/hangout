import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, SlidersHorizontal, TrendingUp } from 'lucide-react';
import { addDays, startOfDay, endOfDay, isToday, isThisMonth } from 'date-fns';
import { EventCard } from '../components/events/EventCard';
import { useAuthStore } from '@store/authStore';
import { MOCK_EVENTS, PROVINCES } from '../lib/mockData';
import { toDate } from '@utils/formatters';
import type { Event } from '@models/event.types';

const PRICE_OPTS = [
  { id: 'all', label: 'Any price' },
  { id: 'free', label: '🎟️ Free' },
  { id: 'u100', label: 'Under R100' },
  { id: 'u300', label: 'Under R300' },
];

const WHEN_OPTS = [
  { id: 'all', label: 'Any time' },
  { id: 'today', label: 'Today' },
  { id: 'weekend', label: 'Weekend' },
  { id: 'month', label: 'This Month' },
];

const QUICK_CATS = [
  { id: 'nightlife', label: 'Nightlife', emoji: '🌃', color: '#6C63FF' },
  { id: 'music', label: 'Music', emoji: '🎵', color: '#11C5C9' },
  { id: 'food', label: 'Food & Drink', emoji: '🍔', color: '#FF8A00' },
  { id: 'festivals', label: 'Festivals', emoji: '🎪', color: '#E91E63' },
  { id: 'sports', label: 'Sports', emoji: '⚽', color: '#4CAF50' },
  { id: 'arts', label: 'Arts & Culture', emoji: '🎨', color: '#FF5722' },
  { id: 'social', label: 'Social', emoji: '👥', color: '#9C27B0' },
  { id: 'corporate', label: 'Corporate', emoji: '💼', color: '#607D8B' },
];

export default function SearchPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');
  const [province, setProvince] = useState('all');
  const [category, setCategory] = useState<string | null>(null);
  const [price, setPrice] = useState('all');
  const [when, setWhen] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const requireAuth = (action: () => void) => {
    if (!isAuthenticated) { navigate('/login'); return; }
    action();
  };

  const hasFilters = province !== 'all' || category !== null || price !== 'all' || when !== 'all';
  const hasQuery = query.trim().length > 0;
  const showResults = hasQuery || hasFilters;

  const results = useMemo((): Event[] => {
    if (!showResults) return [];
    let list = MOCK_EVENTS;

    // Text search
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.venueName.toLowerCase().includes(q) ||
        (e.city ?? '').toLowerCase().includes(q) ||
        (e.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    }
    // Province
    if (province !== 'all') {
      const prov = PROVINCES.find((p) => p.id === province);
      if (prov) list = list.filter((e) => prov.cities.includes(e.city ?? ''));
    }
    // Category
    if (category) list = list.filter((e) => e.category === category);
    // Price
    if (price === 'free') list = list.filter((e) => e.isFree);
    if (price === 'u100') list = list.filter((e) => e.isFree || (e.ticketTiers[0]?.price ?? 0) < 10000);
    if (price === 'u300') list = list.filter((e) => e.isFree || (e.ticketTiers[0]?.price ?? 0) < 30000);
    // When
    if (when === 'today') {
      list = list.filter((e) => isToday(toDate(e.startDate)));
    } else if (when === 'weekend') {
      const now = new Date();
      const day = now.getDay(); // 0=Sun … 6=Sat
      const daysToSat = day === 6 ? 7 : (6 - day);
      const sat = startOfDay(addDays(now, daysToSat));
      const sun = endOfDay(addDays(sat, 1));
      list = list.filter((e) => { const d = toDate(e.startDate); return d >= sat && d <= sun; });
    } else if (when === 'month') {
      list = list.filter((e) => isThisMonth(toDate(e.startDate)));
    }

    return list;
  }, [query, province, category, price, when, showResults]);

  const clearAll = () => { setQuery(''); setProvince('all'); setCategory(null); setPrice('all'); setWhen('all'); };

  return (
    <div className="pb-4">

      {/* ── Sticky search header ── */}
      <div className="bg-white border-b border-app-border sticky top-0 z-30">
        <div className="max-w-screen-xl mx-auto px-4 pt-4 pb-3">

        {/* Search input row */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 flex items-center gap-2 bg-surface border border-app-border rounded-2xl px-3 py-2.5 focus-within:border-primary focus-within:bg-primary-light/30 transition-colors">
            <Search size={15} className="text-muted flex-shrink-0" />
            <input
              ref={inputRef}
              className="flex-1 bg-transparent text-text-primary text-sm outline-none placeholder:text-text-muted font-medium"
              placeholder="Events, venues, artists, cities…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button onClick={() => setQuery('')} className="hover:text-text-primary transition-colors">
                <X size={15} className="text-muted" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`relative w-10 h-10 rounded-2xl flex items-center justify-center border transition-colors ${
              hasFilters ? 'bg-primary border-primary text-white shadow-md shadow-primary/30' : 'bg-surface border-app-border text-text-secondary hover:border-primary/40'
            }`}
          >
            <SlidersHorizontal size={16} />
            {hasFilters && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full text-white text-[9px] font-black flex items-center justify-center">
                {[province !== 'all', category, price !== 'all', when !== 'all'].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="flex flex-col gap-4 mb-2 pt-3 border-t border-app-border">

            {/* Province */}
            <div>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Province</p>
              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                {PROVINCES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setProvince(p.id)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold border transition-all ${
                      province === p.id
                        ? 'bg-gradient-to-r from-primary to-[#0EA8AC] text-white border-transparent shadow-md shadow-primary/25'
                        : 'bg-white border-app-border text-text-secondary hover:border-primary/40 hover:text-primary'
                    }`}
                  >
                    {p.emoji} {p.short}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Price</p>
              <div className="flex gap-2 flex-wrap">
                {PRICE_OPTS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setPrice(f.id)}
                    className={`flex-shrink-0 px-3 py-2 rounded-xl text-[11px] font-bold border transition-all ${
                      price === f.id ? 'bg-secondary text-white border-transparent' : 'bg-white border-app-border text-text-secondary hover:border-secondary/40'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* When */}
            <div>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">When</p>
              <div className="flex gap-2 flex-wrap">
                {WHEN_OPTS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setWhen(f.id)}
                    className={`flex-shrink-0 px-3 py-2 rounded-xl text-[11px] font-bold border transition-all ${
                      when === f.id ? 'bg-text-primary text-white border-transparent' : 'bg-white border-app-border text-text-secondary hover:border-text-primary/40'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear */}
            {hasFilters && (
              <button onClick={clearAll} className="text-[11px] font-black text-red-500 hover:underline text-left">
                × Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Category strip (always visible) */}
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <button
            onClick={() => setCategory(null)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
              !category ? 'bg-gradient-to-r from-primary to-secondary text-white border-transparent shadow-md' : 'bg-white border-app-border text-text-secondary hover:border-primary/40'
            }`}
          >
            🔥 All
          </button>
          {QUICK_CATS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(category === cat.id ? null : cat.id)}
              className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                category === cat.id ? 'text-white border-transparent shadow-md' : 'bg-white border-app-border text-text-secondary hover:border-primary/40'
              }`}
              style={category === cat.id ? { backgroundColor: cat.color } : {}}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
        </div>{/* /search header inner */}
      </div>

      {/* ── Body ── */}
      <div className="max-w-screen-xl mx-auto px-4 mt-5">
        {showResults ? (
          results.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="text-text-secondary text-sm font-semibold">
                  {query ? `Results for "${query}"` : hasFilters ? 'Filtered events' : 'All events'}
                </p>
                <span className="bg-surface border border-app-border text-text-muted text-[11px] font-bold px-2.5 py-1 rounded-full">
                  {results.length} event{results.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {results.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    compact
                    onPress={() => navigate(`/event/${event.id}`)}
                    onSave={() => requireAuth(() => {})}
                    isSaved={false}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center py-16 text-center">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-text-primary font-black text-lg">No events found</p>
              <p className="text-text-secondary text-sm mt-1">Try different keywords or adjust your filters</p>
              {(hasFilters || hasQuery) && (
                <button onClick={clearAll} className="mt-5 bg-gradient-to-r from-primary to-[#0EA8AC] text-white font-black text-sm px-5 py-2.5 rounded-2xl shadow-md shadow-primary/25 hover:opacity-90 transition-opacity">
                  Clear &amp; start over
                </button>
              )}
            </div>
          )
        ) : (
          /* Landing state: popular categories grid */
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-primary" />
              <p className="text-text-primary font-black text-base">Browse by category</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {QUICK_CATS.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className="relative h-24 rounded-2xl overflow-hidden flex items-end p-3.5 group hover:scale-[1.02] transition-transform shadow-md"
                  style={{ backgroundColor: cat.color }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-black/0 to-black/40" />
                  <div className="absolute top-3 right-3.5 text-3xl group-hover:scale-110 transition-transform">{cat.emoji}</div>
                  <span className="relative text-white font-black text-sm leading-tight">{cat.label}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 mb-3">
              <p className="text-text-primary font-black text-base">Trending now</p>
              <span className="text-secondary text-lg">🔥</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {MOCK_EVENTS.slice(0, 3).map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  compact
                  onPress={() => navigate(`/event/${event.id}`)}
                  onSave={() => requireAuth(() => {})}
                  isSaved={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
