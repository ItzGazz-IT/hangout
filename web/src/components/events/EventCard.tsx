import React from 'react';
import { Heart, MapPin, Calendar } from 'lucide-react';
import { getCategoryById } from '../../lib/categories';
import { formatEventDate, formatPrice } from '@utils/formatters';
import type { Event } from '@models/event.types';

interface EventCardProps {
  event: Event;
  onPress?: () => void;
  onSave?: () => void;
  isSaved?: boolean;
  compact?: boolean;
  className?: string;
}

export function EventCard({ event, onPress, onSave, isSaved = false, compact = false, className = '' }: EventCardProps) {
  const category = getCategoryById(event.category);
  const lowestPrice = event.ticketTiers.length > 0
    ? Math.min(...event.ticketTiers.map((t) => t.price))
    : 0;

  return (
    <div
      onClick={onPress}
      className={`relative rounded-3xl overflow-hidden cursor-pointer group transition-all duration-200 hover:scale-[0.985] active:scale-[0.97] shadow-xl ${className}`}
      style={{ height: compact ? 160 : 220 }}
    >
      {/* Background image */}
      <img
        src={event.bannerUrl || 'https://placehold.co/800x440/11C5C9/FFFFFF?text=HangOut'}
        alt={event.title}
        onError={(e) => { const image = e.currentTarget; image.onerror = null; image.src = 'https://placehold.co/800x440/11C5C9/FFFFFF?text=HangOut'; }}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />

      {/* Gradient overlay: dark top-right corner + strong bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90" />

      {/* Top row: category pill + save button */}
      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
        {category ? (
          <span
            className="text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm text-white"
            style={{ backgroundColor: `${category.color}CC` }}
          >
            {category.emoji}&nbsp;{category.label}
          </span>
        ) : <span />}
        <button
          onClick={(e) => { e.stopPropagation(); onSave?.(); }}
          className={`w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center transition-all ${
            isSaved ? 'bg-secondary shadow-lg shadow-secondary/40' : 'bg-black/40 hover:bg-black/60'
          }`}
        >
          <Heart size={16} fill={isSaved ? '#fff' : 'none'} color="#fff" />
        </button>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Calendar size={11} className="text-white/60" />
          <span className="text-white/75 text-xs font-medium">{formatEventDate(event.startDate)}</span>
        </div>
        <p className="text-white font-black text-[17px] leading-tight line-clamp-1 drop-shadow-md">{event.title}</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <MapPin size={11} className="text-white/60" />
            <span className="text-white/70 text-xs line-clamp-1">{event.venueName} · {event.city}</span>
          </div>
          <span className={`text-xs font-black px-3 py-1 rounded-full shadow-lg ${
            event.isFree
              ? 'bg-green-400 text-white'
              : 'bg-white text-text-primary'
          }`}>
            {event.isFree ? '🎉 Free' : formatPrice(lowestPrice)}
          </span>
        </div>
      </div>
    </div>
  );
}
