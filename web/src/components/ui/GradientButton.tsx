import React from 'react';

interface GradientButtonProps {
  label: string;
  onPress?: () => void;
  onClick?: () => void;
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function GradientButton({ label, onPress, onClick, fullWidth, isLoading, disabled, type = 'button' }: GradientButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick ?? onPress}
      disabled={disabled || isLoading}
      className={`
        ${fullWidth ? 'w-full' : ''}
        py-3 px-5 rounded-xl text-sm font-bold text-white
        bg-gradient-to-r from-primary to-secondary
        hover:opacity-90 active:scale-[0.98] transition-all
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {isLoading ? 'Loading…' : label}
    </button>
  );
}
