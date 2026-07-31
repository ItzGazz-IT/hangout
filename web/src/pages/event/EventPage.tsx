import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Share2, MapPin, Calendar, Users, Tag, Check, Minus, Plus, X, CreditCard, CheckCircle2, Loader2, Ticket, Wifi } from 'lucide-react';
import { useEventDetail } from '@hooks/useEvents';
import { useAuthStore } from '@store/authStore';
import { bookingsService } from '@services/firebase/bookings.service';
import { getCategoryById } from '../../lib/categories';
import { formatEventDate, formatPrice, capacityPercent, toDate } from '@utils/formatters';
import { MOCK_EVENTS } from '../../lib/mockData';
import { isDemoMode } from '../../lib/demoMode';
import { useDemoStore } from '../../store/demoStore';
import { useToastStore } from '../../store/toastStore';

// ─── Payment Modal ────────────────────────────────────────────────────────────

interface PaymentModalProps {
  eventTitle: string;
  eventBannerUrl: string;
  eventId: string;
  eventDate: string;
  eventStartMs: number;
  venueName: string;
  city: string;
  tierName: string;
  tierPrice: number;
  qty: number;
  onClose: () => void;
  onSuccess: (ticketId: string) => void;
}

function fmtCard(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function fmtExpiry(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

function PaymentModal({ eventTitle, eventBannerUrl, eventId, eventDate, eventStartMs, venueName, city, tierName, tierPrice, qty, onClose, onSuccess }: PaymentModalProps) {
  const addTicket = useDemoStore((s) => s.addTicket);
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardFlipped, setCardFlipped] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');

  const subtotal = tierPrice * qty;
  const total = Math.max(0, subtotal - discount);
  const canPay = cardNumber.replace(/\s/g, '').length === 16 && expiry.length === 5 && cvv.length >= 3 && cardName.trim().length >= 2;

  const handlePay = async () => {
    if (!canPay) return;
    setStep('processing');
    await new Promise((r) => setTimeout(r, 1800));
    const qr = 'HANGOUT-TK-' + Math.random().toString(36).slice(2, 10).toUpperCase();
    const ticket = {
      id: 'demo-' + Date.now(),
      eventId,
      eventTitle,
      eventBannerUrl,
      eventDate,
      eventStartMs,
      venueName,
      city,
      tierName,
      qty,
      totalPrice: total,
      qr,
    };
    addTicket(ticket);
    setStep('success');
    setTimeout(() => { onClose(); onSuccess(ticket.id); }, 2200);
  };

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'HANGOUT10') { setDiscount(Math.round(subtotal * 0.1)); setPromoMessage('10% discount applied'); }
    else if (code === 'WELCOME50') { setDiscount(Math.min(5000, subtotal)); setPromoMessage('R50 discount applied'); }
    else { setDiscount(0); setPromoMessage(code ? 'Code is invalid or expired' : 'Enter a promo code'); }
  };

  const inputCls = 'w-full rounded-xl border border-app-border bg-surface px-3.5 py-3 text-text-primary text-sm font-semibold placeholder:text-text-muted focus:outline-none focus:border-primary focus:bg-white transition-colors';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && step === 'form' && onClose()}>
      <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] overflow-hidden max-h-[92vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-app-border">
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Secure Checkout</p>
            <p className="text-text-primary font-black text-base leading-tight">Complete Payment</p>
          </div>
          {step === 'form' && (
            <button onClick={onClose} className="w-9 h-9 rounded-xl bg-surface border border-app-border flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors">
              <X size={16} className="text-text-secondary" />
            </button>
          )}
        </div>

        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <Loader2 size={48} className="text-primary animate-spin mb-4" />
            <p className="text-text-primary font-black text-lg">Processing payment…</p>
            <p className="text-text-secondary text-sm mt-1">Please don't close this window</p>
          </div>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5 shadow-lg shadow-green-200">
              <CheckCircle2 size={40} className="text-green-500" />
            </div>
            <p className="text-text-primary font-black text-2xl mb-1">Payment Successful!</p>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              Your ticket for <strong className="text-text-primary">{eventTitle}</strong> is now in your Wallet.
            </p>
          </div>
        )}

        {step === 'form' && (
          <div className="px-5 py-5 flex flex-col gap-5">

            {/* Order summary */}
            <div className="rounded-2xl overflow-hidden border border-app-border shadow-sm">
              <div className="relative h-20">
                <img src={eventBannerUrl} alt={eventTitle} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 to-black/30 px-4 flex flex-col justify-center">
                  <p className="text-white font-black text-sm leading-tight">{eventTitle}</p>
                  <p className="text-white/70 text-[11px] mt-0.5">{eventDate}</p>
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-3 bg-surface">
                <span className="text-text-secondary text-sm font-semibold">{tierName} × {qty}</span>
                <span className="text-text-primary font-black text-base">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Payment method pill */}
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Payment Method</p>
              <div className="flex items-center gap-2 rounded-xl border-2 border-primary bg-primary-light px-3.5 py-2.5">
                <CreditCard size={16} className="text-primary" />
                <span className="text-primary font-black text-sm">Credit / Debit Card</span>
                <div className="ml-auto w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
              </div>
            </div>

            {/* Live HangOut card preview */}
            <div className="mx-auto w-full max-w-[350px]">
              <div className="relative aspect-[1.586/1] [perspective:1200px]">
                <div
                  className="absolute inset-0 transition-transform duration-500 ease-out"
                  style={{ transformStyle: 'preserve-3d', transform: cardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                >
                  <div className="absolute inset-0 overflow-hidden rounded-[24px] bg-gradient-to-br from-[#08C5C9] via-primary to-[#087D91] p-5 text-white shadow-2xl shadow-primary/30" style={{ backfaceVisibility: 'hidden' }}>
                    <div className="absolute -right-12 -top-14 h-40 w-40 rounded-full bg-white/10" />
                    <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-secondary/25" />
                    <div className="relative flex items-start justify-between">
                      <div><p className="text-lg font-black tracking-tight">Hang<span className="text-secondary">Out</span></p><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">Demo card</p></div>
                      <Wifi size={23} className="rotate-90 text-white/80" />
                    </div>
                    <div className="relative mt-5 h-8 w-11 rounded-md border border-amber-200/80 bg-gradient-to-br from-amber-200 to-amber-500 shadow-inner"><div className="absolute inset-y-0 left-1/2 border-l border-amber-700/30"/><div className="absolute inset-x-0 top-1/2 border-t border-amber-700/30"/></div>
                    <p className="relative mt-4 font-mono text-[clamp(15px,5vw,21px)] font-bold tracking-[0.12em] drop-shadow">{cardNumber || '•••• •••• •••• ••••'}</p>
                    <div className="relative mt-4 flex items-end justify-between"><div className="min-w-0"><p className="text-[8px] font-bold uppercase tracking-widest text-white/55">Card holder</p><p className="truncate text-xs font-black uppercase tracking-wider">{cardName || 'YOUR NAME'}</p></div><div className="text-right"><p className="text-[8px] font-bold uppercase tracking-widest text-white/55">Expires</p><p className="font-mono text-xs font-black">{expiry || 'MM/YY'}</p></div></div>
                  </div>
                  <div className="absolute inset-0 overflow-hidden rounded-[24px] bg-gradient-to-br from-[#087D91] via-primary to-[#08C5C9] text-white shadow-2xl shadow-primary/30" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <div className="mt-7 h-11 bg-slate-950/80" />
                    <div className="px-5 pt-5"><p className="mb-1 text-right text-[8px] font-bold uppercase tracking-widest text-white/60">Security code</p><div className="flex h-10 items-center justify-end rounded-lg bg-white px-3 font-mono font-black tracking-[0.25em] text-slate-700 shadow-inner">{cvv ? '•'.repeat(cvv.length) : '•••'}</div><div className="mt-5 flex items-center justify-between"><p className="max-w-[190px] text-[8px] leading-relaxed text-white/55">Demo payment card. No real banking information is stored or processed.</p><p className="text-base font-black">Hang<span className="text-secondary">Out</span></p></div></div>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-center text-[10px] font-semibold text-text-muted">The card updates as you type and flips for CVV</p>
            </div>

            {/* Card fields */}
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-text-secondary mb-1.5 block">Card Number</label>
                <input className={inputCls} placeholder="4111 1111 1111 1111" value={cardNumber} onFocus={() => setCardFlipped(false)} onChange={(e) => setCardNumber(fmtCard(e.target.value))} maxLength={19} inputMode="numeric" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-text-secondary mb-1.5 block">Expiry</label>
                  <input className={inputCls} placeholder="MM/YY" value={expiry} onFocus={() => setCardFlipped(false)} onChange={(e) => setExpiry(fmtExpiry(e.target.value))} maxLength={5} inputMode="numeric" />
                </div>
                <div>
                  <label className="text-xs font-bold text-text-secondary mb-1.5 block">CVV</label>
                  <input className={inputCls} placeholder="123" value={cvv} onFocus={() => setCardFlipped(true)} onBlur={() => setCardFlipped(false)} onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} maxLength={4} inputMode="numeric" type="password" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-text-secondary mb-1.5 block">Name on Card</label>
                <input className={inputCls} placeholder="John Smith" value={cardName} onFocus={() => setCardFlipped(false)} onChange={(e) => setCardName(e.target.value)} autoComplete="cc-name" />
              </div>
            </div>

            {/* Pay button */}
            <div>
              <label className="text-xs font-bold text-text-secondary mb-1.5 block">Promo code</label>
              <div className="flex gap-2"><input className={inputCls} value={promoCode} onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoMessage(''); }} placeholder="HANGOUT10"/><button type="button" onClick={applyPromo} className="px-4 rounded-xl border border-primary text-primary text-xs font-black">Apply</button></div>
              {promoMessage && <p className={`text-xs font-bold mt-1.5 ${discount ? 'text-green-600' : 'text-red-500'}`}>{promoMessage}</p>}
              {discount > 0 && <div className="flex justify-between text-xs mt-2"><span className="text-text-secondary">Discount</span><span className="font-black text-green-600">−{formatPrice(discount)}</span></div>}
            </div>
            <button
              onClick={handlePay}
              disabled={!canPay}
              className="w-full bg-gradient-to-r from-primary to-[#0EA8AC] text-white font-black text-base py-4 rounded-2xl shadow-xl shadow-primary/35 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:shadow-none"
            >
              Pay {formatPrice(total)}
            </button>

            <p className="text-center text-text-muted text-[10px]">🔒 This is a demo environment — no real charges are made</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Event Page ───────────────────────────────────────────────────────────────

