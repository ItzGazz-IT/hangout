import { useState, useEffect } from 'react';
import type { Event } from '@models/event.types';
import type { EventFilters } from '@store/eventsStore';
import { MOCK_EVENTS, MOCK_FEATURED } from '../lib/mockData';
import { isDemoMode } from '../lib/demoMode';

/** Featured events (pinned, sorted by featuredOrder) */
export function useFeaturedEvents() {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isDemoMode()) {
      setFeaturedEvents(MOCK_FEATURED);
      return;
    }
    // In non-demo mode, return empty — HomePage falls back to MOCK_FEATURED anyway
    setFeaturedEvents([]);
  }, []);

  return { featuredEvents, isLoading };
}

/** Feed events filtered by EventFilters */
export function useFeedEvents(filters: EventFilters) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isDemoMode()) {
      setEvents(MOCK_EVENTS);
      return;
    }
    setEvents([]);
  }, [filters]);

  const loadMore = () => {};

  return { events, isLoading, loadMore };
}

/** Single event by ID */
export function useEventDetail(id: string) {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const found = MOCK_EVENTS.find((e) => e.id === id) ?? null;
    setEvent(found);
  }, [id]);

  return { event, isLoading };
}
