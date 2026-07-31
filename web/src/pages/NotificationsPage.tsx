import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { PageHeader } from '../components/layout/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { useDemoStore } from '../store/demoStore';

export default function NotificationsPage() {
  const tickets = useDemoStore((s) => s.tickets);

  const notifications = [
    ...tickets.map((t) => ({
      id: t.id,
      title: 'Booking Confirmed ✓',
      body: `Your ${t.tierName} ticket for "${t.eventTitle}" is confirmed. Check your Wallet for the QR code.`,
      time: formatDistanceToNow(t.purchasedAt, { addSuffix: true }),
      sortKey: t.purchasedAt.getTime(),
    })),
    {
      id: 'promo-1',
      title: 'New Events Near You 🎉',
      body: 'Amapiano Live and 4 other events just dropped in your area.',
      time: '1d ago',
      sortKey: Date.now() - 86400000,
    },
  ].sort((a, b) => b.sortKey - a.sortKey);

  return (
    <div>
      <PageHeader title="Notifications" />
      <div className="px-4 py-4 flex flex-col gap-3">
        {notifications.length === 0 ? (
          <EmptyState title="No notifications" description="You're all caught up." icon="notifications-off-outline" />
        ) : (
          notifications.map((item) => (
            <div key={item.id} className="bg-card border border-app-border rounded-2xl p-4">
              <p className="text-text-primary font-extrabold text-sm">{item.title}</p>
              <p className="text-[#B7B7D5] text-sm mt-1.5 leading-5">{item.body}</p>
              <p className="text-[#7D7D9D] text-xs mt-2">{item.time}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
