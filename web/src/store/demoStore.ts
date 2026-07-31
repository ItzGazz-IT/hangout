import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MOCK_EVENTS } from '../lib/mockData';
import { formatEventDate } from '@utils/formatters';
import type { Event, EventCategory, EventStatus, TicketTier } from '@models/event.types';

export type DemoEvent = Omit<Event, 'startDate' | 'endDate' | 'createdAt' | 'updatedAt'> & {
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  rejectionReason?: string;
  moderationHistory?: Array<{ action: 'submitted' | 'approved' | 'rejected'; note?: string; atMs: number }>;
};

export interface DemoTicket {
  id: string;
  eventId: string;
  eventTitle: string;
  eventBannerUrl: string;
  eventDate: string;
  eventStartMs: number;
  venueName: string;
  city: string;
  tierName: string;
  qty: number;
  totalPrice: number;
  qr: string;
  purchasedAtMs: number;
  status: 'confirmed' | 'cancelled';
  checkedInAtMs?: number;
}

export interface DemoNotification {
  id: string;
  title: string;
  body: string;
  createdAtMs: number;
  read: boolean;
}

export interface NewDemoEvent {
  title: string;
  description: string;
  category: EventCategory;
  bannerUrl: string;
  province: string;
  city: string;
  venueName: string;
  address: string;
  startDate: Date;
  endDate: Date;
  totalCapacity: number;
  isFree: boolean;
  ticketTiers: TicketTier[];
}

const seedSaved = ['mock-1', 'mock-3', 'mock-gp-1', 'mock-kzn-1'];

function makeTicket(eventId: string, id: string, tierName: string, qty: number, totalPrice: number, qr: string): DemoTicket | null {
  const event = MOCK_EVENTS.find((item) => item.id === eventId);
  if (!event) return null;
  const startDate = event.startDate as Date;
  return {
    id, eventId, eventTitle: event.title, eventBannerUrl: event.bannerUrl,
    eventDate: formatEventDate(startDate), eventStartMs: startDate.getTime(),
    venueName: event.venueName, city: event.city ?? '', tierName, qty, totalPrice, qr,
    purchasedAtMs: new Date('2026-05-10').getTime(), status: 'confirmed',
  };
}

function makeTicketSeed(): DemoTicket[] {
  return [
    makeTicket('mock-gp-1', 'tk-seed-1', 'General', 2, 40000, 'HANGOUT-TK-A1B2C3D4'),
    makeTicket('mock-kzn-1', 'tk-seed-2', 'Standard', 1, 25000, 'HANGOUT-TK-E5F6G7H8'),
    makeTicket('mock-1', 'tk-seed-3', 'VIP', 1, 45000, 'HANGOUT-TK-I9J0K1L2'),
  ].filter(Boolean) as DemoTicket[];
}

interface DemoState {
  customEvents: DemoEvent[];
  tickets: DemoTicket[];
  savedEventIds: string[];
  notifications: DemoNotification[];
  addEvent: (event: NewDemoEvent) => string;
  updateEventStatus: (id: string, status: EventStatus) => void;
  updateEvent: (id: string, changes: Partial<DemoEvent>, resubmit?: boolean) => void;
  rejectEvent: (id: string, reason: string) => void;
  deleteEvent: (id: string) => void;
  duplicateEvent: (id: string) => void;
  addTicket: (ticket: Omit<DemoTicket, 'status' | 'purchasedAtMs'>) => void;
  cancelTicket: (id: string) => void;
  checkInTicket: (idOrQr: string) => 'success' | 'duplicate' | 'invalid';
  toggleSaved: (id: string) => void;
  markNotificationsRead: () => void;
  reset: () => void;
}

const seedNotification: DemoNotification = {
  id: 'promo-1', title: 'New events near you',
  body: 'Fresh events have landed in your area. Save your favourites before they fill up.',
  createdAtMs: Date.now() - 86400000, read: false,
};

