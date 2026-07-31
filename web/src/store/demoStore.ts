import { create } from 'zustand';
import { MOCK_EVENTS } from '../lib/mockData';
import { formatEventDate } from '@utils/formatters';

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
  totalPrice: number; // cents
  qr: string;
  purchasedAt: Date;
}

function makeSeed(): DemoTicket[] {
  const ev1 = MOCK_EVENTS.find((e) => e.id === 'mock-gp-1');
  const ev2 = MOCK_EVENTS.find((e) => e.id === 'mock-kzn-1');
  const ev3 = MOCK_EVENTS.find((e) => e.id === 'mock-1');
  return ([
    ev1 && { id: 'tk-seed-1', eventId: ev1.id, eventTitle: ev1.title, eventBannerUrl: ev1.bannerUrl, eventDate: formatEventDate(ev1.startDate as any), eventStartMs: (ev1.startDate as any).getTime(), venueName: ev1.venueName, city: ev1.city, tierName: 'General', qty: 2, totalPrice: 40000, qr: 'HANGOUT-TK-A1B2C3D4', purchasedAt: new Date('2026-05-01') },
    ev2 && { id: 'tk-seed-2', eventId: ev2.id, eventTitle: ev2.title, eventBannerUrl: ev2.bannerUrl, eventDate: formatEventDate(ev2.startDate as any), eventStartMs: (ev2.startDate as any).getTime(), venueName: ev2.venueName, city: ev2.city, tierName: 'Standard', qty: 1, totalPrice: 25000, qr: 'HANGOUT-TK-E5F6G7H8', purchasedAt: new Date('2026-05-05') },
    ev3 && { id: 'tk-seed-3', eventId: ev3.id, eventTitle: ev3.title, eventBannerUrl: ev3.bannerUrl, eventDate: formatEventDate(ev3.startDate as any), eventStartMs: (ev3.startDate as any).getTime(), venueName: ev3.venueName, city: ev3.city, tierName: 'VIP', qty: 1, totalPrice: 45000, qr: 'HANGOUT-TK-I9J0K1L2', purchasedAt: new Date('2026-05-10') },
  ].filter(Boolean)) as DemoTicket[];
}

interface DemoState {
  tickets: DemoTicket[];
  addTicket: (t: DemoTicket) => void;
  reset: () => void;
}

export const useDemoStore = create<DemoState>((set) => ({
  tickets: makeSeed(),
  addTicket: (t) => set((s) => ({ tickets: [t, ...s.tickets] })),
  reset: () => set({ tickets: makeSeed() }),
}));
