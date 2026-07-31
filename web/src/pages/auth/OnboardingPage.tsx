import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GradientButton } from '../../components/ui/GradientButton';
import { useAuthStore } from '@store/authStore';
import { usersService } from '@services/firebase/users.service';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const finish = async () => {
    if (user) {
      await usersService.update(user.uid, { onboardingCompleted: true });
      setUser({ ...user, onboardingCompleted: true });
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-app-bg flex flex-col items-center justify-center px-6 text-center gap-8">
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-black text-text-primary">Welcome to <span className="text-primary">HangOut</span> 🎉</h1>
        <p className="text-text-secondary text-base max-w-xs mx-auto">
          Discover local events, buy tickets, and hang out with your people.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {[
          { emoji: '🎵', label: 'Music & Nightlife' },
          { emoji: '🍔', label: 'Food & Drink' },
          { emoji: '🏆', label: 'Sports & Fitness' },
          { emoji: '🎨', label: 'Arts & Culture' },
        ].map((item) => (
          <div key={item.label} className="bg-card border border-app-border rounded-2xl p-4 flex flex-col items-center gap-2">
            <span className="text-3xl">{item.emoji}</span>
            <span className="text-text-primary text-xs font-bold">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="w-full max-w-sm">
        <GradientButton label="Let's Go!" fullWidth onClick={finish} />
      </div>
    </div>
  );
}
