import React from 'react';

interface BadgeProps {
  label: string;
  color?: string;
  size?: 'sm' | 'md';
}

export function Badge({ label, color = '#11C5C9', size = 'md' }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-full font-bold ${size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-3 py-1'}`}
      style={{ backgroundColor: `${color}22`, color }}
    >
      {label}
    </span>
  );
}
