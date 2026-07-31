import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { PageHeader } from '../components/layout/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { useDemoStore } from '../store/demoStore';

export default function NotificationsPage() {
  const notifications = useDemoStore((state) => state.notifications);
  const markRead = useDemoStore((state) => state.markNotificationsRead);

  return (
    <div>
      <PageHeader title="Notifications" />
      <div className="px-4 py-4 flex flex-col gap-3 max-w-3xl mx-auto">
        {notifications.some((item) => !item.read) && (
          <button onClick={markRead} className="self-end text-primary text-xs font-black hover:underline">Mark all as read</button>
        )}
        {notifications.length === 0 ? (
          <EmptyState title="No notifications" description="You're all caught up." icon="notifications-off-outline" />
        ) : (
          [...notifications].sort((a, b) => b.createdAtMs - a.createdAtMs).map((item) => (
            <div key={item.id} className={`bg-card border rounded-2xl p-4 ${item.read ? 'border-app-border' : 'border-primary/40 shadow-sm'}`}>
              <div className="flex items-start gap-3">
                {!item.read && <span className="mt-1.5 w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                <div>
                  <p className="text-text-primary font-extrabold text-sm">{item.title}</p>
                  <p className="text-text-secondary text-sm mt-1.5 leading-5">{item.body}</p>
                  <p className="text-text-muted text-xs mt-2">{formatDistanceToNow(item.createdAtMs, { addSuffix: true })}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
