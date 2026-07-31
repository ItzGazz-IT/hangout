import React from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  size?: 'sm' | 'md';
}

const variants = {
  primary: 'bg-primary text-white font-bold hover:bg-primary-dark',
  outline: 'border border-app-border text-text-primary hover:bg-surface',
  ghost: 'text-text-secondary hover:text-text-primary',
  danger: 'bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20',
};

export function Button({ label, onClick, variant = 'primary', fullWidth, isLoading, disabled, type = 'button', size = 'md' }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${size === 'sm' ? 'px-3 py-2 text-sm' : 'px-5 py-3 text-sm'}
        rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {isLoading ? 'Loading…' : label}
    </button>
  );
}
