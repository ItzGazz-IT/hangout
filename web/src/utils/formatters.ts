import { format } from 'date-fns';
import type { Timestamp } from 'firebase/firestore';

/** Convert Firestore Timestamp, JS Date, or millis to a JS Date */
export function toDate(value: Timestamp | Date | number | null | undefined): Date {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  if (typeof value === 'number') return new Date(value);
  // Firestore Timestamp-like object
  if (typeof (value as any).toDate === 'function') {
    return (value as Timestamp).toDate();
  }
  // Plain object with seconds (Firestore serialised)
  if (typeof (value as any).seconds === 'number') {
    return new Date((value as any).seconds * 1000);
  }
  return new Date();
}

/** Format an event date for display, e.g. "Sat, 23 May · 20:00" */
export function formatEventDate(value: Timestamp | Date | number | null | undefined): string {
  try {
    return format(toDate(value), "EEE, d MMM · HH:mm");
  } catch {
    return '';
  }
}

/** Format a short date, e.g. "23 May 2026" */
export function formatShortDate(value: Timestamp | Date | number | null | undefined): string {
  try {
    return format(toDate(value), 'd MMM yyyy');
  } catch {
    return '';
  }
}

/** Format ZAR price from cents. 0 → "Free", 18000 → "R 180" */
export function formatPrice(cents: number, currency = 'ZAR'): string {
  if (!cents || cents <= 0) return 'Free';
  const rands = cents / 100;
  const symbol = currency === 'ZAR' ? 'R' : currency;
  return `${symbol} ${rands % 1 === 0 ? rands.toFixed(0) : rands.toFixed(2)}`;
}

/** Return capacity used as a 0–100 percentage */
export function capacityPercent(booked: number, total: number): number {
  if (!total) return 0;
  return Math.min(100, Math.round((booked / total) * 100));
}
