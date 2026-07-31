import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Bell, Building2, ShieldCheck, HelpCircle, Settings, X, Mail } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import { GradientButton } from '../components/ui/GradientButton';
import { Button } from '../components/ui/Button';
import { useAuth } from '@hooks/useAuth';
import { useAuthStore } from '@store/authStore';
import { isDemoMode, clearDemoMode } from '../lib/demoMode';

interface MenuRowProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

function MenuRow({ icon, label, onClick }: MenuRowProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full px-4 py-3.5 border-b border-app-border last:border-b-0 hover:bg-surface/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <span className="text-primary">{icon}</span>
        <span className="text-text-primary font-semibold text-sm">{label}</span>
      </div>
      <ChevronRight size={16} className="text-muted" />
    </button>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const clearUser = useAuthStore((s) => s.clearUser);
  const setUser = useAuthStore((s) => s.setUser);

  const [showEdit, setShowEdit] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [editName, setEditName] = useState(user?.displayName ?? '');
  const [saving, setSaving] = useState(false);

  const handleLogout = async () => {
    if (isDemoMode()) {
      clearDemoMode();
      clearUser();
      navigate('/login');
      return;
    }
    await signOut();
    navigate('/');
  };

  const handleSaveProfile = async () => {
    if (!editName.trim() || !user) return;
    setSaving(true);
    // Update store immediately (works for demo mode too)
    setUser({ ...user, displayName: editName.trim() });
    setSaving(false);
    setShowEdit(false);
  };

  return (
    <div className="px-4 pt-4 pb-8">
      {/* Top */}
      <div className="flex flex-col items-center mb-6">
        <Avatar uri={user?.photoURL} name={user?.displayName} size={86} />
        <h2 className="text-text-primary text-[22px] font-black mt-3">{user?.displayName || 'HangOut User'}</h2>
        <p className="text-text-secondary text-sm mt-1">{user?.email}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2.5 mb-6">
        <GradientButton label="Edit Profile" fullWidth onClick={() => { setEditName(user?.displayName ?? ''); setShowEdit(true); }} />
        <Button label="Settings" variant="outline" fullWidth onClick={() => navigate('/settings')} />
      </div>

      {/* Menu */}
      <div className="bg-card border border-app-border rounded-2xl overflow-hidden mb-5">
        <MenuRow icon={<Bell size={17} />} label="Notifications" onClick={() => navigate('/notifications')} />
        <MenuRow icon={<Building2 size={17} />} label="Host Dashboard" onClick={() => navigate('/host/dashboard')} />
        <MenuRow icon={<ShieldCheck size={17} />} label="Admin Dashboard" onClick={() => navigate('/admin/dashboard')} />
        <MenuRow icon={<HelpCircle size={17} />} label="Support" onClick={() => setShowSupport(true)} />
      </div>

      <Button label="Log Out" variant="ghost" fullWidth onClick={handleLogout} />

      {/* ── Edit Profile Modal ── */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && setShowEdit(false)}>
          <div className="bg-white w-full max-w-sm rounded-t-[32px] sm:rounded-[32px] px-6 pt-6 pb-8 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-text-primary font-black text-lg">Edit Profile</h3>
              <button onClick={() => setShowEdit(false)} className="w-8 h-8 rounded-xl bg-surface border border-app-border flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors">
                <X size={15} className="text-text-secondary" />
              </button>
            </div>
            <div className="flex justify-center mb-5">
              <Avatar uri={user?.photoURL} name={editName || user?.displayName} size={72} />
            </div>
            <label className="text-xs font-bold text-text-secondary mb-1.5 block">Display Name</label>
            <input
              className="w-full rounded-xl border border-app-border bg-surface px-3.5 py-3 text-text-primary text-sm font-semibold placeholder:text-text-muted focus:outline-none focus:border-primary focus:bg-white transition-colors mb-5"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Your name"
              maxLength={40}
            />
            {isDemoMode() && (
              <p className="text-text-muted text-[11px] text-center mb-3">Demo mode — changes are session-only</p>
            )}
            <button
              onClick={handleSaveProfile}
              disabled={saving || !editName.trim()}
              className="w-full bg-gradient-to-r from-primary to-[#0EA8AC] text-white font-black text-sm py-3.5 rounded-2xl shadow-lg shadow-primary/30 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* ── Support Modal ── */}
      {showSupport && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && setShowSupport(false)}>
          <div className="bg-white w-full max-w-sm rounded-t-[32px] sm:rounded-[32px] px-6 pt-6 pb-8 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-text-primary font-black text-lg">Support</h3>
              <button onClick={() => setShowSupport(false)} className="w-8 h-8 rounded-xl bg-surface border border-app-border flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors">
                <X size={15} className="text-text-secondary" />
              </button>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-4">
              <HelpCircle size={28} className="text-primary" />
            </div>
            <p className="text-text-primary font-black text-center text-base mb-1">Need help?</p>
            <p className="text-text-secondary text-sm text-center leading-relaxed mb-6">
              Reach our support team and we'll get back to you within 24 hours.
            </p>
            <a
              href="mailto:support@hangout.co.za"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-primary to-[#0EA8AC] text-white font-black text-sm py-3.5 rounded-2xl shadow-lg shadow-primary/30 hover:opacity-90 transition-opacity"
            >
              <Mail size={16} /> Email Support
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
