/**
 * KisanO Design System — Alert Package
 * AlertIcon
 *
 * The icon section of an Alert. Renders a custom icon or a default icon
 * based on the alert variant (success, error, warning, info, etc.).
 *
 * Single Responsibility: Render the alert icon.
 * Does not manage alert state, actions, or body content.
 *
 * @module components/ui/Alert/AlertIcon
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  ALERT_DEFAULTS,
  getAlertIcon,
  getAlertSize,
  getAlertVariant,
} from './alertVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getAlertIconClasses,
} from './alertUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for icon animation. */
const ICON_MOTION = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * AlertIcon – the icon of an alert.
 *
 * @component
 * @example
 * <AlertIcon variant="success" size="md" />
 *
 * @example
 * <AlertIcon variant="error">
 *   <CustomIcon />
 * </AlertIcon>
 */
const AlertIcon = memo(
  forwardRef(function AlertIcon(
    {
      children,
      variant = ALERT_DEFAULTS.variant,
      size = ALERT_DEFAULTS.size,
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

    // Icon classes.
    const iconClasses = useMemo(() => {
      const base = getAlertIconClasses({
        variant,
        size,
        className,
        disabled,
      });
      return mergeClasses(base, responsiveClasses);
    }, [variant, size, className, disabled, responsiveClasses]);

    // Determine which icon to render.
    const iconContent = useMemo(() => {
      if (children) return children;
      return getAlertIcon(variant);
    }, [children, variant]);

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return ICON_MOTION;
    }, [prefersReducedMotion]);

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
        {...ariaProps}
        {...rest}
      >
        {iconContent}
      </motion.div>
    );
  }),
);

AlertIcon.displayName = 'AlertIcon';

AlertIcon.propTypes = {
  /** Custom icon (overrides default). */
  children: PropTypes.node,
  /** Alert variant (affects default icon and color). */
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info']),
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

export default AlertIcon;