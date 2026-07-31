import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, MapPin, Calendar, Ticket, Plus, X, CheckCircle2, ChevronDown, ImagePlus } from 'lucide-react';
import { PROVINCES } from '../../lib/mockData';

const CATEGORIES = [
  { id: 'nightlife', label: 'Nightlife', emoji: '🌃' },
  { id: 'music', label: 'Music', emoji: '🎵' },
  { id: 'food', label: 'Food', emoji: '🍔' },
  { id: 'festivals', label: 'Festivals', emoji: '🎪' },
  { id: 'sports', label: 'Sports', emoji: '⚽' },
  { id: 'arts', label: 'Arts', emoji: '🎨' },
  { id: 'social', label: 'Social', emoji: '👥' },
  { id: 'corporate', label: 'Corporate', emoji: '💼' },
];

interface Tier { name: string; price: string; capacity: string; }

function SectionLabel({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <div className="w-7 h-7 rounded-xl bg-primary-light flex items-center justify-center">
        <Icon size={13} className="text-primary" />
      </div>
      <h2 className="text-sm font-black text-text-primary">{label}</h2>
    </div>
  );
}

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Step 1 — Details
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');

  // Step 2 — Location & Date
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [venueName, setVenueName] = useState('');
  const [address, setAddress] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Step 3 — Tickets
  const [totalCapacity, setTotalCapacity] = useState('');
  const [isFree, setIsFree] = useState(false);
  const [tiers, setTiers] = useState<Tier[]>([{ name: 'General', price: '', capacity: '' }]);

  const selectedProvince = PROVINCES.find((p) => p.id === province);

  const addTier = () => setTiers((prev) => [...prev, { name: '', price: '', capacity: '' }]);
  const removeTier = (i: number) => setTiers((prev) => prev.filter((_, idx) => idx !== i));
  const updateTier = (i: number, field: keyof Tier, val: string) =>
    setTiers((prev) => prev.map((t, idx) => (idx === i ? { ...t, [field]: val } : t)));

  const inputClass =
    'w-full bg-white border border-app-border rounded-2xl px-4 py-3 text-sm text-text-primary placeholder-text-muted outline-none focus:border-primary transition-colors';

  const steps = ['Details', 'Location', 'Tickets'];

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-20 text-center min-h-[60vh]">
        <div className="w-20 h-20 rounded-3xl bg-green-50 flex items-center justify-center mb-5 shadow-inner">
          <CheckCircle2 size={36} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-black text-text-primary mb-2">Event Submitted!</h2>
        <p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-xs">
          <span className="font-bold text-text-primary">"{title || 'Your event'}"</span> has been submitted for review.
          We'll notify you once it's approved — usually within 24 hours.
        </p>
        <button
          onClick={() => navigate('/host/dashboard')}
          className="bg-gradient-to-r from-primary to-[#0EA8AC] text-white font-black px-6 py-3 rounded-2xl shadow-lg shadow-primary/30 hover:opacity-90 transition-opacity"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <div className="max-w-2xl mx-auto">

      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-[22px] font-black text-text-primary">Create Event</h1>
        <p className="text-text-secondary text-xs mt-1">List your event on HangOut ZA</p>
      </div>

      {/* Step progress */}
      <div className="flex items-center px-4 mb-6">
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <button
              type="button"
              onClick={() => i < step - 1 && setStep(i + 1)}
              className={`flex items-center gap-1.5 text-xs font-bold ${
                step === i + 1 ? 'text-primary' : step > i + 1 ? 'text-green-500 cursor-pointer' : 'text-text-muted cursor-default'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 ${
                step === i + 1 ? 'bg-primary text-white' : step > i + 1 ? 'bg-green-500 text-white' : 'bg-surface text-text-muted'
              }`}>
                {step > i + 1 ? '✓' : i + 1}
              </span>
              {s}
            </button>
            {i < 2 && (
              <div className={`flex-1 h-0.5 mx-2 rounded-full transition-colors ${step > i + 1 ? 'bg-green-400' : 'bg-surface'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── STEP 1: Details ── */}
      {step === 1 && (
        <div className="px-4 flex flex-col gap-5">
          <SectionLabel icon={Tag} label="Event Details" />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-text-secondary">Event Title *</label>
            <input className={inputClass} placeholder="e.g. Sunset Rooftop Party" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <label className="text-xs font-bold text-text-secondary mb-2 block">Category *</label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-2xl border text-center transition-all ${
                    category === cat.id ? 'border-primary bg-primary-light shadow-sm' : 'border-app-border bg-white hover:border-primary/40'
                  }`}
                >
                  <span className="text-lg">{cat.emoji}</span>
                  <span className={`text-[9px] font-bold leading-tight ${category === cat.id ? 'text-primary' : 'text-text-secondary'}`}>
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-text-secondary">Description *</label>
            <textarea
              placeholder="Tell attendees what to expect…"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-app-border rounded-2xl px-4 py-3 text-sm text-text-primary placeholder-text-muted outline-none focus:border-primary resize-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-text-secondary flex items-center gap-1.5">
              <ImagePlus size={12} /> Banner Image URL (optional)
            </label>
            <input
              className={inputClass}
              placeholder="https://images.unsplash.com/…"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
            />
            {bannerUrl && (
              <div className="h-28 rounded-2xl overflow-hidden border border-app-border mt-1">
                <img src={bannerUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full py-3.5 bg-gradient-to-r from-primary to-[#0EA8AC] text-white font-black rounded-2xl shadow-lg shadow-primary/25 hover:opacity-90 transition-opacity"
          >
            Next: Location →
          </button>
        </div>
      )}

      {/* ── STEP 2: Location + Date ── */}
      {step === 2 && (
        <div className="px-4 flex flex-col gap-5">
          <SectionLabel icon={MapPin} label="Location" />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-text-secondary">Province *</label>
            <div className="relative">
              <select
                value={province}
                onChange={(e) => { setProvince(e.target.value); setCity(''); }}
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                <option value="">Select province…</option>
                {PROVINCES.filter((p) => p.id !== 'all').map((p) => (
                  <option key={p.id} value={p.id}>{p.emoji} {p.label}</option>
                ))}
              </select>
              <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
          </div>

          {selectedProvince && (
            <div>
              <label className="text-xs font-bold text-text-secondary mb-2 block">City *</label>
              <div className="flex flex-wrap gap-2">
                {selectedProvince.cities.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCity(c)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      city === c ? 'border-primary bg-primary-light text-primary shadow-sm' : 'border-app-border bg-white text-text-secondary hover:border-primary/40'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-text-secondary">Venue Name *</label>
            <input className={inputClass} placeholder="e.g. The Rooftop Lounge" value={venueName} onChange={(e) => setVenueName(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-text-secondary">Street Address</label>
            <input className={inputClass} placeholder="e.g. 12 Long Street, City Bowl" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <SectionLabel icon={Calendar} label="Date & Time" />

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-secondary">Start *</label>
              <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-secondary">End</label>
              <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="flex-1 py-3.5 bg-surface border border-app-border text-text-secondary font-black rounded-2xl hover:bg-app-border transition-colors">
              ← Back
            </button>
            <button type="button" onClick={() => setStep(3)} className="flex-1 py-3.5 bg-gradient-to-r from-primary to-[#0EA8AC] text-white font-black rounded-2xl shadow-lg shadow-primary/25 hover:opacity-90 transition-opacity">
              Next: Tickets →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Tickets ── */}
      {step === 3 && (
        <div className="px-4 flex flex-col gap-5">
          <SectionLabel icon={Ticket} label="Tickets & Capacity" />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-text-secondary">Total Capacity *</label>
            <input
              type="number"
              className={inputClass}
              placeholder="e.g. 200"
              value={totalCapacity}
              onChange={(e) => setTotalCapacity(e.target.value)}
            />
          </div>

          {/* Free toggle */}
          <div className="flex items-center gap-3 bg-white border border-app-border rounded-2xl px-4 py-3">
            <div className="flex-1">
              <p className="text-sm font-bold text-text-primary">Free Entry</p>
              <p className="text-xs text-text-secondary">Attendees can RSVP at no cost</p>
            </div>
            <button
              type="button"
              onClick={() => setIsFree(!isFree)}
              className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${isFree ? 'bg-primary' : 'bg-app-border'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${isFree ? 'left-[26px]' : 'left-0.5'}`} />
            </button>
          </div>

          {!isFree && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-text-secondary">Ticket Tiers *</label>
                <button type="button" onClick={addTier} className="text-primary text-xs font-black flex items-center gap-0.5 hover:underline">
                  <Plus size={12} /> Add tier
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {tiers.map((tier, i) => (
                  <div key={i} className="bg-white border border-app-border rounded-2xl p-3.5">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-black text-text-secondary">Tier {i + 1}</span>
                      {tiers.length > 1 && (
                        <button type="button" onClick={() => removeTier(i)} className="text-red-400 hover:text-red-500 p-0.5">
                          <X size={14} />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        placeholder="Name"
                        value={tier.name}
                        onChange={(e) => updateTier(i, 'name', e.target.value)}
                        className="bg-surface border border-app-border rounded-xl px-2.5 py-2 text-xs text-text-primary outline-none focus:border-primary"
                      />
                      <input
                        placeholder="Price (R)"
                        type="number"
                        value={tier.price}
                        onChange={(e) => updateTier(i, 'price', e.target.value)}
                        className="bg-surface border border-app-border rounded-xl px-2.5 py-2 text-xs text-text-primary outline-none focus:border-primary"
                      />
                      <input
                        placeholder="Spots"
                        type="number"
                        value={tier.capacity}
                        onChange={(e) => updateTier(i, 'capacity', e.target.value)}
                        className="bg-surface border border-app-border rounded-xl px-2.5 py-2 text-xs text-text-primary outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex gap-1 mt-1.5">
                      <span className="text-[9px] text-text-muted font-medium flex-1 text-center">Name</span>
                      <span className="text-[9px] text-text-muted font-medium flex-1 text-center">Price</span>
                      <span className="text-[9px] text-text-muted font-medium flex-1 text-center">Capacity</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(2)} className="flex-1 py-3.5 bg-surface border border-app-border text-text-secondary font-black rounded-2xl hover:bg-app-border transition-colors">
              ← Back
            </button>
            <button
              type="button"
              onClick={() => setSubmitted(true)}
              className="flex-1 py-3.5 bg-gradient-to-r from-secondary to-orange-400 text-white font-black rounded-2xl shadow-lg shadow-secondary/25 hover:opacity-90 transition-opacity"
            >
              Submit for Review ✓
            </button>
          </div>
        </div>
      )}

      </div>{/* /max-width */}
    </div>
  );
}

