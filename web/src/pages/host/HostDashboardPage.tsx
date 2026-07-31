import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { useDemoStore } from '../../store/demoStore';
import {
  LayoutDashboard, TrendingUp, Users, CalendarCheck,
  Plus, ArrowUpRight, ChevronRight, Eye, Edit3,
} from 'lucide-react';
import { formatPrice } from '@utils/formatters';

const MOCK_STATS_TPL = [
  { label: 'Active Events', value: '3', trend: '+1 this week', icon: CalendarCheck, color: 'text-primary', bg: 'bg-primary-light' },
  { label: 'Total Bookings', value: null as null | string, trend: 'from tickets', icon: Users, color: 'text-orange-500', bg: 'bg-orange-50' },
  { label: 'Month Revenue', value: null as null | string, trend: 'from tickets', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Avg Rating', value: '4.8 ★', trend: '24 reviews', icon: LayoutDashboard, color: 'text-yellow-500', bg: 'bg-yellow-50' },
];

const MOCK_EVENTS = [
  {
    id: 'h-1',
    title: 'Afro Soul Sessions',
    date: 'Sat, 7 Jun 2026',
    city: 'Johannesburg',
    category: 'nightlife',
    status: 'active',
    bookings: 142,
    capacity: 200,
    revenue: 2840000,
    img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80&auto=format&fit=crop',
  },
  {
    id: 'h-2',
    title: "Jo'burg Jazz Evening",
    date: 'Sat, 14 Jun 2026',
    city: 'Johannesburg',
    category: 'music',
    status: 'active',
    bookings: 89,
    capacity: 150,
    revenue: 1780000,
    img: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=300&q=80&auto=format&fit=crop',
  },
  {
    id: 'h-3',
    title: 'Sandton Business Mixer',
    date: 'Fri, 30 May 2026',
    city: 'Sandton',
    category: 'corporate',
    status: 'pending',
    bookings: 0,
    capacity: 100,
    revenue: 0,
    img: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=300&q=80&auto=format&fit=crop',
  },
];

const RECENT_BOOKINGS = [] as never[];

export default function HostDashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const demoTickets = useDemoStore((s) => s.tickets);
  const [activeTab, setActiveTab] = useState<'events' | 'bookings'>('events');

  // Derive stats from demo tickets
  const totalBookings = demoTickets.reduce((sum, t) => sum + t.qty, 0);
  const totalRevenue = demoTickets.reduce((sum, t) => sum + t.totalPrice, 0);

  const MOCK_STATS = MOCK_STATS_TPL.map((s) => ({
    ...s,
    value: s.label === 'Total Bookings' ? String(totalBookings) : s.label === 'Month Revenue' ? formatPrice(totalRevenue, 'ZAR') : s.value!,
  }));

  return (
    <div className="pb-6">
      <div className="max-w-screen-xl mx-auto">

      {/* Header */}
      <div className="px-4 pt-6 pb-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-text-secondary text-sm font-medium">Welcome back</p>
            <h1 className="text-[26px] font-black text-text-primary leading-tight">
              {user?.displayName?.split(' ')[0] ?? 'Host'} 👋
            </h1>
            <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-black text-secondary bg-orange-50 border border-secondary/20 px-2.5 py-0.5 rounded-full">
              HOST ACCOUNT
            </span>
          </div>
          <button
            onClick={() => navigate('/host/create-event')}
            className="flex items-center gap-1.5 bg-gradient-to-r from-primary to-[#0EA8AC] text-white text-sm font-black px-4 py-2.5 rounded-2xl shadow-lg shadow-primary/30 hover:opacity-90 transition-opacity"
          >
            <Plus size={15} /> New Event
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 px-4 mb-5">
        {MOCK_STATS.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-app-border shadow-sm">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon size={17} className={s.color} />
            </div>
            <p className="text-text-primary font-black text-[22px] leading-none">{s.value}</p>
            <p className="text-text-secondary text-xs mt-1">{s.label}</p>
            <p className="text-text-muted text-[10px] mt-0.5">{s.trend}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mx-4 mb-4 bg-surface rounded-2xl p-1 border border-app-border">
        {(['events', 'bookings'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-black capitalize transition-all ${
              activeTab === t ? 'bg-white text-primary shadow-sm border border-app-border' : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {t === 'events' ? `My Events (${MOCK_EVENTS.length})` : `Bookings (${demoTickets.length})`}
          </button>
        ))}
      </div>

      {activeTab === 'events' ? (
        <div className="px-4 flex flex-col gap-3">
          {MOCK_EVENTS.map((ev) => {
            const pct = Math.round((ev.bookings / ev.capacity) * 100);
            return (
              <div key={ev.id} className="bg-white rounded-2xl border border-app-border overflow-hidden shadow-sm">
                <div className="flex items-stretch">
                  {/* Thumbnail */}
                  <div className="relative w-24 flex-shrink-0">
                    <img src={ev.img} alt={ev.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/15" />
                  </div>
                  {/* Content */}
                  <div className="flex-1 px-3 py-3 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-text-primary font-black text-sm leading-tight line-clamp-1">{ev.title}</p>
                      <span className={`flex-shrink-0 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wide ${
                        ev.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {ev.status === 'active' ? '● Live' : '⏳ Review'}
                      </span>
                    </div>
                    <p className="text-text-secondary text-[11px] mt-0.5">{ev.date} · {ev.city}</p>
                    <div className="flex items-center justify-between mt-2 mb-1.5">
                      <span className="text-text-secondary text-[11px]">
                        <span className="font-black text-text-primary">{ev.bookings}</span>/{ev.capacity} booked
                      </span>
                      <span className="text-green-600 text-[11px] font-black">{formatPrice(ev.revenue, 'ZAR')}</span>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1.5 rounded-full bg-surface overflow-hidden">
                      <div
                        className={`h-full rounded-full ${pct > 80 ? 'bg-gradient-to-r from-secondary to-orange-400' : 'bg-gradient-to-r from-primary to-[#0EA8AC]'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
                {/* Actions row */}
                <div className="flex border-t border-app-border divide-x divide-app-border">
                  <button className="flex-1 py-2.5 flex items-center justify-center gap-1.5 text-text-secondary text-xs font-bold hover:bg-surface transition-colors">
                    <Eye size={13} /> View
                  </button>
                  <button className="flex-1 py-2.5 flex items-center justify-center gap-1.5 text-text-secondary text-xs font-bold hover:bg-surface transition-colors">
                    <Edit3 size={13} /> Edit
                  </button>
                  <button className="flex-1 py-2.5 flex items-center justify-center gap-1.5 text-primary text-xs font-black hover:bg-primary-light transition-colors">
                    <Users size={13} /> Attendees
                  </button>
                </div>
              </div>
            );
          })}

          {/* Create CTA */}
          <button
            onClick={() => navigate('/host/create-event')}
            className="w-full py-4 rounded-2xl border-2 border-dashed border-primary/30 text-primary text-sm font-black hover:bg-primary-light transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Create a new event
          </button>
        </div>
      ) : (
        <div className="px-4 flex flex-col gap-2">
          {demoTickets.length === 0 ? (
            <p className="text-center text-text-muted text-sm py-10">No bookings yet</p>
          ) : (
            demoTickets.map((t) => (
              <div key={t.id} className="bg-white rounded-2xl border border-app-border px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-black text-sm">G</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary font-black text-sm leading-tight">Guest</p>
                  <p className="text-text-secondary text-[11px] truncate">{t.eventTitle} · {t.tierName} × {t.qty}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-green-600 font-black text-sm">{formatPrice(t.totalPrice, 'ZAR')}</p>
                  <p className="text-text-muted text-[10px]">{t.eventDate}</p>
                </div>
              </div>
            ))
          )}
          <button className="flex items-center justify-center gap-1 text-primary text-xs font-black py-3 hover:underline">
            View all bookings <ArrowUpRight size={13} />
          </button>
        </div>
      )}

      </div>{/* /max-width */}
    </div>
  );
}

