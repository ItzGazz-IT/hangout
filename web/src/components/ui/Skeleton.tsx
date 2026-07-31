import React from 'react';

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-surface rounded-xl ${className}`} />
  );
}

export function EventCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-app-border mb-4">
      <Skeleton className="h-44 rounded-none" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}
