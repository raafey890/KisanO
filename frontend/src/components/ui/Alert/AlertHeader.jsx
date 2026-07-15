/**
 * KisanO Design System — Alert Package
 * AlertHeader
 *
 * The header section of an Alert. Renders the title and message content
 * with proper typography and spacing.
 *
 * Single Responsibility: Render the alert header with title and message.
 * Does not manage alert state, icons, or actions.
 *
 * @module components/ui/Alert/AlertHeader
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  ALERT_DEFAULTS,
  getAlertSize,
  getAlertVariant,
} from './alertVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getAlertHeaderClasses,
} from './alertUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for header animation. */
const HEADER_MOTION = {
  initial: { opacity: 0, y: -4 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * AlertHeader – the header of an alert.
 *
 * @component
 * @example
 * <AlertHeader
 *   title="Success!"
 *   message="Your changes have been saved."
 * />
 */
const AlertHeader = memo(
  forwardRef(function AlertHeader(
    {
      children,
      title,
      message,
      size = ALERT_DEFAULTS.size,
      variant = ALERT_DEFAULTS.variant,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'heading',
      'aria-level': ariaLevel = 3,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Get size configuration.
    const sizeConfig = useMemo(
      () => getAlertSize(size),
      [size],
    );

    // Get variant configuration.
    const variantConfig = useMemo(
      () => getAlertVariant(variant),
      [variant],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Header classes.
    const headerClasses = useMemo(() => {
      const base = getAlertHeaderClasses({
        className,
        disabled,
      });
      return mergeClasses(base, responsiveClasses);
    }, [className, disabled, responsiveClasses]);

    // Title classes.
    const titleClasses = useMemo(() => {
      const base = mergeClasses(
        'font-semibold leading-tight',
        sizeConfig.text,
        variantConfig.text,
        disabled && 'opacity-50',
        loading && 'opacity-70',
      );
      return base;
    }, [sizeConfig.text, variantConfig.text, disabled, loading]);

    // Message classes.
    const messageClasses = useMemo(() => {
      const base = mergeClasses(
        'font-normal leading-relaxed',
        sizeConfig.text,
        'text-gray-600',
        disabled && 'opacity-50',
        loading && 'opacity-70',
      );
      return base;
    }, [sizeConfig.text, disabled, loading]);

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return HEADER_MOTION;
    }, [prefersReducedMotion]);

    // Determine if header has content.
    const hasContent = Boolean(title || message || children);

    // If no content, render nothing.
    if (!hasContent) {
      return null;
    }

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-level': ariaLevel,
        'aria-disabled': disabled || undefined,
        'aria-busy': loading || undefined,
      }),
      [role, ariaLevel, disabled, loading],
    );

    return (
      <motion.div
        ref={ref}
        className={headerClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {title && (
          <div className={titleClasses}>
            {title}
          </div>
        )}
        {message && (
          <div className={messageClasses}>
            {message}
          </div>
        )}
        {children}
      </motion.div>
    );
  }),
);

AlertHeader.displayName = 'AlertHeader';

AlertHeader.propTypes = {
  /** Alert title. */
  title: PropTypes.node,
  /** Alert message. */
  message: PropTypes.node,
  /** Additional content (rendered below message). */
  children: PropTypes.node,
  /** Alert size (affects typography). */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Alert variant (affects text color). */
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info']),
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
  /** ARIA heading level. */
  'aria-level': PropTypes.number,
};

export default AlertHeader;