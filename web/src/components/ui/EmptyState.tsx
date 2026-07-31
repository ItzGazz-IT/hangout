import React from 'react';
import { Heart, Ticket, Bell, Search } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ size: number; className?: string }>> = {
  'heart-outline': Heart,
  'ticket-outline': Ticket,
  'notifications-off-outline': Bell,
  search: Search,
};

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  const Icon = icon ? (iconMap[icon] ?? Search) : null;

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 px-4 text-center">
      {Icon && <Icon size={32} className="text-muted" />}
      <p className="text-text-primary font-bold text-base">{title}</p>
      {description && <p className="text-text-secondary text-sm">{description}</p>}
    </div>
  );
}
