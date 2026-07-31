import React from 'react';
import { Compass, CalendarPlus, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { setDemoMode, setDemoRole } from '../lib/demoMode';
import { useAuthStore } from '@store/authStore';
import type { UserRole } from '@models/user.types';

const roles = [
  { role: 'user' as UserRole, title: 'Customer', description: 'Discover, save and book events.', icon: Compass, color: 'text-primary bg-primary-light', destination: '/' },
  { role: 'host' as UserRole, title: 'Host', description: 'Create events, manage attendees and check in guests.', icon: CalendarPlus, color: 'text-secondary bg-orange-50', destination: '/host/dashboard' },
  { role: 'admin' as UserRole, title: 'Admin', description: 'Review hosts and moderate event submissions.', icon: ShieldCheck, color: 'text-violet-600 bg-violet-50', destination: '/admin/dashboard' },
];

export default function DemoRolesPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const enter = (role: UserRole, destination: string) => { setDemoMode(role); setUser(setDemoRole(role)); navigate(destination); };
  return <div className="max-w-4xl mx-auto px-4 py-12"><div className="text-center mb-8"><p className="text-primary text-xs font-black uppercase tracking-[0.2em]">Interactive demo</p><h1 className="text-3xl font-black text-text-primary mt-2">Choose your HangOut view</h1><p className="text-text-secondary text-sm mt-2">Switch roles at any time without losing demo data.</p></div><div className="grid md:grid-cols-3 gap-4">{roles.map(({role,title,description,icon:Icon,color,destination}) => <button key={role} onClick={() => enter(role,destination)} className="text-left bg-white border border-app-border rounded-3xl p-6 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all"><div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}><Icon size={23}/></div><h2 className="font-black text-xl text-text-primary mt-5">{title}</h2><p className="text-sm text-text-secondary mt-2 min-h-10">{description}</p><span className="mt-6 inline-flex items-center gap-1 text-primary text-xs font-black">Enter {title} view <ArrowRight size={14}/></span></button>)}</div></div>;
}
