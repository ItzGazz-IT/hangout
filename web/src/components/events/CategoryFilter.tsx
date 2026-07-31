import React from 'react';
import { EVENT_CATEGORIES } from '../../lib/categories';

interface CategoryFilterProps {
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2.5 overflow-x-auto px-4 pb-2 no-scrollbar">
      {/* All pill */}
      <button
        onClick={() => onSelect(null)}
        className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 ${
          selected === null
            ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30 scale-[1.04]'
            : 'bg-white border border-app-border text-text-secondary hover:border-primary/50 hover:text-text-primary'
        }`}
      >
        🔥 All
      </button>
      {EVENT_CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(selected === cat.id ? null : cat.id)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 ${
            selected === cat.id
              ? 'text-white shadow-lg scale-[1.04]'
              : 'bg-white border border-app-border text-text-secondary hover:border-primary/50 hover:text-text-primary'
          }`}
          style={selected === cat.id ? { backgroundColor: cat.color, boxShadow: `0 8px 24px ${cat.color}40` } : {}}
        >
          <span>{cat.emoji}</span>
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
