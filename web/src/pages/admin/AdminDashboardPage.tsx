import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { useDemoStore } from '../../store/demoStore';
import { Eye, RotateCcw, ShieldCheck, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { setDemoRole } from '../../lib/demoMode';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const events = useDemoStore((state) => state.customEvents);
  const tickets = useDemoStore((state) => state.tickets);
  const approveEvent = useDemoStore((state) => state.updateEventStatus);
  const rejectEvent = useDemoStore((state) => state.rejectEvent);
  const reset = useDemoStore((state) => state.reset);
  const [message, setMessage] = useState('');
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');
  const pending = events.filter((event) => event.status === 'draft');
  const selectedEvent = events.find((event) => event.id === rejectId);

  const switchToCustomer = () => {
    setUser(setDemoRole('user'));
    navigate('/');
  };

  const approve = (id: string) => {
    approveEvent(id, 'published');
    setMessage('Event approved and added to discovery.');
    setTimeout(() => setMessage(''), 2500);
  };

  const confirmReject = () => {
    if (!rejectId || reason.trim().length < 10) {
      setReasonError('Please provide a clear reason of at least 10 characters.');
      return;
    }
    rejectEvent(rejectId, reason);
    setRejectId(null);
    setReason('');
    setReasonError('');
    setMessage('Event rejected and the reason was sent to the host.');
    setTimeout(() => setMessage(''), 2500);
  };

  return <div className="pb-8">
    <PageHeader title="Admin Dashboard" />
    <div className="px-4 py-4 max-w-4xl mx-auto flex flex-col gap-5">
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 text-white p-5 flex flex-col sm:flex-row sm:items-center gap-4"><div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center"><ShieldCheck/></div><div className="flex-1"><p className="font-black">Admin moderation</p><p className="text-white/60 text-xs mt-1">Admin accounts can preview, approve, or reject events. Ticket purchasing is disabled.</p></div><div className="flex gap-2"><button onClick={switchToCustomer} className="flex items-center gap-1.5 bg-primary px-3 py-2 rounded-xl text-xs font-black"><ArrowLeft size={14}/> Customer view</button><button onClick={() => window.confirm('Reset all demo events, tickets and notifications?') && reset()} className="flex items-center gap-1.5 bg-white/10 px-3 py-2 rounded-xl text-xs font-black"><RotateCcw size={14}/> Reset demo</button></div></div>
      {message && <div className="rounded-xl bg-green-50 border border-green-200 text-green-700 font-bold text-sm px-4 py-3">{message}</div>}
      <div className="grid grid-cols-3 gap-3">{[{label:'Pending',value:pending.length},{label:'Total events',value:events.length},{label:'Demo bookings',value:tickets.length}].map((item) => <div key={item.label} className="bg-white border border-app-border rounded-2xl p-4 text-center"><p className="text-2xl font-black text-text-primary">{item.value}</p><p className="text-xs text-text-secondary">{item.label}</p></div>)}</div>
      <section><h2 className="font-black text-text-primary mb-3">Pending events ({pending.length})</h2>{pending.length === 0 ? <div className="bg-white border border-app-border rounded-2xl p-10 text-center"><p className="font-bold text-text-primary">Review queue is clear</p><p className="text-sm text-text-secondary mt-1">Create an event from the host dashboard to test moderation.</p></div> : <div className="flex flex-col gap-3">{pending.map((event) => <div key={event.id} className="bg-white border border-app-border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"><img src={event.bannerUrl} alt="" className="w-full sm:w-20 h-20 rounded-xl object-cover"/><div className="flex-1"><p className="font-black text-text-primary">{event.title}</p><p className="text-xs text-text-secondary mt-1">{event.venueName} · {event.city} · {event.totalCapacity} capacity</p></div><div className="flex gap-2"><button onClick={() => navigate(`/admin/event/${event.id}`)} title="Review event" className="p-2.5 rounded-xl border border-app-border text-text-secondary"><Eye size={16}/></button><button onClick={() => { setRejectId(event.id); setReason(''); setReasonError(''); }} className="px-3 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-black">Reject</button><button onClick={() => approve(event.id)} className="px-3 py-2 rounded-xl bg-green-500 text-white text-xs font-black">Approve</button></div></div>)}</div>}</section>
    </div>
    {selectedEvent && <div className="fixed inset-0 z-[60] bg-black/60 flex items-end sm:items-center justify-center" onClick={(event) => event.target === event.currentTarget && setRejectId(null)}><div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl"><div className="flex items-start justify-between mb-4"><div><p className="text-xs font-black text-red-500 uppercase tracking-wider">Reject event</p><h2 className="text-lg font-black text-text-primary mt-1">{selectedEvent.title}</h2></div><button onClick={() => setRejectId(null)} className="p-2 rounded-xl bg-surface"><X size={16}/></button></div><label className="text-xs font-bold text-text-secondary">Reason for rejection *</label><textarea value={reason} onChange={(event) => { setReason(event.target.value); setReasonError(''); }} rows={4} placeholder="Explain what the host needs to correct before resubmitting..." className="w-full mt-2 border border-app-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-red-400 resize-none"/>{reasonError && <p className="text-red-500 text-xs font-bold mt-2">{reasonError}</p>}<p className="text-text-muted text-[11px] mt-2">This reason will appear on the host dashboard and in notifications.</p><div className="flex gap-3 mt-5"><button onClick={() => setRejectId(null)} className="flex-1 py-3 rounded-xl border border-app-border font-black text-sm text-text-secondary">Cancel</button><button onClick={confirmReject} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-black text-sm">Reject event</button></div></div></div>}
  </div>;
}
