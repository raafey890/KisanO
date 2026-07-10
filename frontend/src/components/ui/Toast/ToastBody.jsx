/**
 * KisanO Design System — Toast Package
 * ToastBody
 *
 * The body section of a Toast notification. Renders the title, message,
 * and custom children content with proper spacing and typography.
 *
 * Single Responsibility: Render the toast body content.
 * Does not manage toast state, timers, progress bars, or close buttons.
 *
 * @module components/ui/Toast/ToastBody
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  TOAST_DEFAULTS,
  getToastSize,
} from './toastVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
} from './toastUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Spacing between body elements. */
const BODY_GAP = 'gap-1';

/** Motion variants for body animation. */
const BODY_MOTION = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * ToastBody – the body content of a toast notification.
 *
 * @component
 * @example
 * <ToastBody
 *   title="Success!"
 *   message="Your changes have been saved."
 * />
 */
const ToastBody = memo(
  forwardRef(function ToastBody(
    {
      title,
      message,
      children,
      size = TOAST_DEFAULTS.size,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'status',
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

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Base body classes.
    const bodyClasses = useMemo(() => {
      const base = mergeClasses(
        'flex flex-col flex-1 min-w-0',
        BODY_GAP,
        sizeConfig.text,
        disabled && 'opacity-50 cursor-not-allowed',
        loading && 'opacity-70',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [sizeConfig.text, disabled, loading, className, responsiveClasses]);

    // Title classes.
    const titleClasses = useMemo(() => {
      const base = mergeClasses(
        'font-semibold leading-tight',
        sizeConfig.text,
        'text-gray-900',
        disabled && 'text-gray-500',
        loading && 'text-gray-400',
      );
      return base;
    }, [sizeConfig.text, disabled, loading]);

    // Message classes.
    const messageClasses = useMemo(() => {
      const base = mergeClasses(
        'font-normal leading-relaxed',
        'text-gray-700',
        disabled && 'text-gray-500',
        loading && 'text-gray-400',
      );
      return base;
    }, [disabled, loading]);

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return BODY_MOTION;
    }, [prefersReducedMotion]);

    // Determine if body has content.
    const hasContent = Boolean(title || message || children);

    // If no content, render nothing.
    if (!hasContent) {
      return null;
    }

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || title || 'Notification content',
        'aria-disabled': disabled || undefined,
        'aria-busy': loading || undefined,
      }),
      [role, ariaLabel, title, disabled, loading],
    );

    return (
      <motion.div
        ref={ref}
        className={bodyClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {title && (
          <h4 className={titleClasses}>
            {title}
          </h4>
        )}
        {message && (
          <p className={messageClasses}>
            {message}
          </p>
        )}
        {children}
      </motion.div>
    );
  }),
);

ToastBody.displayName = 'ToastBody';

ToastBody.propTypes = {
  /** Toast title. */
  title: PropTypes.node,
  /** Toast message/content. */
  message: PropTypes.node,
  /** Custom children (rendered after title and message). */
  children: PropTypes.node,
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
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

export default ToastBody;