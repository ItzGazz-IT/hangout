import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Ticket, Calendar, MapPin, ChevronDown, LogIn, Compass } from 'lucide-react';
import { useAuthStore } from '@store/authStore';
import { useDemoStore } from '../store/demoStore';
import { formatPrice } from '@utils/formatters';

const MOCK_TICKETS = [
  { id: 'tk-1', eventId: 'mock-gp-1', tierName: 'General',  qty: 2, price: 40000, qr: 'HANGOUT-TK-A1B2C3D4', status: 'confirmed' as const },
  { id: 'tk-2', eventId: 'mock-kzn-1', tierName: 'Standard', qty: 1, price: 25000, qr: 'HANGOUT-TK-E5F6G7H8', status: 'confirmed' as const },
  { id: 'tk-3', eventId: 'mock-1',     tierName: 'VIP',      qty: 1, price: 45000, qr: 'HANGOUT-TK-I9J0K1L2', status: 'confirmed' as const },
];

export default function WalletPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const demoTickets = useDemoStore((s) => s.tickets);
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const now = Date.now();
  const upcomingTickets = demoTickets.filter((t) => t.eventStartMs > now);
  const pastTickets = demoTickets.filter((t) => t.eventStartMs <= now);
  const visibleTickets = tab === 'upcoming' ? upcomingTickets : pastTickets;

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-20 text-center min-h-[70vh]">
        <div className="w-20 h-20 rounded-3xl bg-primary-light flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
          <Ticket size={32} className="text-primary" />
        </div>
        <h2 className="text-text-primary font-black text-2xl mb-2">Ticket Wallet</h2>
        <p className="text-text-secondary text-sm leading-relaxed mb-8 max-w-xs">
          Sign in to view your booked event tickets, QR codes and booking history.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-[#0EA8AC] text-white font-black text-sm px-6 py-3.5 rounded-2xl shadow-xl shadow-primary/30 hover:opacity-90 transition-opacity"
        >
          <LogIn size={16} /> Sign In to View Tickets
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mt-4 text-text-secondary text-sm font-semibold hover:text-primary transition-colors"
        >
          <Compass size={15} /> Browse events first
        </button>
      </div>
    );
  }

  return (
    <div className="pb-6">
      <div className="max-w-3xl mx-auto">

      {/* Header */}
      <div className="px-4 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-[#0EA8AC] flex items-center justify-center shadow-lg shadow-primary/30">
            <Ticket size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-[22px] font-black text-text-primary leading-tight">Ticket Wallet</h1>
            <p className="text-text-secondary text-xs font-medium">{upcomingTickets.length} upcoming · {pastTickets.length} past</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mx-4 mb-5 bg-surface rounded-2xl p-1 border border-app-border">
        {(['upcoming', 'past'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-black capitalize transition-all ${
              tab === t ? 'bg-white text-primary shadow-sm border border-app-border' : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {t === 'upcoming' ? `Upcoming (${upcomingTickets.length})` : `Past (${pastTickets.length})`}
          </button>
        ))}
      </div>

      {tab === 'past' && pastTickets.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center px-6">
          <p className="text-5xl mb-4">🎟️</p>
          <p className="text-text-primary font-black text-lg">No past events yet</p>
          <p className="text-text-secondary text-sm mt-1">Tickets for past events will show here</p>
        </div>
      ) : (
        <div className="px-4 flex flex-col gap-5">
          {visibleTickets.map((ticket) => {
            const isOpen = expandedId === ticket.id;

            return (
              <div key={ticket.id} className="rounded-3xl overflow-hidden shadow-xl shadow-black/10 border border-app-border bg-white">

                {/* Event image banner */}
                <div
                  className="relative h-32 cursor-pointer"
                  onClick={() => setExpandedId(isOpen ? null : ticket.id)}
                >
                  <img src={ticket.eventBannerUrl} alt={ticket.eventTitle} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                  <div className="absolute inset-0 px-4 py-3 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <span className="bg-green-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide shadow">
                        ✓ Confirmed
                      </span>
                      <span className="bg-white/20 backdrop-blur-sm text-white/90 text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20">
                        {ticket.tierName} × {ticket.qty}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-black text-lg leading-tight">{ticket.eventTitle}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Calendar size={10} className="text-white/60" />
                        <p className="text-white/70 text-[10px] font-medium">{ticket.eventDate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Perforated divider */}
                <div className="relative bg-white flex items-center h-0 overflow-visible z-10">
                  <div className="absolute -left-3.5 w-7 h-7 rounded-full bg-app-bg border border-app-border" />
                  <div className="flex-1 mx-6 border-t-2 border-dashed border-app-border" />
                  <div className="absolute -right-3.5 w-7 h-7 rounded-full bg-app-bg border border-app-border" />
                </div>

                {/* Ticket body */}
                <div className="px-4 pt-5 pb-4">
                  <div className="flex items-start gap-4">

                    {/* QR code */}
                    <div
                      className={`transition-all duration-300 overflow-hidden flex-shrink-0 ${isOpen ? 'w-[96px] opacity-100' : 'w-0 opacity-0'}`}
                    >
                      <div className="w-24 h-24 rounded-2xl border-2 border-app-border p-1.5 bg-white">
                        <QRCodeSVG value={ticket.qr} size={82} level="M" />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <MapPin size={11} className="text-primary flex-shrink-0" />
                        <p className="text-text-secondary text-[11px] font-medium truncate">{ticket.venueName}, {ticket.city}</p>
                      </div>
                      <p className="text-text-primary font-black text-2xl leading-tight">{formatPrice(ticket.totalPrice, 'ZAR')}</p>
                      <p className="text-text-muted text-[10px] font-bold uppercase tracking-wider mt-0.5">Total paid</p>

                      <button
                        onClick={() => setExpandedId(isOpen ? null : ticket.id)}
                        className="mt-3 flex items-center gap-1 text-primary text-[11px] font-black hover:underline"
                      >
                        {isOpen ? 'Hide QR code' : 'Show QR code'}
                        <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* View event link */}
                  <button
                    onClick={() => navigate(`/event/${ticket.eventId}`)}
                    className="w-full mt-4 py-2.5 rounded-2xl border border-app-border text-text-secondary text-xs font-bold hover:border-primary/40 hover:text-primary hover:bg-primary-light transition-all"
                  >
                    View Event Details →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      </div>{/* /max-width */}
    </div>
  );
}
