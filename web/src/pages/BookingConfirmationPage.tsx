import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, CalendarPlus, Share2, Ticket, Home } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useDemoStore } from '../store/demoStore';
import { formatPrice } from '@utils/formatters';
import { useToastStore } from '../store/toastStore';

export default function BookingConfirmationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.show);
  const ticket = useDemoStore((state) => state.tickets.find((item) => item.id === id));
  if (!ticket) return <div className="p-12 text-center"><p className="font-black text-text-primary">Booking not found</p><button onClick={() => navigate('/')} className="text-primary mt-3">Return home</button></div>;
  const addCalendar = () => {
    const start = new Date(ticket.eventStartMs); const end = new Date(start.getTime() + 3 * 3600000);
    const stamp = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(ticket.eventTitle)}&dates=${stamp(start)}/${stamp(end)}&location=${encodeURIComponent(`${ticket.venueName}, ${ticket.city}`)}`, '_blank');
  };
  const share = async () => { const data = { title: ticket.eventTitle, text: `I'm going to ${ticket.eventTitle} with HangOut!`, url: `${window.location.origin}/event/${ticket.eventId}` }; if (navigator.share) await navigator.share(data); else { await navigator.clipboard.writeText(data.url); showToast('Event link copied.', 'success'); } };
  return <div className="max-w-xl mx-auto px-4 py-10"><div className="bg-white border border-app-border rounded-3xl overflow-hidden shadow-xl"><div className="bg-gradient-to-br from-primary to-[#087D91] text-white text-center p-7"><CheckCircle2 size={52} className="mx-auto"/><h1 className="text-2xl font-black mt-3">Booking confirmed!</h1><p className="text-white/70 text-sm mt-1">Your ticket is ready to use.</p></div><div className="p-6"><div className="flex gap-4 items-center"><img src={ticket.eventBannerUrl} alt="" className="w-20 h-20 rounded-2xl object-cover"/><div><p className="font-black text-text-primary">{ticket.eventTitle}</p><p className="text-xs text-text-secondary mt-1">{ticket.eventDate}</p><p className="text-xs text-text-secondary">{ticket.venueName}, {ticket.city}</p></div></div><div className="my-6 border-t border-dashed border-app-border"/><div className="flex items-center justify-between"><div><p className="text-[10px] uppercase font-black text-text-muted">Booking reference</p><p className="font-mono font-black text-text-primary mt-1">{ticket.id.toUpperCase()}</p><p className="text-sm font-bold text-text-secondary mt-2">{ticket.tierName} × {ticket.qty} · {formatPrice(ticket.totalPrice)}</p></div><div className="p-2 bg-white border border-app-border rounded-xl"><QRCodeSVG value={ticket.qr} size={76}/></div></div><div className="grid grid-cols-2 gap-2 mt-6"><button onClick={addCalendar} className="py-3 rounded-xl bg-primary-light text-primary text-xs font-black flex items-center justify-center gap-1.5"><CalendarPlus size={15}/> Add to calendar</button><button onClick={share} className="py-3 rounded-xl bg-orange-50 text-secondary text-xs font-black flex items-center justify-center gap-1.5"><Share2 size={15}/> Share</button><button onClick={() => navigate('/wallet')} className="py-3 rounded-xl border border-app-border text-text-secondary text-xs font-black flex items-center justify-center gap-1.5"><Ticket size={15}/> View wallet</button><button onClick={() => navigate('/')} className="py-3 rounded-xl border border-app-border text-text-secondary text-xs font-black flex items-center justify-center gap-1.5"><Home size={15}/> Home</button></div></div></div></div>;
}
