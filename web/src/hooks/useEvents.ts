import type { Event } from '@models/event.types';
import type { EventFilters } from '@store/eventsStore';
import { MOCK_FEATURED } from '../lib/mockData';
import { getDemoEvents, useDemoStore } from '../store/demoStore';

function matchesDate(event: Event, range: EventFilters['dateRange']) {
  if (!range) return true;
  const start = new Date(event.startDate as Date).getTime();
  const now = Date.now();
  const days = range === 'today' ? 1 : range === 'weekend' ? 7 : 31;
  return start >= now && start <= now + days * 86400000;
}

export function useFeaturedEvents() {
  const customEvents = useDemoStore((state) => state.customEvents);
  const published = customEvents.filter((event) => event.status === 'published' && event.featured);
  return { featuredEvents: published.length ? published : MOCK_FEATURED, isLoading: false };
}

export function useFeedEvents(filters: EventFilters) {
  const customEvents = useDemoStore((state) => state.customEvents);
  const events = getDemoEvents(customEvents).filter((event) => {
    if (event.status !== 'published') return false;
    if (filters.category && event.category !== filters.category) return false;
    if (filters.isFree !== null && event.isFree !== filters.isFree) return false;
    if (filters.province && event.province !== filters.province) return false;
    if (filters.city && event.city !== filters.city) return false;
    return matchesDate(event, filters.dateRange);
  });
  return { events, isLoading: false, loadMore: () => undefined };
}

export function useEventDetail(id: string) {
  const customEvents = useDemoStore((state) => state.customEvents);
  const event = getDemoEvents(customEvents).find((item) => item.id === id) ?? null;
  return { event, isLoading: false };
}
