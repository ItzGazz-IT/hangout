import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
}

export function PageHeader({ title }: PageHeaderProps) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-app-border sticky top-0 bg-app-bg z-10">
      <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-surface border border-app-border flex items-center justify-center">
        <ChevronLeft size={18} className="text-text-primary" />
      </button>
      <h1 className="text-text-primary font-black text-lg">{title}</h1>
    </div>
  );
}