export const useDemoStore = create<DemoState>()(persist((set, get) => ({
  customEvents: [],
  tickets: makeTicketSeed(),
  savedEventIds: seedSaved,
  notifications: [seedNotification],

  addEvent: (input) => {
    const id = `demo-event-${Date.now()}`;
    const now = new Date();
    const event: DemoEvent = {
      ...input, id, status: 'draft', imageUrls: [], totalBooked: 0,
      hostId: 'demo-user-001', hostName: 'Demo Host', tags: [],
      createdAt: now, updatedAt: now, moderationHistory: [{ action: 'submitted', atMs: Date.now() }],
    };
    set((state) => ({
      customEvents: [event, ...state.customEvents],
      notifications: [{ id: `event-${id}`, title: 'Event submitted', body: `${event.title} is ready for admin review.`, createdAtMs: Date.now(), read: false }, ...state.notifications],
    }));
    return id;
  },
  updateEventStatus: (id, status) => set((state) => ({
    customEvents: state.customEvents.map((event) => event.id === id ? { ...event, status, rejectionReason: undefined, updatedAt: new Date(), moderationHistory: [...(event.moderationHistory ?? []), { action: 'approved' as const, atMs: Date.now() }] } : event),
    notifications: [{ id: `status-${id}-${Date.now()}`, title: status === 'published' ? 'Event approved' : 'Event updated', body: `Your event is now ${status}.`, createdAtMs: Date.now(), read: false }, ...state.notifications],
  })),
  updateEvent: (id, changes, resubmit = false) => set((state) => ({
    customEvents: state.customEvents.map((event) => event.id === id ? {
      ...event, ...changes, updatedAt: new Date(),
      ...(resubmit ? { status: 'draft' as const, rejectionReason: undefined, moderationHistory: [...(event.moderationHistory ?? []), { action: 'submitted' as const, note: 'Updated and resubmitted', atMs: Date.now() }] } : {}),
    } : event),
    notifications: resubmit ? [{ id: `resubmit-${id}-${Date.now()}`, title: 'Event resubmitted', body: 'Your updates were sent to admin for another review.', createdAtMs: Date.now(), read: false }, ...state.notifications] : state.notifications,
  })),
  rejectEvent: (id, reason) => set((state) => {
    const event = state.customEvents.find((item) => item.id === id);
    return {
      customEvents: state.customEvents.map((item) => item.id === id ? { ...item, status: 'cancelled' as const, rejectionReason: reason.trim(), updatedAt: new Date(), moderationHistory: [...(item.moderationHistory ?? []), { action: 'rejected' as const, note: reason.trim(), atMs: Date.now() }] } : item),
      notifications: event ? [{ id: `reject-${id}-${Date.now()}`, title: 'Event needs changes', body: `${event.title} was rejected: ${reason.trim()}`, createdAtMs: Date.now(), read: false }, ...state.notifications] : state.notifications,
    };
  }),
  deleteEvent: (id) => set((state) => ({ customEvents: state.customEvents.filter((event) => event.id !== id) })),
  duplicateEvent: (id) => {
    const source = get().customEvents.find((event) => event.id === id);
    if (!source) return;
    const copyId = `demo-event-${Date.now()}`;
    set((state) => ({ customEvents: [{ ...source, id: copyId, title: `${source.title} (Copy)`, status: 'draft', totalBooked: 0, createdAt: new Date(), updatedAt: new Date() }, ...state.customEvents] }));
  },
  addTicket: (ticket) => set((state) => ({
    tickets: [{ ...ticket, purchasedAtMs: Date.now(), status: 'confirmed' }, ...state.tickets],
    notifications: [{ id: `booking-${ticket.id}`, title: 'Booking confirmed', body: `Your ${ticket.tierName} ticket for ${ticket.eventTitle} is in your wallet.`, createdAtMs: Date.now(), read: false }, ...state.notifications],
  })),
  cancelTicket: (id) => set((state) => {
    const ticket = state.tickets.find((item) => item.id === id);
    return {
      tickets: state.tickets.map((item) => item.id === id ? { ...item, status: 'cancelled' as const } : item),
      notifications: ticket ? [{ id: `cancel-${id}`, title: 'Booking cancelled', body: `Your booking for ${ticket.eventTitle} was cancelled.`, createdAtMs: Date.now(), read: false }, ...state.notifications] : state.notifications,
    };
  }),
  checkInTicket: (idOrQr) => {
    const ticket = get().tickets.find((item) => item.id === idOrQr || item.qr.toLowerCase() === idOrQr.trim().toLowerCase());
    if (!ticket || ticket.status === 'cancelled') return 'invalid';
    if (ticket.checkedInAtMs) return 'duplicate';
    set((state) => ({ tickets: state.tickets.map((item) => item.id === ticket.id ? { ...item, checkedInAtMs: Date.now() } : item) }));
    return 'success';
  },
  toggleSaved: (id) => set((state) => ({ savedEventIds: state.savedEventIds.includes(id) ? state.savedEventIds.filter((item) => item !== id) : [...state.savedEventIds, id] })),
  markNotificationsRead: () => set((state) => ({ notifications: state.notifications.map((item) => ({ ...item, read: true })) })),
  reset: () => set({ customEvents: [], tickets: makeTicketSeed(), savedEventIds: seedSaved, notifications: [{ ...seedNotification, createdAtMs: Date.now() - 86400000 }] }),
}), { name: 'hangout-demo-data' }));

export function getDemoEvents(customEvents: DemoEvent[]): Event[] {
  return [...customEvents, ...MOCK_EVENTS];
}
