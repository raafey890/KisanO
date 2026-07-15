/**
 * KisanO Design System — Badge Package
 * BadgeContainer
 *
 * The container component that wraps the badge and handles layout,
 * positioning, and accessibility attributes.
 *
 * Single Responsibility: Render the badge container with layout and styling.
 * Does not manage badge state or business logic.
 *
 * @module components/ui/Badge/BadgeContainer
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  BADGE_DEFAULTS,
} from './badgeVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getBadgeClasses,
  getBadgeContainerClasses,
} from './badgeUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for container animation. */
const CONTAINER_MOTION = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * BadgeContainer – the main badge wrapper with layout and styling.
 *
 * @component
 * @example
 * <BadgeContainer variant="primary" size="md">
 *   <BadgeIcon />
 *   <span>New</span>
 * </BadgeContainer>
 */
const BadgeContainer = memo(
  forwardRef(function BadgeContainer(
    {
      children,
      variant = BADGE_DEFAULTS.variant,
      size = BADGE_DEFAULTS.size,
      radius = BADGE_DEFAULTS.radius,
      position = BADGE_DEFAULTS.position,
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

    // Resolve defaults.
    const resolved = useMemo(
      () =>
        resolveDefaultProps({
          variant,
          size,
          radius,
          position,
          disabled,
          loading,
        }),
      [variant, size, radius, position, disabled, loading],
    );

    // Badge classes.
    const badgeClasses = useMemo(
      () =>
        getBadgeClasses({
          variant: resolved.variant,
          size: resolved.size,
          radius: resolved.radius,
          className,
          disabled: resolved.disabled,
          loading: resolved.loading,
        }),
      [
        resolved.variant,
        resolved.size,
        resolved.radius,
        className,
        resolved.disabled,
        resolved.loading,
      ],
    );

    // Container classes.
    const containerClasses = useMemo(
      () =>
        getBadgeContainerClasses({
          className: '',
          position: resolved.position,
          disabled: resolved.disabled,
        }),
      [resolved.position, resolved.disabled],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(badgeClasses, responsiveClasses),
      [badgeClasses, responsiveClasses],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return CONTAINER_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || `${resolved.variant} badge`,
        'aria-disabled': resolved.disabled || undefined,
        'aria-busy': resolved.loading || undefined,
        'data-variant': resolved.variant,
        'data-size': resolved.size,
        'data-position': resolved.position,
      }),
      [role, ariaLabel, resolved.variant, resolved.disabled, resolved.loading, resolved.size, resolved.position],
    );

    return (
      <motion.span
        ref={ref}
        className={finalClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {children}
      </motion.span>
    );
  }),
);

BadgeContainer.displayName = 'BadgeContainer';

BadgeContainer.propTypes = {
  /** Badge content (icon, text, etc.). */
  children: PropTypes.node,
  /** Visual variant. */
  variant: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
    'success',
    'warning',
    'error',
    'info',
    'outline',
    'ghost',
  ]),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  /** Position for floating badges. */
  position: PropTypes.oneOf([
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
    'top-center',
    'bottom-center',
  ]),
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

export default BadgeContainer;