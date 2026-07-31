import React, { useState } from 'react';
import { Eye, EyeOff, LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  onRightIconPress?: () => void;
  isPassword?: boolean;
}

export function Input({ label, error, leftIcon: LeftIcon, rightIcon: RightIcon, onRightIconPress, isPassword = false, ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = isPassword ? (showPassword ? 'text' : 'password') : props.type;

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-semibold text-text-secondary">{label}</label>}
      <div className={`
        flex items-center gap-2 px-3 rounded-xl border bg-surface transition-colors
        ${isFocused ? 'border-primary' : error ? 'border-red-500' : 'border-app-border'}
      `}>
        {LeftIcon && <LeftIcon size={16} className={isFocused ? 'text-primary' : 'text-muted'} />}
        <input
          {...props}
          type={inputType}
          onFocus={(e) => { setIsFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setIsFocused(false); props.onBlur?.(e); }}
          className="flex-1 bg-transparent py-3 text-sm text-text-primary placeholder-muted outline-none"
        />
        {isPassword && (
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted hover:text-text-primary">
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
        {RightIcon && !isPassword && (
          <button type="button" onClick={onRightIconPress} className="text-muted hover:text-text-primary">
            <RightIcon size={16} />
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