export default function EventPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { event: firestoreEvent } = useEventDetail(id ?? '');
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const showToast = useToastStore((s) => s.show);

  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [bookingError, setBookingError] = useState('');
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const demoTickets = useDemoStore((s) => s.tickets);
  const savedIds = useDemoStore((s) => s.savedEventIds);
  const toggleSaved = useDemoStore((s) => s.toggleSaved);

  // Fall back to mock data
  const event = firestoreEvent ?? MOCK_EVENTS.find((e) => e.id === id) ?? null;

  const alreadyBooked = !!id && demoTickets.some((t) => t.eventId === id && t.status === 'confirmed');
  const saved = !!id && savedIds.includes(id);

  const shareEvent = async () => {
    const shareData = { title: event?.title ?? 'HangOut event', text: `Check out ${event?.title ?? 'this event'} on HangOut`, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Event link copied to your clipboard.', 'success');
      }
    } catch { /* Sharing was dismissed. */ }
  };
  const openMaps = () => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event?.venueName ?? ''}, ${event?.address ?? ''}, ${event?.city ?? ''}`)}`, '_blank');
  const addCalendar = () => {
    if (!event) return; const start = toDate(event.startDate); const end = toDate(event.endDate);
    const stamp = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${stamp(start)}/${stamp(end)}&location=${encodeURIComponent(`${event.venueName}, ${event.city ?? ''}`)}&details=${encodeURIComponent(event.description)}`, '_blank');
  };

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-app-bg">
        <p className="text-text-secondary">Event not found.</p>
        <button onClick={() => navigate(-1)} className="text-primary font-bold text-sm hover:underline">← Back</button>
      </div>
    );
  }

  const category = getCategoryById(event.category);
  const lowestPrice = event.ticketTiers.length ? Math.min(...event.ticketTiers.map((t) => t.price)) : 0;
  const fillPct = capacityPercent(event.totalBooked, event.totalCapacity);
  const activeTier = event.ticketTiers.find((t) => t.id === (selectedTier ?? event.ticketTiers[0]?.id)) ?? event.ticketTiers[0];

  const onBook = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    // Demo mode: open the mock payment modal instead of calling Firebase
    if (isDemoMode()) { setShowPayment(true); return; }
    setBookingStatus('loading');
    setBookingError('');
    try {
      await bookingsService.create({
        userId: (user as any).uid,
        eventId: event.id,
        eventTitle: event.title,
        eventBannerUrl: event.bannerUrl,
        eventStartDate: event.startDate,
        venueName: event.venueName,
        city: event.city ?? '',
        tierSelections: [{ tier: activeTier ?? { id: 'general', name: 'General', price: 0, currency: 'ZAR', capacity: event.totalCapacity, sold: event.totalBooked }, quantity: qty }],
        ...(event.isFree ? { paymentProvider: 'free' as const } : {}),
      });
      setBookingStatus('done');
    } catch (err: any) {
      setBookingStatus('error');
      setBookingError(err.message || 'Could not complete booking.');
    }
  };

  return (
    <div className="pb-36 bg-app-bg">

      {/* ── Full-bleed hero ── */}
      <div className="relative h-80 overflow-hidden">
        <img src={event.bannerUrl} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85" />

        {/* Back + actions */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-2xl bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-black/60 transition-colors"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => id && toggleSaved(id)}
              className={`w-10 h-10 rounded-2xl backdrop-blur-md flex items-center justify-center border border-white/20 transition-colors ${saved ? 'bg-red-500/80' : 'bg-black/40 hover:bg-black/60'}`}
            >
              <Heart size={17} className={saved ? 'text-white fill-white' : 'text-white'} />
            </button>
            <button onClick={shareEvent} className="w-10 h-10 rounded-2xl bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-black/60 transition-colors">
              <Share2 size={17} className="text-white" />
            </button>
          </div>
        </div>

        {/* Badges at bottom of hero */}
        <div className="absolute bottom-5 left-5 flex items-center gap-2">
          {event.featured && (
            <span className="bg-secondary text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg">⭐ Featured</span>
          )}
          {category && (
            <span className="text-[10px] font-black px-2.5 py-1 rounded-full text-white shadow-lg" style={{ backgroundColor: category.color }}>
              {category.emoji} {category.label}
            </span>
          )}
        </div>
      </div>

      {/* ── Content sheet ── */}
      <div className="relative -mt-5 bg-app-bg rounded-t-[28px] z-10 pt-6 px-5">

        {/* Title + host */}
        <h1 className="text-text-primary font-black text-[26px] leading-tight mb-1">{event.title}</h1>
        <p className="text-text-secondary text-sm font-semibold mb-5">Hosted by <span className="text-primary">{event.hostName}</span></p>

        {/* Info cards row */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 border border-app-border shadow-sm shadow-black/4">
            <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
              <Calendar size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-0.5">Date &amp; Time</p>
              <p className="text-text-primary font-bold text-sm">{formatEventDate(event.startDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 border border-app-border shadow-sm shadow-black/4">
            <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
              <MapPin size={16} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-0.5">Venue</p>
              <p className="text-text-primary font-bold text-sm">{event.venueName}</p>
              <p className="text-text-secondary text-xs truncate">{event.address}{event.city ? `, ${event.city}` : ''}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={addCalendar} className="py-2.5 rounded-xl bg-primary-light text-primary text-xs font-black flex items-center justify-center gap-1.5"><Calendar size={14}/> Add to calendar</button>
            <button onClick={openMaps} className="py-2.5 rounded-xl bg-orange-50 text-secondary text-xs font-black flex items-center justify-center gap-1.5"><MapPin size={14}/> Open in Maps</button>
          </div>
        </div>

        {/* Capacity bar */}
        <div className="bg-white rounded-2xl px-4 py-4 border border-app-border shadow-sm shadow-black/4 mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <Users size={14} className="text-primary" />
              <span className="text-sm font-bold text-text-primary">Attendance</span>
            </div>
            <span className="text-xs font-black text-text-muted">{event.totalBooked.toLocaleString()} / {event.totalCapacity.toLocaleString()}</span>
          </div>
          <div className="h-2.5 bg-surface rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${fillPct > 85 ? 'bg-gradient-to-r from-red-400 to-red-500' : fillPct > 60 ? 'bg-gradient-to-r from-secondary to-[#FF6B00]' : 'bg-gradient-to-r from-primary to-[#0EA8AC]'}`}
              style={{ width: `${Math.min(fillPct, 100)}%` }}
            />
          </div>
          {fillPct > 85 ? (
            <p className="text-red-500 text-[11px] font-bold mt-2">🔥 Almost full — {(event.totalCapacity - event.totalBooked).toLocaleString()} spots left!</p>
          ) : (
            <p className="text-text-muted text-[11px] mt-2">{Math.round(100 - fillPct)}% capacity remaining</p>
          )}
        </div>

        {/* About */}
        <div className="mb-6">
          <h2 className="text-text-primary font-black text-lg mb-2">About this event</h2>
          <p className={`text-text-secondary text-sm leading-relaxed ${!expanded ? 'line-clamp-4' : ''}`}>
            {event.description}
          </p>
          <button onClick={() => setExpanded((v) => !v)} className="text-primary text-sm font-bold mt-1.5 hover:underline">
            {expanded ? 'Show less' : 'Read more →'}
          </button>
        </div>

        {/* Tags */}
        {!!event.tags?.length && (
          <div className="flex flex-wrap gap-2 mb-6">
            {event.tags?.map((tag) => (
              <span key={tag} className="bg-surface border border-app-border text-text-secondary text-[11px] font-semibold px-3 py-1.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* ── Tickets ── */}
        <h2 className="text-text-primary font-black text-lg mb-3">Tickets</h2>
        {event.isFree ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-4 flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
              <Tag size={16} className="text-green-600" />
            </div>
            <div>
              <p className="text-green-700 font-black text-base">FREE Entry</p>
              <p className="text-green-600 text-xs font-medium">No ticket required — just show up!</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 mb-4">
            {event.ticketTiers.map((tier) => {
              const isSelected = (selectedTier ?? event.ticketTiers[0]?.id) === tier.id;
              const soldOut = tier.sold >= tier.capacity;
              return (
                <button
                  key={tier.id}
                  onClick={() => !soldOut && setSelectedTier(tier.id)}
                  disabled={soldOut}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3.5 border-2 transition-all ${
                    isSelected ? 'border-primary bg-primary-light' : soldOut ? 'border-app-border bg-surface opacity-50 cursor-not-allowed' : 'border-app-border bg-white hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-primary bg-primary' : 'border-app-border'}`}>
                      {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
                    </div>
                    <div className="text-left">
                      <p className={`font-black text-sm ${isSelected ? 'text-primary' : 'text-text-primary'}`}>{tier.name}</p>
                      <p className="text-text-muted text-[11px]">{soldOut ? 'Sold out' : `${tier.capacity - tier.sold} remaining`}</p>
                    </div>
                  </div>
                  <span className={`font-black text-base ${isSelected ? 'text-primary' : 'text-text-primary'}`}>
                    {formatPrice(tier.price, tier.currency)}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Quantity selector */}
        {!event.isFree && bookingStatus !== 'done' && (
          <div className="flex items-center justify-between bg-white border border-app-border rounded-2xl px-4 py-3.5 mb-4 shadow-sm">
            <span className="text-text-primary font-bold text-sm">Quantity</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-9 h-9 rounded-xl bg-surface border border-app-border flex items-center justify-center hover:bg-primary-light hover:border-primary/30 transition-colors">
                <Minus size={14} className="text-text-primary" />
              </button>
              <span className="w-7 text-center text-text-primary font-black text-lg">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(10, q + 1))} className="w-9 h-9 rounded-xl bg-surface border border-app-border flex items-center justify-center hover:bg-primary-light hover:border-primary/30 transition-colors">
                <Plus size={14} className="text-text-primary" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ── Sticky Book CTA ── */}
      {user?.role === 'admin' && (
        <div className="fixed bottom-[74px] left-0 right-0 px-4 z-50">
          <div className="max-w-xl mx-auto bg-slate-900 text-white rounded-2xl shadow-2xl px-5 py-4 text-center">
            <p className="font-black text-sm">Admin preview mode</p>
            <p className="text-white/60 text-xs mt-1">Return to the Admin Dashboard to approve or reject this event.</p>
          </div>
        </div>
      )}
      {user?.role !== 'admin' && <div className="fixed bottom-[74px] left-0 right-0 px-4 z-50">
        <div className="bg-white/96 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/15 border border-app-border px-5 py-4">
          {(alreadyBooked || bookingStatus === 'done') && (
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-2xl px-4 py-2.5 mb-3">
              <div className="flex items-center gap-2">
                <Check size={14} className="text-green-600" strokeWidth={3} />
                <span className="text-green-700 font-bold text-xs">You already have tickets for this event</span>
              </div>
              <button
                onClick={() => navigate('/wallet')}
                className="flex items-center gap-1.5 text-primary font-black text-xs hover:underline"
              >
                <Ticket size={12} /> View
              </button>
            </div>
          )}
          <div className="flex items-center gap-4">
            <div className="min-w-0">
              {event.isFree ? (
                <p className="text-green-600 font-black text-2xl">FREE</p>
              ) : (
                <>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wide">Total</p>
                  <p className="text-text-primary font-black text-2xl leading-tight">{formatPrice((activeTier?.price ?? lowestPrice) * qty)}</p>
                </>
              )}
            </div>
            <button
              onClick={onBook}
              disabled={bookingStatus === 'loading'}
              className="flex-1 bg-gradient-to-r from-primary to-[#0EA8AC] text-white font-black text-base py-4 rounded-2xl shadow-xl shadow-primary/35 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {bookingStatus === 'loading' ? 'Booking…' : event.isFree ? 'RSVP Free' : `Book${qty > 1 ? ` × ${qty}` : ' Now'}`}
            </button>
          </div>
          {bookingError && <p className="text-red-500 text-xs font-bold mt-2 text-center">{bookingError}</p>}
        </div>
      </div>}

      {/* ── Demo Payment Modal ── */}
      {user?.role !== 'admin' && showPayment && activeTier && (
        <PaymentModal
          eventTitle={event.title}
          eventBannerUrl={event.bannerUrl}
          eventId={event.id}
          eventDate={formatEventDate(event.startDate)}
          eventStartMs={toDate(event.startDate).getTime()}
          venueName={event.venueName}
          city={event.city ?? ''}
          tierName={activeTier.name}
          tierPrice={activeTier.price}
          qty={qty}
          onClose={() => setShowPayment(false)}
          onSuccess={(ticketId) => { setBookingStatus('done'); navigate(`/booking/${ticketId}`); }}
        />
      )}

    </div>
  );
}

