import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Calendar, MapPin } from 'lucide-react';
import { getCategoryById } from '../../lib/categories';
import { formatEventDate, formatPrice } from '@utils/formatters';
import type { Event } from '@models/event.types';

interface FeaturedCarouselProps {
  events: Event[];
  onEventPress?: (event: Event) => void;
}

export function FeaturedCarousel({ events, onEventPress }: FeaturedCarouselProps) {
  const navigate = useNavigate();

  if (events.length === 0) return null;

  const handlePress = (event: Event) => {
    if (onEventPress) onEventPress(event);
    else navigate(`/event/${event.id}`);
  };

  return (
    <div className="flex gap-4 overflow-x-auto px-4 pb-3 no-scrollbar snap-x snap-mandatory">
      {events.map((event) => {
        const category = getCategoryById(event.category);
        const lowestPrice = event.ticketTiers.length > 0
          ? Math.min(...event.ticketTiers.map((t) => t.price))
          : 0;

        return (
          <div
            key={event.id}
            onClick={() => handlePress(event)}
            className="relative flex-shrink-0 rounded-3xl overflow-hidden cursor-pointer snap-start group hover:scale-[0.98] active:scale-[0.96] transition-all duration-200 shadow-2xl"
            style={{ width: 'min(82vw, 320px)', height: 240 }}
          >
            {/* Image */}
            <img
              src={event.bannerUrl || 'https://placehold.co/320x240/11C5C9/FFFFFF?text=HangOut'}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/85" />

            {/* Featured badge + category */}
            <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
              <span className="flex items-center gap-1 text-xs font-black bg-secondary text-white px-2.5 py-1 rounded-full shadow-lg">
                <Star size={10} fill="white" />&nbsp;Featured
              </span>
              {category && (
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm text-white"
                  style={{ backgroundColor: `${category.color}CC` }}
                >
                  {category.emoji}
                </span>
              )}
            </div>

            {/* Bottom content */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center gap-1 mb-1.5">
                <Calendar size={11} className="text-white/60" />
                <span className="text-white/75 text-xs font-medium">{formatEventDate(event.startDate)}</span>
              </div>
              <p className="text-white font-black text-[18px] leading-tight line-clamp-2 drop-shadow-lg">{event.title}</p>
              <div className="flex items-center justify-between mt-2.5">
                <div className="flex items-center gap-1">
                  <MapPin size={11} className="text-white/60" />
                  <span className="text-white/70 text-xs">{event.venueName}</span>
                </div>
                <span className={`text-xs font-black px-3 py-1.5 rounded-full shadow-xl ${
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
      })}
    </div>
  );
}
