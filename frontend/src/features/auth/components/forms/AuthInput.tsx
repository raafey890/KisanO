import React, { InputHTMLAttributes } from 'react';
import { FieldError } from 'react-hook-form';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  icon?: React.ReactNode;
}

export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, icon, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="space-y-2">
        <label htmlFor={inputId} className="block text-sm font-medium text-white/80">
          {label}
        </label>
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-white/5 border ${
              error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#4ADE80]'
            } rounded-xl px-4 py-3 pl-10 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#4ADE80]/50 transition-colors ${className}`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
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

AuthInput.displayName = 'AuthInput';
