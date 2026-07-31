import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function AuthLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-app-bg flex flex-col px-4">
      {/* Back button */}
      <div className="pt-12 pb-2">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary transition-colors group"
        >
          <span className="w-8 h-8 rounded-xl bg-white border border-app-border flex items-center justify-center shadow-sm group-hover:border-primary/40 group-hover:shadow-primary/10 transition-all">
            <ChevronLeft size={17} className="text-text-primary" />
          </span>
          <span className="text-sm font-semibold">Back</span>
        </button>
      </div>

      {/* Centered content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tight">
              <span className="text-primary">Hang</span><span className="text-secondary">Out</span>
            </h1>
            <p className="text-text-secondary text-sm mt-1">Find your next event</p>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
