import React, { useState, InputHTMLAttributes } from 'react';
import { FieldError } from 'react-hook-form';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: FieldError;
}

export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || props.name;

    return (
      <div className="space-y-2">
        <label htmlFor={inputId} className="block text-sm font-medium text-white/80">
          {label}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
            <Lock className="h-5 w-5" />
          </div>
          <input
            id={inputId}
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            className={`w-full bg-white/5 border ${
              error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#4ADE80]'
            } rounded-xl px-4 py-3 pl-10 pr-10 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4ADE80]/50 transition-colors ${className}`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white/80 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-400">
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

PasswordField.displayName = 'PasswordField';
