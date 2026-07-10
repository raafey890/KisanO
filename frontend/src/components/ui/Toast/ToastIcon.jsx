/**
 * KisanO Design System — Toast Package
 * ToastIcon
 *
 * The icon section of a Toast notification. Renders a custom icon or
 * a default icon based on the toast variant (success, error, warning, info, loading).
 *
 * Single Responsibility: Render the toast icon.
 * Does not manage toast state, timers, progress bars, or close buttons.
 *
 * @module components/ui/Toast/ToastIcon
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  TOAST_DEFAULTS,
  getToastSize,
  getToastVariant,
} from './toastVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
} from './toastUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Default icon components for each variant. */
const DEFAULT_ICONS = {
  success: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  loading: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
};

/** Motion variants. */
const ICON_MOTION = {
  initial: { opacity: 0, scale: 0.8, rotate: -30 },
  animate: { opacity: 1, scale: 1, rotate: 0 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
};

/** Loading spinner animation. */
const LOADING_MOTION = {
  animate: { rotate: 360 },
  transition: { duration: 1, repeat: Infinity, ease: 'linear' },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * ToastIcon – the icon of a toast notification.
 *
 * @component
 * @example
 * <ToastIcon variant="success" size="md" />
 *
 * @example
 * <ToastIcon variant="info" size="lg">
 *   <CustomIcon />
 * </ToastIcon>
 */
const ToastIcon = memo(
  forwardRef(function ToastIcon(
    {
      children,
      variant = TOAST_DEFAULTS.variant,
      size = TOAST_DEFAULTS.size,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'img',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Get size configuration.
    const sizeConfig = useMemo(
      () => getToastSize(size),
      [size],
    );

    // Get variant configuration.
    const variantConfig = useMemo(
      () => getToastVariant(variant),
      [variant],
    );

    // Determine if loading variant.
    const isLoading = variant === 'loading' || loading;

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Icon wrapper classes.
    const iconClasses = useMemo(() => {
      const base = mergeClasses(
        'shrink-0',
        sizeConfig.icon,
        variantConfig.icon,
        disabled && 'opacity-50',
        loading && 'opacity-50',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [sizeConfig.icon, variantConfig.icon, disabled, loading, className, responsiveClasses]);

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return ICON_MOTION;
    }, [prefersReducedMotion]);

    // Loading motion props.
    const loadingMotionProps = useMemo(() => {
      if (prefersReducedMotion || !isLoading) {
        return {};
      }
      return LOADING_MOTION;
    }, [prefersReducedMotion, isLoading]);

    // Determine which icon to render.
    const iconContent = useMemo(() => {
      if (children) return children;
      return DEFAULT_ICONS[variant] || DEFAULT_ICONS.info;
    }, [children, variant]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || `${variant} icon`,
        'aria-hidden': !ariaLabel,
      }),
      [role, ariaLabel, variant],
    );

    return (
      <motion.div
        ref={ref}
        className={iconClasses}
        {...motionProps}
        {...loadingMotionProps}
        {...ariaProps}
        {...rest}
      >
      <span className='block h-full w-full'>

      
        {iconContent}
        </span>
        
      </motion.div>
    );
  }),
);

ToastIcon.displayName = 'ToastIcon';

ToastIcon.propTypes = {
  /** Custom icon (overrides default). */
  children: PropTypes.node,
  /** Toast variant (affects default icon and color). */
  variant: PropTypes.oneOf(['success', 'error', 'warning', 'info', 'loading']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state (triggers spinner animation). */
  loading: PropTypes.bool,
  /** Responsive overrides. */
  responsive: PropTypes.shape({
    xs: PropTypes.string,
    sm: PropTypes.string,
    md: PropTypes.string,
    lg: PropTypes.string,
    xl: PropTypes.string,
  }),
  /** Additional CSS classes. */
  className: PropTypes.string,
  /** ARIA role. */
  role: PropTypes.string,
  /** Accessible label. */
  'aria-label': PropTypes.string,
};

export default ToastIcon;