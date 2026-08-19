import React, { useState, InputHTMLAttributes } from 'react';
import { FieldError } from 'react-hook-form';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: FieldError;
  isValid?: boolean;
  /** Password strength object – rendered below when provided */
  strength?: {
    score: 0 | 1 | 2 | 3; // 0=none 1=weak 2=medium 3=strong 4=very-strong treated as >=3
    label: string;
  };
}

const STRENGTH_CONFIG = [
  { label: 'Weak',        barClass: 'w-1/4 bg-red-500',    textClass: 'text-red-400' },
  { label: 'Weak',        barClass: 'w-1/4 bg-red-500',    textClass: 'text-red-400' },
  { label: 'Medium',      barClass: 'w-2/4 bg-amber-400',  textClass: 'text-amber-400' },
  { label: 'Strong',      barClass: 'w-3/4 bg-emerald-400',textClass: 'text-emerald-400' },
  { label: 'Very Strong', barClass: 'w-full bg-green-500', textClass: 'text-green-400' },
];

/**
 * Enterprise PasswordField
 * -------------------------
 * - Lock icon in fixed left zone; eye toggle in fixed right zone.
 * - Text can never overlap either icon.
 * - Optional strength bar (UI only – score computed by parent).
 * - Full state support, ARIA, CSS tokens.
 */
export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, error, isValid, strength, className = '', id, disabled, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || props.name;
    const descId = error ? `${inputId}-error` : undefined;

    const borderClass = error
      ? 'border-[var(--auth-input-error)] focus:border-[var(--auth-input-error)] focus:ring-red-500/20'
      : isValid
      ? 'border-[var(--auth-input-success)] focus:border-[var(--auth-input-success)] focus:ring-green-500/20'
      : 'border-[var(--auth-input-border)] hover:border-white/20 focus:border-[var(--auth-input-focus)] focus:ring-[var(--auth-primary-muted)]';

    const sc = strength ? STRENGTH_CONFIG[Math.min(strength.score + 1, 4)] : null;

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
          {/* Lock icon – left zone */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 inset-y-0 w-12 flex items-center justify-center text-[var(--auth-text-muted)]"
          >
            <Lock size={18} />
          </div>

          <input
            id={inputId}
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            disabled={disabled}
            style={{ paddingLeft: 'var(--auth-input-pl)', paddingRight: 'var(--auth-input-pr)' }}
            className={[
              'w-full rounded-[var(--auth-radius)] border bg-[var(--auth-input-bg)]',
              'py-3 text-[16px] text-[var(--auth-text-primary)]',
              'placeholder:text-[var(--auth-text-muted)]',
              'outline-none transition-all duration-[var(--auth-duration)] ease-[var(--auth-ease)]',
              'focus:ring-2 auth-input-glow',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              borderClass,
              className,
            ].join(' ')}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={descId}
            autoComplete={props.autoComplete ?? 'current-password'}
            {...props}
          />

          {/* Right zone: eye toggle */}
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            disabled={disabled}
            className="absolute right-0 inset-y-0 w-12 flex items-center justify-center text-[var(--auth-text-muted)] hover:text-[var(--auth-text-secondary)] transition-colors disabled:opacity-50 auth-focus-ring rounded-r-[var(--auth-radius)]"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Password strength bar */}
        {sc && (
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-500 rounded-full ${sc.barClass}`} />
            </div>
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${sc.textClass}`}>
              {sc.label}
            </span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <p id={`${inputId}-error`} role="alert" className="flex items-center gap-1 text-[13px] text-red-400">
            <AlertCircle size={12} aria-hidden="true" />
            {error.message}
          </p>
        )}
        {!error && isValid && (
          <p className="flex items-center gap-1 text-[13px] text-green-400">
            <CheckCircle2 size={12} aria-hidden="true" />
            Looks good!
          </p>
        )}
      </div>
    );
  }
);

PasswordField.displayName = 'PasswordField';
