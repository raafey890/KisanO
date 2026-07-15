/**
 * KisanO Design System — Avatar Package
 * AvatarContainer
 *
 * The container component that wraps the avatar and handles layout,
 * styling, and accessibility attributes.
 *
 * Single Responsibility: Render the avatar container with layout and styling.
 * Does not manage avatar state or business logic.
 *
 * @module components/ui/Avatar/AvatarContainer
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  AVATAR_DEFAULTS,
} from './avatarVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getAvatarClasses,
} from './avatarUtils';

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
 * AvatarContainer – the main avatar wrapper with layout and styling.
 *
 * @component
 * @example
 * <AvatarContainer variant="primary" size="md">
 *   <AvatarImage src="/image.jpg" />
 * </AvatarContainer>
 */
const AvatarContainer = memo(
  forwardRef(function AvatarContainer(
    {
      children,
      variant = AVATAR_DEFAULTS.variant,
      size = AVATAR_DEFAULTS.size,
      radius = AVATAR_DEFAULTS.radius,
      disabled = false,
      loading = false,
      hasImage = false,
      responsive,
      className = '',
      role = 'figure',
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
          disabled,
          loading,
        }),
      [variant, size, radius, disabled, loading],
    );

    // Avatar classes.
    const avatarClasses = useMemo(
      () =>
        getAvatarClasses({
          variant: resolved.variant,
          size: resolved.size,
          radius: resolved.radius,
          className,
          disabled: resolved.disabled,
          loading: resolved.loading,
          hasImage,
        }),
      [
        resolved.variant,
        resolved.size,
        resolved.radius,
        className,
        resolved.disabled,
        resolved.loading,
        hasImage,
      ],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(avatarClasses, responsiveClasses),
      [avatarClasses, responsiveClasses],
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
        'aria-label': ariaLabel || 'Avatar',
        'aria-disabled': resolved.disabled || undefined,
        'aria-busy': resolved.loading || undefined,
        'data-variant': resolved.variant,
        'data-size': resolved.size,
        'data-has-image': hasImage || undefined,
      }),
      [role, ariaLabel, resolved.variant, resolved.disabled, resolved.loading, resolved.size, hasImage],
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

AvatarContainer.displayName = 'AvatarContainer';

AvatarContainer.propTypes = {
  /** Avatar content (Image, Fallback, etc.). */
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
    'gradient',
  ]),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Whether avatar has an image. */
  hasImage: PropTypes.bool,
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

export default AvatarContainer;