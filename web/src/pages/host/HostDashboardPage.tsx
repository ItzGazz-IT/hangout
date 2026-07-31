import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { useDemoStore } from '../../store/demoStore';
import { LayoutDashboard, TrendingUp, Users, CalendarCheck, Plus, Eye, Trash2, ScanLine, X, CheckCircle2, Edit3 } from 'lucide-react';
import { formatPrice, formatEventDate } from '@utils/formatters';

export default function HostDashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const tickets = useDemoStore((state) => state.tickets);
  const events = useDemoStore((state) => state.customEvents);
  const deleteEvent = useDemoStore((state) => state.deleteEvent);
  const checkIn = useDemoStore((state) => state.checkInTicket);
  const [tab, setTab] = useState<'events' | 'bookings'>('events');
  const [showScanner, setShowScanner] = useState(false);
  const [code, setCode] = useState('');
  const [scanResult, setScanResult] = useState<'success' | 'duplicate' | 'invalid' | null>(null);
  const confirmed = tickets.filter((ticket) => ticket.status === 'confirmed');
  const revenue = confirmed.reduce((sum, ticket) => sum + ticket.totalPrice, 0);
  const checkedIn = confirmed.filter((ticket) => ticket.checkedInAtMs).length;
  const stats = [
    { label: 'My Events', value: String(events.length), icon: CalendarCheck, color: 'text-primary', bg: 'bg-primary-light' },
    { label: 'Tickets Sold', value: String(confirmed.reduce((sum, ticket) => sum + ticket.qty, 0)), icon: Users, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Demo Revenue', value: formatPrice(revenue, 'ZAR'), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Checked In', value: String(checkedIn), icon: LayoutDashboard, color: 'text-violet-500', bg: 'bg-violet-50' },
  ];

  const scan = () => {
    if (!code.trim()) return;
    setScanResult(checkIn(code));
  };

  return (
    <div className="pb-8 max-w-screen-xl mx-auto">
      <div className="px-4 pt-6 pb-5 flex items-start justify-between gap-3">
        <div><p className="text-text-secondary text-sm">Welcome back</p><h1 className="text-2xl font-black text-text-primary">{user?.displayName?.split(' ')[0] ?? 'Host'}</h1><span className="text-[10px] font-black text-secondary">DEMO HOST</span></div>
        <div className="flex gap-2">
          <button onClick={() => setShowScanner(true)} className="flex items-center gap-1.5 border border-primary text-primary text-xs font-black px-3 py-2.5 rounded-xl"><ScanLine size={15}/> Check in</button>
          <button onClick={() => navigate('/host/create-event')} className="flex items-center gap-1.5 bg-primary text-white text-xs font-black px-3 py-2.5 rounded-xl shadow"><Plus size={15}/> New event</button>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-4 mb-5">
        {stats.map((stat) => <div key={stat.label} className="bg-white rounded-2xl p-4 border border-app-border shadow-sm"><div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}><stat.icon size={17} className={stat.color}/></div><p className="text-text-primary font-black text-xl">{stat.value}</p><p className="text-text-secondary text-xs">{stat.label}</p></div>)}
      </div>
      <div className="flex gap-1 mx-4 mb-4 bg-surface rounded-2xl p-1 border border-app-border">
        {(['events','bookings'] as const).map((item) => <button key={item} onClick={() => setTab(item)} className={`flex-1 py-2.5 rounded-xl text-sm font-black capitalize ${tab === item ? 'bg-white text-primary shadow-sm' : 'text-text-muted'}`}>{item} ({item === 'events' ? events.length : tickets.length})</button>)}
      </div>
      {tab === 'events' ? <div className="px-4 grid md:grid-cols-2 gap-3">
        {events.length === 0 && <div className="md:col-span-2 text-center py-14 bg-white border border-dashed border-primary/30 rounded-2xl"><p className="font-black text-text-primary">Create your first demo event</p><p className="text-sm text-text-secondary mt-1">It will appear here and in admin review immediately.</p></div>}
        {events.map((event) => <div key={event.id} className="bg-white rounded-2xl border border-app-border overflow-hidden shadow-sm"><div className="h-32 relative"><img src={event.bannerUrl} alt={event.title} className="w-full h-full object-cover"/><span className={`absolute top-3 right-3 text-[10px] font-black px-2 py-1 rounded-full ${event.status === 'published' ? 'bg-green-500 text-white' : event.status === 'cancelled' ? 'bg-red-500 text-white' : 'bg-yellow-400 text-black'}`}>{event.status === 'draft' ? 'IN REVIEW' : event.status === 'cancelled' ? 'REJECTED' : event.status.toUpperCase()}</span></div><div className="p-4"><p className="font-black text-text-primary">{event.title}</p><p className="text-xs text-text-secondary mt-1">{formatEventDate(event.startDate)} · {event.city}</p>{event.rejectionReason && <div className="mt-3 rounded-xl bg-red-50 border border-red-200 p-3"><p className="text-[10px] uppercase tracking-wider font-black text-red-500">Rejection reason</p><p className="text-xs text-red-700 mt-1">{event.rejectionReason}</p></div>}</div><div className="grid grid-cols-4 border-t border-app-border divide-x divide-app-border"><button onClick={() => navigate(`/event/${event.id}`)} className="py-2.5 flex justify-center gap-1 text-xs font-bold text-text-secondary"><Eye size={13}/> View</button><button onClick={() => navigate(`/host/event/${event.id}/edit`)} className="py-2.5 flex justify-center gap-1 text-xs font-bold text-primary"><Edit3 size={13}/> {event.status === 'cancelled' ? 'Fix' : 'Edit'}</button><button onClick={() => navigate(`/host/event/${event.id}/attendees`)} className="py-2.5 flex justify-center gap-1 text-xs font-bold text-primary"><Users size={13}/> Guests</button><button onClick={() => window.confirm(`Delete ${event.title}?`) && deleteEvent(event.id)} className="py-2.5 flex justify-center text-red-500"><Trash2 size={13}/></button></div></div>)}
      </div> : <div className="px-4 flex flex-col gap-2">{tickets.map((ticket) => <div key={ticket.id} className="bg-white rounded-2xl border border-app-border px-4 py-3 flex items-center gap-3"><div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ticket.checkedInAtMs ? 'bg-green-100 text-green-600' : ticket.status === 'cancelled' ? 'bg-red-100 text-red-500' : 'bg-primary-light text-primary'}`}>{ticket.checkedInAtMs ? <CheckCircle2 size={18}/> : <Users size={18}/>}</div><div className="flex-1 min-w-0"><p className="font-black text-sm text-text-primary truncate">{ticket.eventTitle}</p><p className="text-xs text-text-secondary">{ticket.tierName} × {ticket.qty} · {ticket.checkedInAtMs ? 'Checked in' : ticket.status}</p></div><p className="font-black text-sm text-green-600">{formatPrice(ticket.totalPrice)}</p></div>)}</div>}
      {showScanner && <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center" onClick={(event) => event.target === event.currentTarget && setShowScanner(false)}><div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6"><div className="flex justify-between items-center mb-5"><div><p className="font-black text-lg text-text-primary">Demo check-in</p><p className="text-xs text-text-secondary">Paste a ticket ID or QR code</p></div><button onClick={() => setShowScanner(false)}><X/></button></div><input value={code} onChange={(event) => { setCode(event.target.value); setScanResult(null); }} placeholder="HANGOUT-TK-..." className="w-full border border-app-border rounded-xl px-4 py-3 outline-none focus:border-primary"/><button onClick={scan} className="w-full mt-3 bg-primary text-white font-black py-3 rounded-xl">Validate ticket</button>{scanResult && <div className={`mt-4 rounded-xl p-3 text-sm font-bold ${scanResult === 'success' ? 'bg-green-50 text-green-700' : scanResult === 'duplicate' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-600'}`}>{scanResult === 'success' ? 'Ticket checked in successfully.' : scanResult === 'duplicate' ? 'This ticket has already been used.' : 'Ticket not found or cancelled.'}</div>}<p className="text-[10px] text-text-muted mt-4">Try seeded code: HANGOUT-TK-A1B2C3D4</p></div></div>}
    </div>
  );
}
