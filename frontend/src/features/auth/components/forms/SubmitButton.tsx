import React from 'react';
import { Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children?: React.ReactNode;
  /** Override label shown while loading. Default: "Processing…" */
  loadingLabel?: string;
  /** If true, only the icon is shown (icon-only button) */
  iconOnly?: boolean;
  /** Variant: 'primary' | 'outlined'. Default: 'primary' */
  variant?: 'primary' | 'outlined';
}

/**
 * Enterprise SubmitButton
 * ------------------------
 * - Full-width, large green gradient primary button.
 * - Outlined variant for secondary actions (e.g., "Login with OTP").
 * - Loading state: disables all input, shows spinner.
 * - Framer Motion scale/lift on hover + tap.
 * - Uses CSS design tokens.
 */
export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isLoading,
  children,
  loadingLabel = 'Processing…',
  variant = 'primary',
  disabled,
  className = '',
  ...props
}) => {
  const isPrimary = variant === 'primary';

  const baseClasses = [
    'relative w-full flex items-center justify-center gap-2',
    'py-3.5 px-6 rounded-[var(--auth-radius)]',
    'text-[16px] font-semibold tracking-wide',
    'transition-all duration-[var(--auth-duration)] ease-[var(--auth-ease)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--auth-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--auth-card-bg)]',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    isPrimary
      ? 'bg-gradient-to-r from-[var(--auth-primary)] to-[var(--auth-primary-hover)] text-white shadow-lg shadow-green-900/30'
      : 'bg-transparent border border-[var(--auth-primary-border)] text-[var(--auth-primary)] hover:bg-[var(--auth-primary-muted)]',
    className,
  ].join(' ');

  return (
    <motion.button
      type="submit"
      disabled={isLoading || disabled}
      className={baseClasses}
      whileHover={!isLoading && !disabled ? { scale: 1.02, y: -1 } : {}}
      whileTap={!isLoading && !disabled ? { scale: 0.98 } : {}}
      transition={{ duration: 0.15 }}
      {...(props as any)}
    >
      {isLoading ? (
        <>
          <Loader2 size={18} className="animate-spin" aria-hidden="true" />
          <span>{loadingLabel}</span>
        </>
      ) : (
        <>
          {children ?? (
            <>
              <span>Sign In</span>
              <ArrowRight size={18} aria-hidden="true" />
            </>
          )}
        </>
      )}
    </motion.button>
  );
};
