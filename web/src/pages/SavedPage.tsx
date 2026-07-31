import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, LogIn, Compass } from 'lucide-react';
import { EventCard } from '../components/events/EventCard';
import { useAuthStore } from '@store/authStore';
import { MOCK_EVENTS } from '../lib/mockData';

// Demo: a handful of events pre-saved for guest view
const DEMO_SAVED_IDS = ['mock-1', 'mock-3', 'mock-gp-1', 'mock-kzn-1'];

export default function SavedPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [savedIds, setSavedIds] = useState<string[]>(DEMO_SAVED_IDS);
  const [activeTab, setActiveTab] = useState<string>('all');

  const toggle = (id: string) =>
    setSavedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const all = MOCK_EVENTS.filter((e) => savedIds.includes(e.id));
  const filtered = activeTab === 'all' ? all : all.filter((e) => e.category === activeTab);

  // build tab options from saved events
  const tabs = ['all', ...Array.from(new Set(all.map((e) => e.category)))];
  const TAB_EMOJI: Record<string, string> = {
    all: '🔥', nightlife: '🌃', music: '🎵', food: '🍔',
    festivals: '🎪', corporate: '💼', social: '👥', sports: '⚽', arts: '🎨',
  };

  return (
    <div className="pb-4">
      <div className="max-w-screen-xl mx-auto">

      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-11 h-11 rounded-2xl bg-red-50 flex items-center justify-center">
            <Heart className="text-red-500 fill-red-400" size={22} />
          </div>
          <div>
            <h1 className="text-[22px] font-black text-text-primary leading-tight">Saved Events</h1>
            <p className="text-text-secondary text-xs">{all.length} event{all.length !== 1 ? 's' : ''} saved</p>
          </div>
        </div>
      </div>

      {/* Guest sync banner */}
      {!isAuthenticated && (
        <div className="mx-4 mb-4 rounded-2xl overflow-hidden shadow-lg shadow-black/10">
          <div className="bg-gradient-to-r from-[#0D1B2A] to-[#1a2f45] p-4 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-white font-black text-sm">Sign in to sync saves</p>
              <p className="text-white/55 text-xs mt-0.5">Your saved events will sync across all devices</p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-1.5 bg-primary text-white text-xs font-black px-3.5 py-2 rounded-xl shadow-md shadow-primary/30 hover:opacity-90 transition-opacity flex-shrink-0"
            >
              <LogIn size={13} /> Sign In
            </button>
          </div>
        </div>
      )}

      {all.length > 0 ? (
        <>
          {/* Category tabs */}
          {tabs.length > 1 && (
            <div className="flex gap-2 overflow-x-auto px-4 mb-4" style={{ scrollbarWidth: 'none' }}>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-bold border capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-primary to-[#0EA8AC] text-white border-transparent shadow-md shadow-primary/25'
                      : 'bg-white border-app-border text-text-secondary hover:border-primary/40'
                  }`}
                >
                  {TAB_EMOJI[tab] ?? '🎫'} {tab === 'all' ? 'All' : tab}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 px-4">
            {filtered.length > 0 ? (
              filtered.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onPress={() => navigate(`/event/${event.id}`)}
                  onSave={() => toggle(event.id)}
                  isSaved
                />
              ))
            ) : (
              <div className="md:col-span-2 xl:col-span-3 text-center py-12">
                <p className="text-3xl mb-3">🔍</p>
                <p className="text-text-primary font-bold">No saved events in this category</p>
                <button onClick={() => setActiveTab('all')} className="mt-3 text-primary text-sm font-bold hover:underline">
                  Show all saved
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center px-6 py-16 text-center">
          <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center mb-5 shadow-inner">
            <Heart size={32} className="text-red-300" />
          </div>
          <h2 className="text-text-primary font-black text-xl mb-2">Nothing saved yet</h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-6">
            Tap the ♥ heart on any event to save it here for quick access later.
          </p>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-[#0EA8AC] text-white font-black text-sm px-6 py-3 rounded-2xl shadow-lg shadow-primary/30 hover:opacity-90 transition-opacity"
          >
            <Compass size={16} /> Discover Events
          </button>
        </div>
      )}

      </div>{/* /max-width wrapper */}
    </div>
  );
}
