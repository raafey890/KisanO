/**
 * KisanO Design System — Toast Package
 * ToastHeader
 *
 * The header section of a Toast notification. Renders the title,
 * subtitle, icon, and close button. Provides flexible alignment
 * and responsive support.
 *
 * Single Responsibility: Render the toast header with title,
 * subtitle, icon, and close button. Does not manage toast state
 * or auto-dismiss logic.
 *
 * @module components/ui/Toast/ToastHeader
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  TOAST_DEFAULTS,
  TOAST_CLOSE_BUTTON_ICON_SIZES,
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

/** Alignment mapping. */
const ALIGNMENT_MAP = {
  start: 'items-start text-left',
  center: 'items-center text-center',
  end: 'items-end text-right',
};

/** Spacing between header elements. */
const HEADER_GAP = 'gap-2';

/** Motion variants. */
const HEADER_MOTION = {
  initial: { opacity: 0, y: -6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * ToastHeader – the header of a toast notification.
 *
 * @component
 * @example
 * <ToastHeader
 *   title="Success!"
 *   subtitle="Your changes have been saved."
 *   onClose={handleClose}
 * />
 */
const ToastHeader = memo(
  forwardRef(function ToastHeader(
    {
      title,
      subtitle,
      icon,
      closeButton = true,
      onClose,
      size = TOAST_DEFAULTS.size,
      variant = TOAST_DEFAULTS.variant,
      align = 'start',
      disabled = false,
      loading = false,
      responsive,
      className = '',
      children,
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

    // Resolve alignment classes.
    const alignClasses = useMemo(
      () => ALIGNMENT_MAP[align] || ALIGNMENT_MAP.start,
      [align],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Base header classes.
    const headerClasses = useMemo(() => {
      const base = mergeClasses(
        'flex w-full',
        alignClasses,
        HEADER_GAP,
        disabled && 'opacity-50 cursor-not-allowed',
        loading && 'opacity-70',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [alignClasses, disabled, loading, className, responsiveClasses]);

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

    // Subtitle classes.
    const subtitleClasses = useMemo(() => {
      const base = mergeClasses(
        'font-normal leading-relaxed',
        'text-sm',
        'text-gray-600',
        disabled && 'text-gray-400',
        loading && 'text-gray-400',
      );
      return base;
    }, [disabled, loading]);

    // Icon wrapper classes.
    const iconClasses = useMemo(() => {
      const base = mergeClasses(
        'shrink-0',
        variantConfig.icon,
        disabled && 'opacity-50',
        loading && 'opacity-50',
      );
      return base;
    }, [variantConfig.icon, disabled, loading]);

    // Icon size from size config.
    const iconSize = useMemo(
      () => sizeConfig.icon,
      [sizeConfig.icon],
    );

    // Close button classes.
    const closeButtonClasses = useMemo(() => {
      const base = mergeClasses(
        'shrink-0 ml-auto p-1 rounded-full',
        'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
        'focus:outline-none focus:ring-2 focus:ring-blue-500',
        'transition-colors duration-200',
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        loading && 'opacity-50',
      );
      return base;
    }, [disabled, loading]);

    // Close icon size.
    const closeIconSize = useMemo(
  () =>
    TOAST_CLOSE_BUTTON_ICON_SIZES[size] ||
    TOAST_CLOSE_BUTTON_ICON_SIZES[TOAST_DEFAULTS.size],
  [size],
);
    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return HEADER_MOTION;
    }, [prefersReducedMotion]);

    // Handle close click.
    const handleClose = (event) => {
      if (disabled || loading) return;
      onClose?.(event);
    };

    // Determine if header has content.
    const hasTitle = Boolean(title || subtitle || children);
    const hasIcon = Boolean(icon);
    const showClose = closeButton && onClose && !loading;

    // If no content, render nothing.
    if (!hasTitle && !hasIcon && !showClose) {
      return null;
    }

    return (
      <motion.header
        ref={ref}
        className={headerClasses}
        {...motionProps}
        {...rest}
      >
        {/* Icon */}
        {hasIcon && (
          <div className={iconClasses} aria-hidden="true">
            <span className={iconSize}>{icon}</span>
          </div>
        )}

        {/* Title and Subtitle */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={titleClasses}>
              {title}
            </h4>
          )}
          {subtitle && (
            <p className={subtitleClasses}>
              {subtitle}
            </p>
          )}
          {children}
        </div>

        {/* Close Button */}
        {showClose && (
          <button
            type="button"
            className={closeButtonClasses}
            onClick={handleClose}
            aria-label="Close notification"
            disabled={disabled}
          >
            <svg
              className={closeIconSize}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </motion.header>
    );
  }),
);

ToastHeader.displayName = 'ToastHeader';

ToastHeader.propTypes = {
  /** Toast title. */
  title: PropTypes.node,
  /** Toast subtitle. */
  subtitle: PropTypes.node,
  /** Custom icon. */
  icon: PropTypes.node,
  /** Whether to show the close button. */
  closeButton: PropTypes.bool,
  /** Called when close button is clicked. */
  onClose: PropTypes.func,
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Variant for styling. */
  variant: PropTypes.oneOf(['success', 'error', 'warning', 'info', 'loading']),
  /** Alignment of header content. */
  align: PropTypes.oneOf(['start', 'center', 'end']),
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
  /** Additional content. */
  children: PropTypes.node,
};

export default ToastHeader;