import React, { InputHTMLAttributes } from 'react';
import { FieldError } from 'react-hook-form';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  /** Success message shown below input */
  success?: string;
  /** Lucide icon element rendered on the left */
  icon?: React.ReactNode;
  /** Whether the field value is confirmed valid */
  isValid?: boolean;
}

/**
 * Enterprise AuthInput
 * ---------------------
 * - Icon sits in a dedicated left zone; text never overlaps.
 * - Supports hover / focus / error / success / disabled / loading states.
 * - ARIA: aria-invalid, aria-describedby, autocomplete forwarded.
 * - Uses CSS design tokens from auth-tokens.css.
 */
export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, success, icon, isValid, className = '', id, disabled, ...props }, ref) => {
    const inputId = id || props.name;
    const descId = error ? `${inputId}-error` : success ? `${inputId}-success` : undefined;

    const borderClass = error
      ? 'border-[var(--auth-input-error)] focus:border-[var(--auth-input-error)] focus:ring-red-500/20'
      : isValid
      ? 'border-[var(--auth-input-success)] focus:border-[var(--auth-input-success)] focus:ring-green-500/20'
      : 'border-[var(--auth-input-border)] hover:border-white/20 focus:border-[var(--auth-input-focus)] focus:ring-[var(--auth-primary-muted)]';

    return (
      <div className="flex flex-col gap-1.5">
        {/* Label */}
        <label
          htmlFor={inputId}
          className="block text-[15px] font-medium text-[var(--auth-text-primary)] select-none"
        >
          {label}
        </label>

        {/* Input wrapper */}
        <div className="relative flex items-center">
          {/* Left icon zone – fixed width, never intrudes on text */}
          {icon && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-0 inset-y-0 w-12 flex items-center justify-center text-[var(--auth-text-muted)]"
            >
              {icon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            style={{ paddingLeft: icon ? 'var(--auth-input-pl)' : '1rem' }}
            className={[
              'w-full rounded-[var(--auth-radius)] border bg-[var(--auth-input-bg)]',
              'py-3 pr-4 text-[16px] text-[var(--auth-text-primary)]',
              'placeholder:text-[var(--auth-text-muted)]',
              'outline-none transition-all duration-[var(--auth-duration)] ease-[var(--auth-ease)]',
              'focus:ring-2 auth-input-glow',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              borderClass,
              className,
            ].join(' ')}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={descId}
            {...props}
          />

          {/* Right status icon */}
          {(error || isValid) && (
            <div className="pointer-events-none absolute right-3 inset-y-0 flex items-center">
              {error
                ? <AlertCircle size={16} className="text-red-400" aria-hidden="true" />
                : <CheckCircle2 size={16} className="text-green-400" aria-hidden="true" />
              }
            </div>
          )}
        </div>

        {/* Error / success message */}
        {error && (
          <p id={`${inputId}-error`} role="alert" className="flex items-center gap-1 text-[13px] text-red-400">
            <AlertCircle size={12} aria-hidden="true" />
            {error.message}
          </p>
        )}
        {!error && success && (
          <p id={`${inputId}-success`} className="flex items-center gap-1 text-[13px] text-green-400">
            <CheckCircle2 size={12} aria-hidden="true" />
            {success}
          </p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = 'AuthInput';
