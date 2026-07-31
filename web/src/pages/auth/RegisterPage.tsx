import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, Compass, CalendarPlus, Check } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { GradientButton } from '../../components/ui/GradientButton';
import { authService } from '@services/firebase/auth.service';
import { registerSchema, type RegisterFormData } from '@utils/validators';
import type { UserRole } from '@types/user.types';

type RoleOption = { value: UserRole; icon: React.ElementType; title: string; desc: string; accent: string };

const ROLES: RoleOption[] = [
  {
    value: 'user',
    icon: Compass,
    title: 'Discover Events',
    desc: 'Browse, save & book tickets',
    accent: 'primary',
  },
  {
    value: 'host',
    icon: CalendarPlus,
    title: 'Host Events',
    desc: 'Create & manage your events',
    accent: 'secondary',
  },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('user');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { displayName: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true);
    setError('');
    try {
      await authService.registerWithEmail(data.email.trim(), data.password, data.displayName.trim(), role);
      navigate(role === 'host' ? '/host/dashboard' : '/onboarding');
    } catch (err: any) {
      setError(err.message || 'Could not create account.');
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-black text-text-primary">Create Account</h2>
        <p className="text-text-secondary text-sm mt-1">Choose how you'll use HangOut</p>
      </div>

      {/* Role picker */}
      <div className="grid grid-cols-2 gap-3">
        {ROLES.map(({ value, icon: Icon, title, desc, accent }) => {
          const active = role === value;
          const isHost = value === 'host';
          return (
            <button
              key={value}
              type="button"
              onClick={() => setRole(value)}
              className={`relative flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 text-center transition-all ${
                active
                  ? isHost
                    ? 'border-secondary bg-orange-50 shadow-md shadow-secondary/15'
                    : 'border-primary bg-primary-light shadow-md shadow-primary/15'
                  : 'border-app-border bg-white hover:border-primary/30'
              }`}
            >
              {active && (
                <span className={`absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center ${isHost ? 'bg-secondary' : 'bg-primary'}`}>
                  <Check size={9} className="text-white" strokeWidth={3} />
                </span>
              )}
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                active
                  ? isHost ? 'bg-secondary text-white shadow-md shadow-secondary/30' : 'bg-primary text-white shadow-md shadow-primary/30'
                  : 'bg-surface text-text-secondary'
              }`}>
                <Icon size={21} />
              </div>
              <div>
                <p className={`text-sm font-black leading-tight ${
                  active ? (isHost ? 'text-secondary' : 'text-primary') : 'text-text-primary'
                }`}>{title}</p>
                <p className="text-[11px] text-text-secondary mt-0.5 leading-snug">{desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Controller control={control} name="displayName"
          render={({ field: { onChange, value } }) => (
            <Input
              label={role === 'host' ? 'Full Name / Organisation' : 'Full Name'}
              placeholder={role === 'host' ? 'e.g. Rhythm Republic Events' : 'Your name'}
              leftIcon={User} value={value}
              onChange={(e) => onChange(e.target.value)}
              error={errors.displayName?.message}
            />
          )}
        />
        <Controller control={control} name="email"
          render={({ field: { onChange, value } }) => (
            <Input label="Email" placeholder="you@example.com" type="email" leftIcon={Mail} value={value}
              onChange={(e) => onChange(e.target.value)} error={errors.email?.message} />
          )}
        />
        <Controller control={control} name="password"
          render={({ field: { onChange, value } }) => (
            <Input label="Password" placeholder="Min 6 characters" leftIcon={Lock} isPassword value={value}
              onChange={(e) => onChange(e.target.value)} error={errors.password?.message} />
          )}
        />
        <Controller control={control} name="confirmPassword"
          render={({ field: { onChange, value } }) => (
            <Input label="Confirm Password" placeholder="Repeat password" leftIcon={Lock} isPassword value={value}
              onChange={(e) => onChange(e.target.value)} error={errors.confirmPassword?.message} />
          )}
        />

        {error && <p className="text-sm text-red-400 text-center">{error}</p>}

        <GradientButton
          label={role === 'host' ? 'Create Host Account' : 'Create Account'}
          type="submit"
          fullWidth
          isLoading={isSubmitting}
        />
      </form>

      <p className="text-center text-text-secondary text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
      </p>
    </div>
  );
}
