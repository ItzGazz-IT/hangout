import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@config/firebase';
import type { TicketTier } from '@models/event.types';
import type { Timestamp } from 'firebase/firestore';

export interface CreateBookingInput {
  eventId: string;
  userId: string;
  eventTitle: string;
  eventBannerUrl: string;
  eventStartDate: Timestamp | Date;
  venueName: string;
  city?: string;
  tierSelections: Array<{ tier: TicketTier; quantity: number }>;
  paymentProvider?: 'free';
}

export const bookingsService = {
  async create(input: CreateBookingInput): Promise<string> {
    const ref = await addDoc(collection(db, 'bookings'), {
      ...input,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  },
};
