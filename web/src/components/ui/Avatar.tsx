import React from 'react';

interface AvatarProps {
  uri?: string | null;
  name?: string | null;
  size?: number;
}

export function Avatar({ uri, name, size = 40 }: AvatarProps) {
  const initials = name
    ? name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div
      style={{ width: size, height: size, minWidth: size }}
      className="rounded-full bg-surface border border-app-border overflow-hidden flex items-center justify-center"
    >
      {uri ? (
        <img src={uri} alt={name ?? 'Avatar'} className="w-full h-full object-cover" />
      ) : (
        <span className="text-primary font-black" style={{ fontSize: size * 0.35 }}>
          {initials}
        </span>
      )}
    </div>
  );
}
