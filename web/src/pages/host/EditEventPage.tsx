import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDemoStore } from '../../store/demoStore';
import { PageHeader } from '../../components/layout/PageHeader';

export default function EditEventPage() {
  const { id } = useParams(); const navigate = useNavigate();
  const event = useDemoStore((state) => state.customEvents.find((item) => item.id === id));
  const updateEvent = useDemoStore((state) => state.updateEvent);
  const [title, setTitle] = useState(event?.title ?? ''); const [description, setDescription] = useState(event?.description ?? '');
  const [venue, setVenue] = useState(event?.venueName ?? ''); const [capacity, setCapacity] = useState(String(event?.totalCapacity ?? ''));
  if (!event) return <div className="p-10 text-center">Event not found.</div>;
  const save = () => { if (!title.trim() || !description.trim() || !venue.trim() || Number(capacity) < 1) return; updateEvent(event.id, { title: title.trim(), description: description.trim(), venueName: venue.trim(), totalCapacity: Number(capacity) }, event.status === 'cancelled'); navigate('/host/dashboard'); };
  const field = 'w-full border border-app-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary';
  return <div><PageHeader title={event.status === 'cancelled' ? 'Fix & Resubmit' : 'Edit Event'}/><div className="max-w-2xl mx-auto px-4 py-5 flex flex-col gap-4">{event.rejectionReason && <div className="bg-red-50 border border-red-200 rounded-2xl p-4"><p className="text-[10px] uppercase font-black text-red-500">Admin feedback</p><p className="text-sm text-red-700 mt-1">{event.rejectionReason}</p></div>}<label className="text-xs font-bold text-text-secondary">Event title<input className={`${field} mt-1.5`} value={title} onChange={(e) => setTitle(e.target.value)}/></label><label className="text-xs font-bold text-text-secondary">Description<textarea rows={5} className={`${field} mt-1.5 resize-none`} value={description} onChange={(e) => setDescription(e.target.value)}/></label><div className="grid sm:grid-cols-2 gap-3"><label className="text-xs font-bold text-text-secondary">Venue<input className={`${field} mt-1.5`} value={venue} onChange={(e) => setVenue(e.target.value)}/></label><label className="text-xs font-bold text-text-secondary">Capacity<input type="number" className={`${field} mt-1.5`} value={capacity} onChange={(e) => setCapacity(e.target.value)}/></label></div><button onClick={save} className="bg-gradient-to-r from-primary to-[#0EA8AC] text-white font-black py-3.5 rounded-2xl shadow-lg">{event.status === 'cancelled' ? 'Save & Resubmit for Review' : 'Save Changes'}</button></div></div>;
}
