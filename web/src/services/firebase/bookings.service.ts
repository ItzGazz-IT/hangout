import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@config/firebase';

export interface CreateBookingInput {
  eventId: string;
  userId: string;
  tierId: string;
  tierName: string;
  qty: number;
  totalPrice: number;
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
