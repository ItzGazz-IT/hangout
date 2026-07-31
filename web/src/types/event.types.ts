import type { Timestamp } from 'firebase/firestore';
import type { GeoPoint } from 'firebase/firestore';

export type EventCategory =
  | 'music'
  | 'nightlife'
  | 'food'
  | 'sports'
  | 'arts'
  | 'comedy'
  | 'networking'
  | 'wellness'
  | 'family'
  | 'tech'
  | 'fashion'
  | 'outdoor';

export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';

export interface TicketTier {
  id: string;
  name: string;
  price: number; // in cents (ZAR)
  currency: string;
  capacity: number;
  sold: number;
  description?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  status: EventStatus;
  bannerUrl: string;
  imageUrls: string[];
  startDate: Timestamp | Date;
  endDate: Timestamp | Date;
  venueName: string;
  address?: string;
  city?: string;
  province?: string;
  location?: GeoPoint | { latitude: number; longitude: number };
  totalCapacity: number;
  totalBooked: number;
  isFree: boolean;
  ticketTiers: TicketTier[];
  hostId: string;
  hostName: string;
  hostPhotoURL?: string;
  tags?: string[];
  featured?: boolean;
  featuredOrder?: number;
  viewCount?: number;
  saveCount?: number;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}
