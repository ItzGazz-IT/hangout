import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { GradientButton } from '../../components/ui/GradientButton';
import { authService } from '@services/firebase/auth.service';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      await authService.resetPassword(email.trim());
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Could not send reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col gap-6 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <Mail size={28} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-black text-text-primary">Check your email</h2>
          <p className="text-text-secondary text-sm mt-2">We sent a password reset link to <strong className="text-text-primary">{email}</strong></p>
        </div>
        <Link to="/login" className="text-primary font-bold hover:underline text-sm">Back to Sign In</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-black text-text-primary">Reset Password</h2>
        <p className="text-text-secondary text-sm mt-1">Enter your email and we'll send a reset link</p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input label="Email" placeholder="you@example.com" type="email" leftIcon={Mail}
          value={email} onChange={(e) => setEmail(e.target.value)} />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <GradientButton label="Send Reset Link" type="submit" fullWidth isLoading={isLoading} />
      </form>

      <p className="text-center text-text-secondary text-sm">
        <Link to="/login" className="text-primary font-bold hover:underline">Back to Sign In</Link>
      </p>
    </div>
  );
}
