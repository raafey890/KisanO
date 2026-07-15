/**
 * KisanO Design System — Alert Package
 * AlertBody
 *
 * The body content of an Alert. Renders the message and additional content
 * with proper typography and spacing. Used within AlertContainer.
 *
 * Single Responsibility: Render the alert body content with layout
 * and accessibility support. Does not handle header, footer, or actions.
 *
 * @module components/ui/Alert/AlertBody
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
  getAlertBodyClasses,
} from './alertUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for body animation. */
const BODY_MOTION = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * AlertBody – the body content of an alert.
 *
 * @component
 * @example
 * <AlertBody>
 *   Your changes have been saved successfully.
 * </AlertBody>
 *
 * @example
 * <AlertBody size="lg" variant="success">
 *   <p>Operation completed!</p>
 *   <p className="mt-2">Additional details...</p>
 * </AlertBody>
 */
const AlertBody = memo(
  forwardRef(function AlertBody(
    {
      children,
      size = ALERT_DEFAULTS.size,
      variant = ALERT_DEFAULTS.variant,
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

    // Body classes.
    const bodyClasses = useMemo(() => {
      const base = getAlertBodyClasses({
        size,
        className,
        disabled,
      });
      return mergeClasses(base, responsiveClasses);
    }, [size, className, disabled, responsiveClasses]);

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return BODY_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || 'Alert content',
        'aria-busy': loading || undefined,
        'aria-disabled': disabled || undefined,
      }),
      [role, ariaLabel, loading, disabled],
    );

    // If no children, render nothing.
    if (!children) {
      return null;
    }

    // If loading, show a simple loading state.
    if (loading) {
      return (
        <motion.div
          ref={ref}
          className={bodyClasses}
          {...motionProps}
          {...ariaProps}
          {...rest}
        >
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        ref={ref}
        className={bodyClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }),
);

AlertBody.displayName = 'AlertBody';

AlertBody.propTypes = {
  /** Alert content. */
  children: PropTypes.node,
  /** Alert size (affects typography and spacing). */
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
  /** Accessible label. */
  'aria-label': PropTypes.string,
};

export default AlertBody;