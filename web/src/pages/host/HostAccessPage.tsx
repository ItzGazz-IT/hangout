import React from 'react';
import { CalendarPlus, LogOut, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { clearDemoMode, isDemoMode } from '../../lib/demoMode';
import { authService } from '@services/firebase/auth.service';

export default function HostAccessPage() {
  const navigate = useNavigate();
  const clearUser = useAuthStore((state) => state.clearUser);

  const createHostAccount = async () => {
    if (isDemoMode()) clearDemoMode();
    else await authService.signOut();
    clearUser();
    navigate('/register', { state: { role: 'host' } });
  };

  return <div className="min-h-[70vh] flex items-center justify-center px-5 py-12">
    <div className="w-full max-w-md bg-white border border-app-border rounded-3xl p-7 text-center shadow-xl shadow-black/5">
      <div className="w-16 h-16 rounded-2xl bg-orange-50 text-secondary flex items-center justify-center mx-auto mb-5"><CalendarPlus size={29}/></div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Host access only</p>
      <h1 className="text-2xl font-black text-text-primary mt-2">Create a Host account</h1>
      <p className="text-sm text-text-secondary leading-relaxed mt-3">Event creation and host management are only available to users who register specifically as hosts.</p>
      <button onClick={createHostAccount} className="w-full mt-6 bg-gradient-to-r from-secondary to-orange-400 text-white font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-secondary/25"><LogOut size={16}/> Sign out &amp; register as Host</button>
      <button onClick={() => navigate('/')} className="mt-4 text-text-secondary text-sm font-bold inline-flex items-center gap-1"><ArrowLeft size={14}/> Return to customer dashboard</button>
    </div>
  </div>;
}
