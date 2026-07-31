import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Zap } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { GradientButton } from '../../components/ui/GradientButton';
import { authService } from '@services/firebase/auth.service';
import { loginSchema, type LoginFormData } from '@utils/validators';
import { setDemoMode, DEMO_USER } from '../../lib/demoMode';
import { useAuthStore } from '@store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDemoLogin = () => {
    setDemoMode();
    setUser(DEMO_USER);
    navigate('/');
  };

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true);
    setError('');
    try {
      await authService.loginWithEmail(data.email.trim(), data.password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-black text-text-primary">Welcome Back</h2>
        <p className="text-text-secondary text-sm mt-1">Sign in to discover your next HangOut</p>
      </div>

      {/* Demo credentials banner */}
      <button
        type="button"
        onClick={handleDemoLogin}
        className="flex items-center gap-3 w-full rounded-2xl border-2 border-dashed border-primary/40 bg-primary-light px-4 py-3.5 hover:border-primary hover:bg-primary/10 transition-all text-left group"
      >
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 shadow-md shadow-primary/30 group-hover:scale-105 transition-transform">
          <Zap size={16} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-primary font-black text-sm">Try Demo Account</p>
          <p className="text-text-secondary text-[11px] font-medium">Instant access · no sign-up needed · test tickets &amp; payments</p>
        </div>
        <span className="text-primary font-black text-xs bg-white border border-primary/20 rounded-lg px-2 py-1 flex-shrink-0">GO →</span>
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-app-border" />
        <span className="text-text-muted text-xs font-semibold">or sign in</span>
        <div className="flex-1 h-px bg-app-border" />
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Email"
              placeholder="you@example.com"
              type="email"
              autoComplete="email"
              leftIcon={Mail}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Password"
              placeholder="Enter your password"
              leftIcon={Lock}
              isPassword
              value={value}
              onChange={(e) => onChange(e.target.value)}
              error={errors.password?.message}
            />
          )}
        />

        <Link to="/forgot-password" className="text-xs text-primary hover:underline self-end -mt-1">
          Forgot password?
        </Link>

        {error && <p className="text-sm text-red-400 text-center">{error}</p>}

        <GradientButton label="Sign In" type="submit" fullWidth isLoading={isSubmitting} />
      </form>

      <p className="text-center text-text-secondary text-sm">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary font-bold hover:underline">Sign Up</Link>
      </p>
    </div>
  );
}
